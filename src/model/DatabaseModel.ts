import { SupportedDbIdentifier } from '@/types/database.types';

export interface DatabaseConfig {
  id: SupportedDbIdentifier;
  name: string;
}

export interface Connection {
  connectionId: string;
  connectionConfig: ConnectionConfig;
  createdAt: Date;
  isActive: boolean;
  updatedAt: Date;
}

export interface ConnectionConfig {
  pluginId: SupportedDbIdentifier;
  name: string;
  host: string;
  port: number;
  database: string;
  user?: string;
  password?: string;
}

export interface ConnectionResult {
  success: boolean;
  message: string;
  connectionTime?: number;
}

export interface QueryResult {
  success: boolean;
  message: string;
  result?: {
    rows: any[];
    rowCount: number | null;
    fields: any;
    executionTimeMs: number;
  };
}
