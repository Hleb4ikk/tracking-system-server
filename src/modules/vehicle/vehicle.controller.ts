import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CompanyRolesGuard } from 'src/guards/roles.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { VehicleService } from './vehicle.service';
import { CompanyRoles } from 'src/decorators/company-roles.decorator';
import { ROLES } from 'src/enums/roles';
import {
  createVehicleSchema,
  updateVehicleSchema,
  vehicleQuerySchema,
  type CreateVehicleDto,
  type UpdateVehicleDto,
  type VehicleQuery,
} from 'src/schemas/vehicleSchemas';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';

@Controller('/vehicles')
@UseGuards(AuthGuard, CompanyRolesGuard)
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Get()
  @CompanyRoles([ROLES.CO_FOUNDER, ROLES.LOGISTICIAN])
  async findVehicles(
    @Query(new ZodValidationPipe(vehicleQuerySchema))
    vehicleQuery: VehicleQuery,
    @CurrentUser('company_id')
    companyId: string,
  ) {
    const { page, ...vehicleFilters } = vehicleQuery;

    const vehicles = await this.vehicleService.findVehicles(page, 20, {
      ...vehicleFilters,
      companyId,
    });
    return vehicles;
  }

  @Post()
  @CompanyRoles([ROLES.CO_FOUNDER, ROLES.LOGISTICIAN])
  async createVehicle(
    @CurrentUser('company_id') companyId: string,
    @Body(new ZodValidationPipe(createVehicleSchema))
    createVehicleDto: CreateVehicleDto,
  ) {
    const vehicle = await this.vehicleService.createVehicle(
      companyId,
      createVehicleDto,
    );
    return { message: 'Vehicle created successfully!', vehicle };
  }

  @Patch(':id')
  @CompanyRoles([ROLES.CO_FOUNDER, ROLES.LOGISTICIAN])
  async updateVehicle(
    @CurrentUser('company_id') companyId: string,
    @Param('id', ParseUUIDPipe) vehicleId: string,
    @Body(new ZodValidationPipe(updateVehicleSchema))
    updateVehicleDto: UpdateVehicleDto,
  ) {
    const updatedFields = await this.vehicleService.updateVehicle(
      companyId,
      vehicleId,
      updateVehicleDto,
    );
    return { message: 'Vehicle was updated successfully!', updatedFields };
  }

  @Delete(':id')
  @CompanyRoles([ROLES.CO_FOUNDER, ROLES.LOGISTICIAN])
  async deleteVehicle(
    @CurrentUser('company_id') companyId: string,
    @Param('id', ParseUUIDPipe) vehicleId: string,
  ) {
    await this.vehicleService.deleteVehicle(companyId, vehicleId);
    return { message: 'Vehicle was deleted successfully!' };
  }
}
