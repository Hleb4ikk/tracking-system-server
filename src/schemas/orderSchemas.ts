import z from 'zod';

export const createOrderSchema = z.object({
  title: z.string().min(1),
  status: z.string().min(1),
  description: z.string().optional().nullable(),
  responsibleId: z.uuid(),
  recieverId: z.uuid(),
});

export const updateOrderSchema = z.object({
  title: z.string().min(1).optional(),
  status: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  responsibleId: z.uuid().optional(),
  recieverId: z.uuid().optional(),
});

export const orderFiltersSchema = z
  .object({
    title: z.string().min(1),
    status: z.string().min(1),
    responsibleId: z.uuid(),
    recieverId: z.uuid(),
    companyId: z.uuid(),
  })
  .partial();

export const orderQuerySchema = orderFiltersSchema.extend({
  page: z.preprocess((val) => Number(val), z.number().min(1).default(1)),
});

export type CreateOrderDto = z.infer<typeof createOrderSchema>;
export type UpdateOrderDto = z.infer<typeof updateOrderSchema>;
export type OrderFilters = z.infer<typeof orderFiltersSchema>;
export type OrderQuery = z.infer<typeof orderQuerySchema>;
