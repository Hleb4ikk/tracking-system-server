import {
  CreateRecieverDto,
  UpdateRecieverDto,
  RecieverFilters,
} from 'src/schemas/recieverSchemas';
import { Reciever } from 'src/types/Reciever';

export interface IRecieverRepository {
  findRecievers(
    limit: number,
    page: number,
    filters?: RecieverFilters,
  ): Promise<Reciever[]>;
  findRecieverById(recieverId: string): Promise<Reciever>;
  createReciever(
    companyId: string,
    createRecieverDto: CreateRecieverDto,
  ): Promise<Reciever>;
  updateReciever(
    recieverId: string,
    updateRecieverDto: UpdateRecieverDto,
  ): Promise<Partial<Reciever>>;
  deleteReciever(recieverId: string): Promise<void>;
}
