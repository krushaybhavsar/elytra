import { SupportedDbIdentifier } from '@/types/database';

export interface DatabaseConfig {
  id: SupportedDbIdentifier;
  name: string;
}

export interface Connection {
  connectionId: string;
  connectionConfig: ConnectionConfig;
  createdAt: Date;
  isActive: boolean;
}

export interface ConnectionConfig {
  pluginId: SupportedDbIdentifier;
  host: string;
  port: number;
  database: string;
  user?: string;
  password?: string;
}

export interface ConnectionTestResult {
  success: boolean;
  message: string;
  connectionTime?: number;
}
