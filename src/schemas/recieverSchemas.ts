import z from 'zod';

export const createRecieverSchema = z.object({
  name: z.string().min(1),
  surname: z.string().min(1),
  email: z.email(),
  phone: z.e164(),
});

export const updateRecieverSchema = createRecieverSchema.partial();

export const recieverFiltersSchema = z
  .object({
    name: z.string().min(1),
    surname: z.string().min(1),
    email: z.email(),
    phone: z.e164(),
    companyId: z.uuid(),
  })
  .partial();

export const recieverQuerySchema = recieverFiltersSchema.extend({
  page: z.preprocess((val) => Number(val), z.number().min(1).default(1)),
});

export type CreateRecieverDto = z.infer<typeof createRecieverSchema>;
export type UpdateRecieverDto = z.infer<typeof updateRecieverSchema>;
export type RecieverFilters = z.infer<typeof recieverFiltersSchema>;
export type RecieverQuery = z.infer<typeof recieverQuerySchema>;
