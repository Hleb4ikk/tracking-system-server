import { Injectable } from '@nestjs/common';
import { ISupplyChainRepository } from 'src/interfaces/ISupplyChainRepository';

@Injectable()
export class SupplyChainRepository implements ISupplyChainRepository {
  constructor() {}
}
