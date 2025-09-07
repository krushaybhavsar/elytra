import {
  Connection,
  ConnectionConfig,
  ConnectionResult,
  DatabaseConfig,
} from '@/model/DatabaseModel';
import DataSource from './DataSource';
import axios, { AxiosInstance } from 'axios';
import { SupportedDbIdentifier } from '@/types/database';

export default class APIDataSource implements DataSource {
  readonly api: AxiosInstance;

  constructor() {
    const baseUrl = `${import.meta.env.VITE_LOCAL_SERVER_BASE_URL || 'http://localhost'}:${Number(import.meta.env.VITE_LOCAL_SERVER_PORT) || 8080}`;
    this.api = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getSupportedDbIds(): Promise<SupportedDbIdentifier[]> {
    const res = await this.api.get<SupportedDbIdentifier[]>('/plugins/ids');
    return res.data;
  }

  async getSupportedDbConfigs(): Promise<DatabaseConfig[]> {
    const res = await this.api.get<DatabaseConfig[]>('/plugins/configs');
    return res.data;
  }

  async getSupportedDbConfig(id: SupportedDbIdentifier): Promise<DatabaseConfig | undefined> {
    const res = await this.api.get<DatabaseConfig | undefined>(`/plugins/${id}/config`);
    return res.data;
  }

  async createConnection(
    config: ConnectionConfig,
  ): Promise<{ connection?: Connection; result: ConnectionResult }> {
    const res = await this.api.post<{ connection?: Connection; result: ConnectionResult }>(
      '/connections/create',
      config,
    );
    return res.data;
  }

  async testConnection(config: ConnectionConfig): Promise<ConnectionResult> {
    const res = await this.api.post<ConnectionResult>('/connections/test', config);
    return res.data;
  }

  async closeConnection(connectionId: string): Promise<void> {
    await this.api.post<void>(`/connections/close/${connectionId}`);
  }

  async getAllConnections(): Promise<Connection[]> {
    const res = await this.api.get<Connection[]>('/connections/all');
    return res.data;
  }
}
