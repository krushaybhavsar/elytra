import DatabaseService from './database/DatabaseService';

export const databaseService = new DatabaseService();

export async function initializeServices() {
  databaseService.initialize();
}
