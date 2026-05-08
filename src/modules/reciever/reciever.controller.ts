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
import { RecieverService } from './reciever.service';
import { CompanyRoles } from 'src/decorators/company-roles.decorator';
import { ROLES } from 'src/enums/roles';
import {
  createRecieverSchema,
  recieverQuerySchema,
  updateRecieverSchema,
  type CreateRecieverDto,
  type RecieverQuery,
  type UpdateRecieverDto,
} from 'src/schemas/recieverSchemas';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';

@Controller('/recievers')
@UseGuards(AuthGuard, CompanyRolesGuard)
export class RecieverController {
  constructor(private readonly recieverService: RecieverService) {}

  @Get()
  @CompanyRoles([ROLES.CO_FOUNDER, ROLES.LOGISTICIAN])
  async findRecievers(
    @Query(new ZodValidationPipe(recieverQuerySchema))
    recieverQuery: RecieverQuery,
    @CurrentUser('company_id')
    companyId: string,
  ) {
    const { page, ...recieverFilters } = recieverQuery;

    const recievers = await this.recieverService.findRecievers(page, 20, {
      ...recieverFilters,
      companyId,
    });
    return recievers;
  }

  @Post()
  @CompanyRoles([ROLES.CO_FOUNDER, ROLES.LOGISTICIAN])
  async createReciever(
    @CurrentUser('company_id') companyId: string,
    @Body(new ZodValidationPipe(createRecieverSchema))
    createRecieverDto: CreateRecieverDto,
  ) {
    const reciever = await this.recieverService.createReciever(
      companyId,
      createRecieverDto,
    );
    return { message: 'Reciever created successfully!', reciever };
  }

  @Patch(':id')
  @CompanyRoles([ROLES.CO_FOUNDER, ROLES.LOGISTICIAN])
  async updateReciever(
    @CurrentUser('company_id') companyId: string,
    @Param('id', ParseUUIDPipe) recieverId: string,
    @Body(new ZodValidationPipe(updateRecieverSchema))
    updateRecieverDto: UpdateRecieverDto,
  ) {
    const updatedFields = await this.recieverService.updateReciever(
      companyId,
      recieverId,
      updateRecieverDto,
    );
    return { message: 'Reciever was updated successfully!', updatedFields };
  }

  @Delete(':id')
  @CompanyRoles([ROLES.CO_FOUNDER, ROLES.LOGISTICIAN])
  async deleteReciever(
    @CurrentUser('company_id') companyId: string,
    @Param('id', ParseUUIDPipe) recieverId: string,
  ) {
    await this.recieverService.deleteReciever(companyId, recieverId);
    return { message: 'Reciever was deleted successfully!' };
  }
}
