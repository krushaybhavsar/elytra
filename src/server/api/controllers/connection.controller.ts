import { DatabaseConnectionManager } from '../../services/database/DatabaseConnectionManager';
import { Body, Controller, Get, Path, Post, Route } from 'tsoa';
import { Connection, ConnectionConfig, ConnectionTestResult } from '../../services/database/types';

@Route('connections')
export class ConnectionController extends Controller {
  private readonly _connectionManager = DatabaseConnectionManager.getInstance();

  @Post('create')
  async createConnection(@Body() config: ConnectionConfig): Promise<Connection> {
    return await this._connectionManager.createConnection(config);
  }

  @Post('test')
  async testConnection(@Body() config: ConnectionConfig): Promise<ConnectionTestResult> {
    return await this._connectionManager.testConnection(config);
  }

  @Post('close/{connectionId}')
  async closeConnection(@Path() connectionId: string): Promise<void> {
    return await this._connectionManager.closeConnection(connectionId);
  }

  @Get('all')
  async getAllConnectionIds(): Promise<string[]> {
    return this._connectionManager.getAllConnectionIds();
  }
}
