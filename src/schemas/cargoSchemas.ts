import z from 'zod';

export const cargoStatuses = [
  'assembly',
  'on the way',
  'delayed',
  'delivered',
] as const;

export const createCargoSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  supplyNodeConnectionId: z.uuid(),
  status: z.enum(cargoStatuses).optional(),
  vehicleId: z.uuid().nullable().optional(),
  orderId: z.uuid().nullable().optional(),
  responsibleId: z.uuid(),
});

export const updateCargoSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  supplyNodeConnectionId: z.uuid().optional(),
  status: z.enum(cargoStatuses).optional(),
  vehicleId: z.uuid().nullable().optional(),
  orderId: z.uuid().nullable().optional(),
  responsibleId: z.uuid().optional(),
});

export const cargoFiltersSchema = z
  .object({
    title: z.string().min(1),
    status: z.enum(cargoStatuses),
    supplyNodeConnectionId: z.uuid(),
    vehicleId: z.uuid(),
    orderId: z.uuid(),
    responsibleId: z.uuid(),
    companyId: z.uuid(),
  })
  .partial();

export const cargoQuerySchema = cargoFiltersSchema.extend({
  page: z.preprocess((val) => Number(val), z.number().min(1).default(1)),
});

export type CreateCargoDto = z.infer<typeof createCargoSchema>;
export type UpdateCargoDto = z.infer<typeof updateCargoSchema>;
export type CargoFilters = z.infer<typeof cargoFiltersSchema>;
export type CargoQuery = z.infer<typeof cargoQuerySchema>;
