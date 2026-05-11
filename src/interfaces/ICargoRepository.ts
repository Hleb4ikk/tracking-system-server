import {
  CreateCargoDto,
  UpdateCargoDto,
  CargoFilters,
} from 'src/schemas/cargoSchemas';
import { Cargo } from 'src/types/Cargo';

export interface ICargoRepository {
  findCargos(
    limit: number,
    page: number,
    filters?: CargoFilters,
  ): Promise<Cargo[]>;

  findCargoById(cargoId: string): Promise<Cargo>;

  createCargo(
    companyId: string,
    createCargoDto: CreateCargoDto,
  ): Promise<Cargo>;

  updateCargo(
    cargoId: string,
    updateCargoDto: UpdateCargoDto,
  ): Promise<Partial<Cargo>>;

  deleteCargo(cargoId: string): Promise<void>;
}
