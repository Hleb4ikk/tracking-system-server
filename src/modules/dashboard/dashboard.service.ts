import { Injectable } from '@nestjs/common';
import { PostgresService } from '../database/postgres.service';

export interface DashboardStats {
  totalOrders: number;
  activeCargos: number;
  totalVehicles: number;
  availableVehicles: number;
  ordersGrowth: number;
  cargosGrowth: number;
}

@Injectable()
export class DashboardService {
  constructor(private readonly db: PostgresService) {}

  async getStats(companyId: string): Promise<DashboardStats> {
    // Get total orders
    const ordersResult = await this.db.query(
      'SELECT COUNT(*) as count FROM orders WHERE company_id = $1',
      [companyId],
    );
    const totalOrders = parseInt(ordersResult.rows[0].count);

    // Get active cargos (not delivered)
    const cargosResult = await this.db.query(
      "SELECT COUNT(*) as count FROM cargos WHERE company_id = $1 AND status != 'delivered'",
      [companyId],
    );
    const activeCargos = parseInt(cargosResult.rows[0].count);

    // Get total vehicles
    const vehiclesResult = await this.db.query(
      'SELECT COUNT(*) as count FROM vehicles WHERE company_id = $1',
      [companyId],
    );
    const totalVehicles = parseInt(vehiclesResult.rows[0].count);

    // Get available vehicles (without cargo)
    const availableVehiclesResult = await this.db.query(
      'SELECT COUNT(*) as count FROM vehicles WHERE company_id = $1 AND cargo_id IS NULL',
      [companyId],
    );
    const availableVehicles = parseInt(availableVehiclesResult.rows[0].count);

    // Calculate growth (mock for now - would need historical data)
    const ordersGrowth = Math.floor(Math.random() * 20) - 5; // -5% to +15%
    const cargosGrowth = Math.floor(Math.random() * 20) - 5;

    return {
      totalOrders,
      activeCargos,
      totalVehicles,
      availableVehicles,
      ordersGrowth,
      cargosGrowth,
    };
  }

  async getRecentOrders(companyId: string) {
    const result = await this.db.query(
      `SELECT 
        o.id,
        o.title,
        o.status,
        o.description,
        r.name as receiver_name,
        r.surname as receiver_surname
      FROM orders o
      LEFT JOIN recievers r ON o.reciever_id = r.id
      WHERE o.company_id = $1
      ORDER BY o.id DESC
      LIMIT 5`,
      [companyId],
    );

    return result.rows;
  }

  async getActiveCargos(companyId: string) {
    const result = await this.db.query(
      `SELECT 
        c.id,
        c.title,
        c.status,
        c.description,
        v.title as vehicle_title
      FROM cargos c
      LEFT JOIN vehicles v ON c.vehicle_id = v.id
      WHERE c.company_id = $1 AND c.status != 'delivered'
      ORDER BY c.created_at DESC
      LIMIT 5`,
      [companyId],
    );

    return result.rows;
  }
}
