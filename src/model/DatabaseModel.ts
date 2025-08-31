import { SupportedDbIdentifier } from '@/types/database';

export interface DatabaseConfig {
  id: SupportedDbIdentifier;
  name: string;
}
