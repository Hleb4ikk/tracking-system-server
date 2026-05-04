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
import { SupplyNodeService } from './supply-node.service';
import { CompanyRoles } from 'src/decorators/company-roles.decorator';
import { ROLES } from 'src/enums/roles';
import {
  createSupplyNodeSchema,
  updateSupplyNodeSchema,
  vehicleQuerySchema,
  type CreateSupplyNodeDto,
  type SupplyNodeQuery,
  type UpdateSupplyNodeDto,
} from 'src/schemas/supplyNodeSchemas';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';

@Controller('/supply-nodes')
@UseGuards(AuthGuard, CompanyRolesGuard)
export class SupplyNodeController {
  constructor(private readonly supplyNodeService: SupplyNodeService) {}

  @Get()
  @CompanyRoles([ROLES.CO_FOUNDER, ROLES.LOGISTICIAN])
  async findSupplyNodes(
    @Query(new ZodValidationPipe(vehicleQuerySchema))
    supplyNodeQuery: SupplyNodeQuery,
    @CurrentUser('company_id')
    companyId: string,
  ) {
    const { page, ...supplyNodeFilters } = supplyNodeQuery;

    const supplyNodes = await this.supplyNodeService.findSupplyNodes(page, 20, {
      ...supplyNodeFilters,
      companyId,
    });
    return supplyNodes;
  }

  @Post()
  @CompanyRoles([ROLES.CO_FOUNDER, ROLES.LOGISTICIAN])
  async createSupplyNode(
    @CurrentUser('company_id') companyId: string,
    @Body(new ZodValidationPipe(createSupplyNodeSchema))
    createSupplyNodeDto: CreateSupplyNodeDto,
  ) {
    const supplyNode = await this.supplyNodeService.createSupplyNode(
      companyId,
      createSupplyNodeDto,
    );
    return { message: 'Supply node created successfully!', supplyNode };
  }

  @Patch(':id')
  @CompanyRoles([ROLES.CO_FOUNDER, ROLES.LOGISTICIAN])
  async updateSupplyNode(
    @CurrentUser('company_id') companyId: string,
    @Param('id', ParseUUIDPipe) supplyNodeId: string,
    @Body(new ZodValidationPipe(updateSupplyNodeSchema))
    updateSupplyNodeDto: UpdateSupplyNodeDto,
  ) {
    const updatedFields = await this.supplyNodeService.updateSupplyNode(
      companyId,
      supplyNodeId,
      updateSupplyNodeDto,
    );
    return { message: 'Supply node was updated successfully!', updatedFields };
  }

  @Delete(':id')
  @CompanyRoles([ROLES.CO_FOUNDER, ROLES.LOGISTICIAN])
  async deleteSupplyNode(
    @CurrentUser('company_id') companyId: string,
    @Param('id', ParseUUIDPipe) supplyNodeId: string,
  ) {
    await this.supplyNodeService.deleteSupplyNode(companyId, supplyNodeId);
    return { message: 'Supply node was deleted successfully!' };
  }
}
