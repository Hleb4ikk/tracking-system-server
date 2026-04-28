import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import {
  type CreateCompanyDto,
  createCompanySchema,
  type UpdateCompanyDto,
  updateCompanySchema,
} from 'src/schemas/companySchema';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { type User } from 'src/types/User';

@Controller('/companies')
@UseGuards(AuthGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  async getUserCompany(@CurrentUser('company_id') companyId) {
    const company = await this.companyService.getCompanyById(companyId);

    return { company };
  }

  @Post()
  async createCompany(
    @Body(new ZodValidationPipe(createCompanySchema))
    createCompanyDto: CreateCompanyDto,
    @CurrentUser() user: User,
  ) {
    const company = await this.companyService.createCompany(
      user,
      createCompanyDto,
    );
    return { message: 'Company was created successfully!', company };
  }

  @Patch()
  async updateCompany(
    @Body(new ZodValidationPipe(updateCompanySchema))
    updateCompanyDto: UpdateCompanyDto,
    @CurrentUser('company_id') company_id: string,
  ) {
    const updatedFields = await this.companyService.updateCompanyById(
      company_id,
      updateCompanyDto,
    );
    return { message: 'Company was updated successfully!', updatedFields };
  }

  @Delete()
  async deleteUserCompany(@CurrentUser('company_id') companyId: string) {
    await this.companyService.deleteCompanyById(companyId);
    return { message: 'Company was deleted successfully!' };
  }
}
