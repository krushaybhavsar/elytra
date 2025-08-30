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

  async getSupportedDatabases(): Promise<string[]> {
    const res = await this.api.get<string[]>('/database/supported-databases');
    return res.data;
  }
}
