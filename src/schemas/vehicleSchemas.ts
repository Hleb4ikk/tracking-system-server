import { DeliveryType } from 'src/enums/DeliveryType';
import z from 'zod';

export const createVehicleSchema = z.object({
  title: z.string().min(1),
  deliveryType: z.enum(DeliveryType),
});

export const updateVehicleSchema = z.object({
  title: z.string().min(1).optional(),
  deliveryType: z.enum(DeliveryType).optional(),
  cargoId: z.uuid().nullable().optional(),
});

export const vehicleFiltersSchema = z
  .object({
    title: z.string().min(1),
    deliveryType: z.enum(DeliveryType),
    companyId: z.uuid(),
  })
  .partial();

export const vehicleQuerySchema = vehicleFiltersSchema.extend({
  page: z.preprocess((val) => Number(val), z.number().min(1).default(1)),
});

export type VehicleQuery = z.infer<typeof vehicleQuerySchema>;
export type VehicleFilters = z.infer<typeof vehicleFiltersSchema>;
export type CreateVehicleDto = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleDto = z.infer<typeof updateVehicleSchema>;
