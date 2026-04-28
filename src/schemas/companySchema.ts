import z from 'zod';

export const createCompanySchema = z.object({
  title: z.string(),
  description: z.string().optional().nullable(),
});
export const updateCompanySchema = z.object({
  title: z.string().optional(),
  description: z.string().optional().nullable(),
  ownerId: z.uuid().optional(),
});

export type CreateCompanyDto = z.infer<typeof createCompanySchema>;

export type UpdateCompanyDto = z.infer<typeof updateCompanySchema>;
