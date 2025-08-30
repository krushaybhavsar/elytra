import { dataSource } from '@/services/service.config';
import DatabaseManager from './DatabaseManager';

export const databaseManager = new DatabaseManager(dataSource);
