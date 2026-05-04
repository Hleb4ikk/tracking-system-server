import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { CompanyRolesGuard } from 'src/guards/roles.guard';
import { SupplyChainService } from './supply-chain.service';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import {
  type CreateSupplyChainDto,
  createSupplyChainSchema,
  type SupplyChainQuery,
  supplyChainQuerySchema,
} from 'src/schemas/supplyChainSchemas';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { CompanyRoles } from 'src/decorators/company-roles.decorator';
import { ROLES } from 'src/enums/roles';

@Controller('/supply-chains')
@UseGuards(AuthGuard, CompanyRolesGuard)
export class SupplyChainController {
  constructor(private readonly supplyChainService: SupplyChainService) {}

  @Get()
  @CompanyRoles([ROLES.CO_FOUNDER, ROLES.LOGISTICIAN])
  async findSupplyChains(
    @Query(new ZodValidationPipe(supplyChainQuerySchema))
    vehicleQuery: SupplyChainQuery,

    @CurrentUser('company_id')
    companyId: string,
  ) {
    const { page, ...vehicleFilters } = vehicleQuery;

    const supplyChains = await this.supplyChainService.findSupplyChains(
      page,
      20,
      {
        ...vehicleFilters,
        companyId,
      },
    );
    return supplyChains;
  }

  @Post()
  @CompanyRoles([ROLES.CO_FOUNDER, ROLES.LOGISTICIAN])
  async createSupplyChain(
    @Body(new ZodValidationPipe(createSupplyChainSchema))
    supplyChainSchemaDto: CreateSupplyChainDto,
    @CurrentUser('company_id')
    companyId: string,
  ) {
    const supplyChain = await this.supplyChainService.createSupplyChain(
      companyId,
      supplyChainSchemaDto,
    );
    return { message: 'Supply chain successfully created!', supplyChain };
  }

  @Delete(':id')
  @CompanyRoles([ROLES.CO_FOUNDER, ROLES.LOGISTICIAN])
  async deleteSupplyChain(
    @Param('id', ParseUUIDPipe) supplyChainId: string,
    @CurrentUser('company_id') companyId: string,
  ) {
    await this.supplyChainService.deleteSupplyChain(companyId, supplyChainId);
    return { message: 'Supply chain successfully deleted!' };
  }
}
