import { type JQuantsData } from './jquants-data';

export interface IJQuantsDataRepository {
  create(data: JQuantsData): Promise<JQuantsData>;
  save(data: JQuantsData): Promise<JQuantsData>;
}
