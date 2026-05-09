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
import { AuthGuard } from 'src/guards/auth.guard';
import { CompanyRolesGuard } from 'src/guards/roles.guard';
import { SupplyChainService } from './supply-chain.service.js';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import {
  type CreateSupplyChainDto,
  createSupplyChainSchema,
  type SupplyChainQuery,
  supplyChainQuerySchema,
  type UpdateSupplyChainDto,
  updateSupplyChainSchema,
} from 'src/schemas/supplyChainSchemas';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { CompanyRoles } from 'src/decorators/company-roles.decorator';
import { ROLES } from 'src/enums/roles';
import flatted from 'src/lib/flatted';

@Controller('/supply-chains')
@UseGuards(AuthGuard, CompanyRolesGuard)
export class SupplyChainController {
  constructor(private readonly supplyChainService: SupplyChainService) {}

  @Get()
  @CompanyRoles([ROLES.CO_FOUNDER, ROLES.LOGISTICIAN])
  async findSupplyChains(
    @Query(new ZodValidationPipe(supplyChainQuerySchema))
    supplyChainQuery: SupplyChainQuery,

    @CurrentUser('company_id')
    companyId: string,
  ) {
    const { page, ...supplyChainFilters } = supplyChainQuery;

    const supplyChains = await this.supplyChainService.findSupplyChains(
      page,
      20,
      {
        ...supplyChainFilters,
        companyId,
      },
    );
    return supplyChains;
  }

  @Get(':id')
  @CompanyRoles([ROLES.CO_FOUNDER, ROLES.LOGISTICIAN])
  async findSupplyChainById(
    @Param('id', ParseUUIDPipe) supplyChainId: string,
    @CurrentUser('company_id') companyId: string,
  ) {
    const supplyChain = await this.supplyChainService.findSupplyChainById(
      companyId,
      supplyChainId,
    );
    return (await flatted).toJSON(supplyChain) as unknown;
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
    return {
      message: 'Supply chain successfully created!',
      supplyChain: (await flatted).toJSON(supplyChain) as unknown,
    };
  }

  @Patch(':id')
  @CompanyRoles([ROLES.CO_FOUNDER, ROLES.LOGISTICIAN])
  async updateSupplyChain(
    @Param('id', ParseUUIDPipe) supplyChainId: string,
    @CurrentUser('company_id') companyId: string,
    @Body(new ZodValidationPipe(updateSupplyChainSchema))
    updateSupplyChainDto: UpdateSupplyChainDto,
  ) {
    const updatedFields = await this.supplyChainService.updateSupplyChain(
      companyId,
      supplyChainId,
      updateSupplyChainDto,
    );
    return {
      message: 'Supply chain was updated successfully!',
      updatedFields: (await flatted).toJSON(updatedFields) as unknown,
    };
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
