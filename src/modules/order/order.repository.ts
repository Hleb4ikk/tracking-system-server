import { Injectable } from '@nestjs/common';
import { PostgresService } from '../database/postgres.service';
import { IOrderRepository } from 'src/interfaces/IOrderRepository';
import {
  CreateOrderDto,
  OrderFilters,
  UpdateOrderDto,
} from 'src/schemas/orderSchemas';
import { Order, OrderWithHistory, OrderWithDetails } from 'src/types/Order';

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(private readonly postgresService: PostgresService) {}

  async findOrders(
    limit: number,
    page: number,
    filters?: OrderFilters,
  ): Promise<OrderWithHistory[]> {
    const title = filters?.title ? `%${filters.title}%` : '%';
    const status = filters?.status ?? null;

    const result = await this.postgresService.query<OrderWithHistory>(
      `SELECT 
        o.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', sh.id,
              'title', sh.title,
              'created_at', sh.created_at,
              'company_id', sh.company_id,
              'order_id', sh.order_id
            )
            ORDER BY sh.created_at DESC
          ) FILTER (WHERE sh.id IS NOT NULL), '[]'
        ) AS status_history
       FROM orders o
       LEFT JOIN status_history sh ON o.id = sh.order_id
       WHERE o.company_id = COALESCE($1, o.company_id)
        AND o.title ILIKE $2
        AND (o.status = $3 OR $3 IS NULL)
        AND o.responsible_id = COALESCE($4, o.responsible_id)
        AND o.reciever_id = COALESCE($5, o.reciever_id)
       GROUP BY o.id
       ORDER BY o.id DESC
       LIMIT $6 OFFSET $7;
      `,
      [
        filters?.companyId,
        title,
        status,
        filters?.responsibleId,
        filters?.recieverId,
        limit,
        limit * (page - 1),
      ],
    );
    return result.rows;
  }

  async findOrderById(orderId: string): Promise<Order> {
    const result = await this.postgresService.query<Order>(
      `SELECT * FROM orders WHERE id = $1;`,
      [orderId],
    );
    return result.rows[0];
  }

  async findOrderWithHistoryById(orderId: string): Promise<OrderWithHistory> {
    const result = await this.postgresService.query<OrderWithHistory>(
      `SELECT 
        o.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', sh.id,
              'title', sh.title,
              'created_at', sh.created_at,
              'company_id', sh.company_id,
              'order_id', sh.order_id
            )
            ORDER BY sh.created_at DESC
          ) FILTER (WHERE sh.id IS NOT NULL), '[]'
        ) AS status_history
       FROM orders o
       LEFT JOIN status_history sh ON o.id = sh.order_id
       WHERE o.id = $1
       GROUP BY o.id;
      `,
      [orderId],
    );
    return result.rows[0];
  }

  async findOrderWithDetailsById(orderId: string): Promise<OrderWithDetails> {
    const result = await this.postgresService.query<OrderWithDetails>(
      `SELECT 
        o.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', sh.id,
              'title', sh.title,
              'created_at', sh.created_at,
              'company_id', sh.company_id,
              'order_id', sh.order_id
            )
            ORDER BY sh.created_at DESC
          ) FILTER (WHERE sh.id IS NOT NULL), '[]'
        ) AS status_history,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', c.id,
              'title', c.title,
              'description', c.description,
              'supply_node_connection_id', c.supply_node_connection_id,
              'status', c.status,
              'vehicle_id', c.vehicle_id,
              'order_id', c.order_id,
              'responsible_id', c.responsible_id,
              'company_id', c.company_id,
              'created_at', c.created_at,
              'updated_at', c.updated_at
            )
          ) FILTER (WHERE c.id IS NOT NULL), '[]'
        ) AS cargos
       FROM orders o
       LEFT JOIN status_history sh ON o.id = sh.order_id
       LEFT JOIN cargos c ON o.id = c.order_id
       WHERE o.id = $1
       GROUP BY o.id;
      `,
      [orderId],
    );
    return result.rows[0];
  }

  async createOrder(
    companyId: string,
    createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    const result = await this.postgresService.query<Order>(
      `INSERT INTO orders(title, status, description, company_id, responsible_id, reciever_id) 
       VALUES($1, $2, $3, $4, $5, $6) RETURNING *;`,
      [
        createOrderDto.title,
        createOrderDto.status,
        createOrderDto.description ?? null,
        companyId,
        createOrderDto.responsibleId,
        createOrderDto.recieverId,
      ],
    );
    return result.rows[0];
  }

  async updateOrder(
    orderId: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Partial<Order>> {
    await this.postgresService.query<Order>(
      `UPDATE orders SET 
            title = COALESCE($1, title), 
            status = COALESCE($2, status),
            description = COALESCE($3, description),
            responsible_id = COALESCE($4, responsible_id),
            reciever_id = COALESCE($5, reciever_id)
            WHERE id = $6;
            `,
      [
        updateOrderDto.title ?? null,
        updateOrderDto.status ?? null,
        updateOrderDto.description ?? null,
        updateOrderDto.responsibleId ?? null,
        updateOrderDto.recieverId ?? null,
        orderId,
      ],
    );
    return updateOrderDto;
  }

  async deleteOrder(orderId: string): Promise<void> {
    await this.postgresService.query<Order>(
      `DELETE FROM orders WHERE id = $1`,
      [orderId],
    );
  }
}
