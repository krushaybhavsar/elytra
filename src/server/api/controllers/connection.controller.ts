import {
  Connection,
  ConnectionConfig,
  ConnectionResult,
} from '../../services/database/types/plugin.types';
import { DatabaseConnectionManager } from '../../services/database/DatabaseConnectionManager';
import { Body, Controller, Get, Path, Post, Route } from 'tsoa';

@Route('connections')
export class ConnectionController extends Controller {
  private readonly _connectionManager = DatabaseConnectionManager.getInstance();

  @Get('all')
  async getAllConnections(): Promise<Connection[]> {
    return this._connectionManager.getAllConnections();
  }

  @Post('create')
  async createConnection(
    @Body() config: ConnectionConfig,
  ): Promise<{ connection?: Connection; result: ConnectionResult }> {
    return await this._connectionManager.createConnection(config);
  }

  @Post('test')
  async testConnection(@Body() config: ConnectionConfig): Promise<ConnectionResult> {
    return await this._connectionManager.testConnection(config);
  }

  @Post('{connectionId}/close')
  async closeConnection(@Path() connectionId: string): Promise<void> {
    return await this._connectionManager.closeConnection(connectionId);
  }
}
