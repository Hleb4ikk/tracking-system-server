import z from 'zod';

export const createSupplyChainSchema = z.object({
  title: z.string(),
  description: z.string().optional().nullable(),
});

export const supplyChainFiltersSchema = z
  .object({
    title: z.string().min(1),
    companyId: z.uuid(),
  })
  .partial();

export const supplyChainQuerySchema = supplyChainFiltersSchema.extend({
  page: z.preprocess((val) => Number(val), z.number().min(1).default(1)),
});

export type CreateSupplyChainDto = z.infer<typeof createSupplyChainSchema>;
export type SupplyChainFilters = z.infer<typeof supplyChainFiltersSchema>;
export type SupplyChainQuery = z.infer<typeof supplyChainQuerySchema>;
