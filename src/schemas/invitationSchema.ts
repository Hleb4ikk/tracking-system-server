import { ROLES } from 'src/enums/roles';
import z from 'zod';

export const createInvitationSchema = z.object({
  recieverEmail: z.email(),
  role: z.enum(ROLES),
  daysToDelete: z.int32().optional(),
});

export const invitationFiltersSchema = z
  .object({
    email: z.email(),
    createdBy: z.string(),
    companyId: z.uuid(),
    role: z.enum(ROLES),
  })
  .partial();

export const invitationQuerySchema = invitationFiltersSchema.extend({
  page: z.preprocess((val) => Number(val), z.number().min(1).default(1)),
});

export type InvitationQuery = z.infer<typeof invitationQuerySchema>;
export type InvitationFilters = z.infer<typeof invitationFiltersSchema>;
export type CreateInvitationDto = z.infer<typeof createInvitationSchema>;
