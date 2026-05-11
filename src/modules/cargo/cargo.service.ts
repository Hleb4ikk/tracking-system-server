import { Injectable, NotFoundException } from '@nestjs/common';
import { CargoRepository } from './cargo.repository';
import {
  CreateCargoDto,
  CargoFilters,
  UpdateCargoDto,
} from 'src/schemas/cargoSchemas';
import { CompanyRepository } from '../company/company.repository';
import { UserRepository } from '../user/user.repository';
import { VehicleRepository } from '../vehicle/vehicle.repository';
import { OrderRepository } from '../order/order.repository';
import { Cargo } from 'src/types/Cargo';

@Injectable()
export class CargoService {
  constructor(
    private readonly cargoRepository: CargoRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly userRepository: UserRepository,
    private readonly vehicleRepository: VehicleRepository,
    private readonly orderRepository: OrderRepository,
  ) {}

  async findCargos(
    page: number,
    limit: number,
    filters?: CargoFilters,
  ): Promise<Cargo[]> {
    if (filters?.companyId) {
      const company = await this.companyRepository.findCompanyById(
        filters.companyId,
      );
      if (!company) {
        throw new NotFoundException("Company from filters wasn't found.");
      }
    }

    if (filters?.responsibleId) {
      const user = await this.userRepository.findUserById(
        filters.responsibleId,
      );
      if (!user) {
        throw new NotFoundException("Responsible user wasn't found.");
      }
    }

    if (filters?.vehicleId) {
      const vehicle = await this.vehicleRepository.findVehicleById(
        filters.vehicleId,
      );
      if (!vehicle) {
        throw new NotFoundException("Vehicle wasn't found.");
      }
    }

    if (filters?.orderId) {
      const order = await this.orderRepository.findOrderById(filters.orderId);
      if (!order) {
        throw new NotFoundException("Order wasn't found.");
      }
    }

    return await this.cargoRepository.findCargos(limit, page, filters);
  }

  async findCargoById(companyId: string, cargoId: string): Promise<Cargo> {
    const cargo = await this.cargoRepository.findCargoById(cargoId);

    if (!cargo || cargo.company_id !== companyId) {
      throw new NotFoundException("Cargo wasn't found.");
    }

    return cargo;
  }

  async createCargo(
    companyId: string,
    createCargoDto: CreateCargoDto,
  ): Promise<Cargo> {
    const company = await this.companyRepository.findCompanyById(companyId);
    if (!company) {
      throw new NotFoundException("User company wasn't found to create cargo.");
    }

    const responsible = await this.userRepository.findUserById(
      createCargoDto.responsibleId,
    );
    if (!responsible) {
      throw new NotFoundException("Responsible user wasn't found.");
    }

    if (createCargoDto.vehicleId) {
      const vehicle = await this.vehicleRepository.findVehicleById(
        createCargoDto.vehicleId,
      );
      if (!vehicle) {
        throw new NotFoundException("Vehicle wasn't found.");
      }
    }

    if (createCargoDto.orderId) {
      const order = await this.orderRepository.findOrderById(
        createCargoDto.orderId,
      );
      if (!order) {
        throw new NotFoundException("Order wasn't found.");
      }
    }

    return await this.cargoRepository.createCargo(companyId, createCargoDto);
  }

  async updateCargo(
    companyId: string,
    cargoId: string,
    updateCargoDto: UpdateCargoDto,
  ): Promise<Partial<Cargo>> {
    const cargo = await this.cargoRepository.findCargoById(cargoId);

    if (!cargo || cargo.company_id !== companyId) {
      throw new NotFoundException("Cargo wasn't found.");
    }

    if (updateCargoDto.responsibleId) {
      const responsible = await this.userRepository.findUserById(
        updateCargoDto.responsibleId,
      );
      if (!responsible) {
        throw new NotFoundException("Responsible user wasn't found.");
      }
    }

    if (updateCargoDto.vehicleId) {
      const vehicle = await this.vehicleRepository.findVehicleById(
        updateCargoDto.vehicleId,
      );
      if (!vehicle) {
        throw new NotFoundException("Vehicle wasn't found.");
      }
    }

    if (updateCargoDto.orderId) {
      const order = await this.orderRepository.findOrderById(
        updateCargoDto.orderId,
      );
      if (!order) {
        throw new NotFoundException("Order wasn't found.");
      }
    }

    return await this.cargoRepository.updateCargo(cargoId, updateCargoDto);
  }

  async deleteCargo(companyId: string, cargoId: string): Promise<void> {
    const cargo = await this.cargoRepository.findCargoById(cargoId);

    if (!cargo || cargo.company_id !== companyId) {
      throw new NotFoundException('Nothing to delete');
    }

    await this.cargoRepository.deleteCargo(cargoId);
  }
}
