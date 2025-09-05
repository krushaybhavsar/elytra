import { dataSource } from '@/services/service.config';
import DbPluginManager from './DBPluginManager';
import DbConnectionManager from './DbConnectionManager';

export const dbPluginManager = new DbPluginManager(dataSource);
export const dbConnectionManager = new DbConnectionManager(dataSource);
