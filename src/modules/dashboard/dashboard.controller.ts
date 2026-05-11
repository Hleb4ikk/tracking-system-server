import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { DashboardService, DashboardStats } from './dashboard.service';
import { CurrentUser } from 'src/decorators/current-user.decorator';

@Controller('/dashboard')
@UseGuards(AuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('/stats')
  async getStats(
    @CurrentUser('company_id') companyId: string,
  ): Promise<DashboardStats> {
    return await this.dashboardService.getStats(companyId);
  }

  @Get('/recent-orders')
  async getRecentOrders(@CurrentUser('company_id') companyId: string) {
    return await this.dashboardService.getRecentOrders(companyId);
  }

  @Get('/active-cargos')
  async getActiveCargos(@CurrentUser('company_id') companyId: string) {
    return await this.dashboardService.getActiveCargos(companyId);
  }
}
