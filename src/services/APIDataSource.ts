import { DatabaseConfig } from '@/model/DatabaseModel';
import DataSource from './DataSource';
import axios, { AxiosInstance } from 'axios';

export default class APIDataSource implements DataSource {
  readonly api: AxiosInstance;

  constructor() {
    const baseUrl = 'http://localhost:8080';

    this.api = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getSupportedDbIds(): Promise<string[]> {
    const res = await this.api.get<string[]>('/database/plugins/ids');
    return res.data;
  }

  async getSupportedDbConfigs(): Promise<DatabaseConfig[]> {
    const res = await this.api.get<DatabaseConfig[]>('/database/plugins/configs');
    return res.data;
  }

  async getSupportedDbConfig(id: string): Promise<DatabaseConfig | undefined> {
    const res = await this.api.get<DatabaseConfig | undefined>(`/database/plugin/${id}/config`);
    return res.data;
  }
}
