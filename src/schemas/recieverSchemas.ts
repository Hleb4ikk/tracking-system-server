import z from 'zod';

export const createRecieverSchema = z.object({
  name: z.string().min(1),
  surname: z.string().min(1),
  email: z.email(),
  phone: z.e164(),
});

export const updateRecieverSchema = createRecieverSchema.partial();

export const recieverFiltersSchema = updateRecieverSchema;

export const vehicleQuerySchema = recieverFiltersSchema.extend({
  page: z.preprocess((val) => Number(val), z.number().min(1).default(1)),
});

export type CreateRecieverDto = z.infer<typeof createRecieverSchema>;

export type UpdateRecieverDto = z.infer<typeof updateRecieverSchema>;
