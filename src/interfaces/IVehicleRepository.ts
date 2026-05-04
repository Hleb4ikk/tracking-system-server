import { CreateVehicleDto, VehicleFilters } from 'src/schemas/vehicleSchemas';
import { Vehicle } from 'src/types/Vehicle';

export interface IVehicleRepository {
  findVehicles(
    limit: number,
    page: number,
    filters?: VehicleFilters,
  ): Promise<Vehicle[]>;
  findVehicleById(vehicleId: string): Promise<Vehicle>;
  createVehicle(
    companyId: string,
    createVehicleDto: CreateVehicleDto,
  ): Promise<Vehicle>;
  deleteVehicle(vehicleId: string): Promise<void>;
}
