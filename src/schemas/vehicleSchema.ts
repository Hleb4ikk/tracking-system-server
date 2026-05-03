import { DeliveryType } from 'src/enums/DeliveryType';
import z from 'zod';

export const createVehicleSchema = z.object({
  title: z.string().min(1),
  deliveryType: z.enum(DeliveryType),
  companyId: z.uuid(),
});

export type CreateVehicleDto = z.infer<typeof createVehicleSchema>;
