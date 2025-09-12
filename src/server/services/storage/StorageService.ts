import WinstonLogger from '@/utils/log-utils';
import { schemaDefaults, StorageSchema } from './schema';
import Store from 'electron-store';
import ElectronStore from 'electron-store';

export default class StorageService {
  private readonly _logger = WinstonLogger.getInstance().getLogger('StorageService');
  private store: ElectronStore<StorageSchema>;

  constructor() {
    this.store = new Store<StorageSchema>({
      name: 'app-storage',
      defaults: schemaDefaults,
    });
  }

  initialize() {
    this._logger.info('Initializing StorageService');
  }

  get<K extends keyof StorageSchema>(key: K): StorageSchema[K] {
    return this.store.get(key);
  }

  set<K extends keyof StorageSchema>(key: K, value: StorageSchema[K]): void {
    this.store.set(key, value);
  }

  delete<K extends keyof StorageSchema>(key: K): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}
