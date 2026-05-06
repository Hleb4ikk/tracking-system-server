import z from 'zod';

export const createSupplyChainSchema = z.object({
  title: z.string(),
  description: z.string().optional().nullable(),
  supply_node_connections: z
    .array(
      z.object({
        startNodeId: z.uuid(),
        destinationNodeId: z.uuid(),
        distance: z.number().positive(),
      }),
    )
    .optional(),
});

export const updateSupplyChainSchema = createSupplyChainSchema.partial();

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
export type UpdateSupplyChainDto = z.infer<typeof updateSupplyChainSchema>;

export type SupplyChainFilters = z.infer<typeof supplyChainFiltersSchema>;
export type SupplyChainQuery = z.infer<typeof supplyChainQuerySchema>;
