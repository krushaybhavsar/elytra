import { DatabaseConfig } from '@/model/DatabaseModel';
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
    const res = await this.api.get<SupportedDbIdentifier[]>('/database/plugins/ids');
    return res.data;
  }

  async getSupportedDbConfigs(): Promise<DatabaseConfig[]> {
    const res = await this.api.get<DatabaseConfig[]>('/database/plugins/configs');
    return res.data;
  }

  async getSupportedDbConfig(id: SupportedDbIdentifier): Promise<DatabaseConfig | undefined> {
    const res = await this.api.get<DatabaseConfig | undefined>(`/database/plugin/${id}/config`);
    return res.data;
  }
}
