import { Injectable, NotFoundException } from '@nestjs/common';
import { VehicleRepository } from './vehicle.repository';
import { CreateVehicleDto, VehicleFilters } from 'src/schemas/vehicleSchemas';
import { CompanyRepository } from '../company/company.repository';
import { Vehicle } from 'src/types/Vehicle';

@Injectable()
export class VehicleService {
  constructor(
    private readonly vehicleRepository: VehicleRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}

  async findVehicles(
    page: number,
    limit: number,
    filters?: VehicleFilters,
  ): Promise<Vehicle[]> {
    if (filters?.companyId) {
      const company = await this.companyRepository.findCompanyById(
        filters.companyId,
      );
      if (!company) {
        throw new NotFoundException("Company from filters wasn't found.");
      }
    }
    return await this.vehicleRepository.findVehicles(limit, page, filters);
  }

  async createVehicle(
    companyId: string,
    createVehicleDto: CreateVehicleDto,
  ): Promise<Vehicle> {
    const company = await this.companyRepository.findCompanyById(companyId);

    if (!company) {
      throw new NotFoundException(
        "User company wasn't found to create vehicle.",
      );
    }

    return await this.vehicleRepository.createVehicle(
      companyId,
      createVehicleDto,
    );
  }
  async deleteVehicle(companyId: string, vehicleId: string): Promise<void> {
    const vehicle = await this.vehicleRepository.findVehicleById(vehicleId);

    if (!vehicle || vehicle.company_id !== companyId) {
      throw new NotFoundException('Nothing to delete');
    }

    await this.vehicleRepository.deleteVehicle(vehicleId);
  }
}
