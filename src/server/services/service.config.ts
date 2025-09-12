import StorageService from './storage/StorageService';
import DatabaseService from './database/DatabaseService';

export const storageService = new StorageService();
export const databaseService = new DatabaseService();

export async function initializeServices() {
  storageService.initialize();
  databaseService.initialize();
}
