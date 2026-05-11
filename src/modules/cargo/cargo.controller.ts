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
import { CargoService } from './cargo.service';
import { CompanyRoles } from 'src/decorators/company-roles.decorator';
import { ROLES } from 'src/enums/roles';
import {
  createCargoSchema,
  cargoQuerySchema,
  updateCargoSchema,
  type CreateCargoDto,
  type CargoQuery,
  type UpdateCargoDto,
} from 'src/schemas/cargoSchemas';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';

@Controller('/cargos')
@UseGuards(AuthGuard, CompanyRolesGuard)
export class CargoController {
  constructor(private readonly cargoService: CargoService) {}

  @Get()
  @CompanyRoles([ROLES.CO_FOUNDER, ROLES.LOGISTICIAN, ROLES.EXPEDITOR])
  async findCargos(
    @Query(new ZodValidationPipe(cargoQuerySchema))
    cargoQuery: CargoQuery,
    @CurrentUser('company_id')
    companyId: string,
  ) {
    const { page, ...cargoFilters } = cargoQuery;

    const cargos = await this.cargoService.findCargos(page, 20, {
      ...cargoFilters,
      companyId,
    });
    return cargos;
  }

  @Get(':id')
  @CompanyRoles([ROLES.CO_FOUNDER, ROLES.LOGISTICIAN, ROLES.EXPEDITOR])
  async findCargoById(
    @Param('id', ParseUUIDPipe) cargoId: string,
    @CurrentUser('company_id') companyId: string,
  ) {
    const cargo = await this.cargoService.findCargoById(companyId, cargoId);
    return { cargo };
  }

  @Post()
  @CompanyRoles([ROLES.CO_FOUNDER, ROLES.LOGISTICIAN])
  async createCargo(
    @CurrentUser('company_id') companyId: string,
    @Body(new ZodValidationPipe(createCargoSchema))
    createCargoDto: CreateCargoDto,
  ) {
    const cargo = await this.cargoService.createCargo(
      companyId,
      createCargoDto,
    );
    return { message: 'Cargo created successfully!', cargo };
  }

  @Patch(':id')
  @CompanyRoles([ROLES.CO_FOUNDER, ROLES.LOGISTICIAN, ROLES.EXPEDITOR])
  async updateCargo(
    @CurrentUser('company_id') companyId: string,
    @Param('id', ParseUUIDPipe) cargoId: string,
    @Body(new ZodValidationPipe(updateCargoSchema))
    updateCargoDto: UpdateCargoDto,
  ) {
    const updatedFields = await this.cargoService.updateCargo(
      companyId,
      cargoId,
      updateCargoDto,
    );
    return { message: 'Cargo was updated successfully!', updatedFields };
  }

  @Delete(':id')
  @CompanyRoles([ROLES.CO_FOUNDER, ROLES.LOGISTICIAN])
  async deleteCargo(
    @CurrentUser('company_id') companyId: string,
    @Param('id', ParseUUIDPipe) cargoId: string,
  ) {
    await this.cargoService.deleteCargo(companyId, cargoId);
    return { message: 'Cargo was deleted successfully!' };
  }
}
