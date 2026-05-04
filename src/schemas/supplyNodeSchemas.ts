import z from 'zod';
import countries from 'country-list';

export const createSupplyNodeSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  country: z.enum(countries.getNames()),
  zip: z.string(),
  region: z.string(),
  city: z.string(),
  address_line: z.string(),
});

export const updateSupplyNodeSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  country: z.enum(countries.getNames()).optional(),
  zip: z.string().optional(),
  region: z.string().optional(),
  city: z.string().optional(),
  address_line: z.string().optional(),
});

export const supplyNodeFiltersSchema = z
  .object({
    title: z.string().min(1),
    country: z.enum(countries.getNames()),
    zip: z.string(),
    region: z.string(),
    city: z.string(),
    address_line: z.string(),
    companyId: z.uuid(),
  })
  .partial();

export const vehicleQuerySchema = supplyNodeFiltersSchema.extend({
  page: z.preprocess((val) => Number(val), z.number().min(1).default(1)),
});

export type SupplyNodeQuery = z.infer<typeof vehicleQuerySchema>;
export type SupplyNodeFilters = z.infer<typeof supplyNodeFiltersSchema>;
export type CreateSupplyNodeDto = z.infer<typeof createSupplyNodeSchema>;
export type UpdateSupplyNodeDto = z.infer<typeof updateSupplyNodeSchema>;
