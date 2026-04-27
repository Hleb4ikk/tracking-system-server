import z from 'zod';

export const createUserSchema = z.object({
  email: z.email(),
  username: z.string(),
  name: z.string().min(1),
  surname: z.string().min(1),
  password: z
    .string()
    .min(8, 'Password must have at least 8 symbols.')
    .regex(/[a-z]/, 'Password must have at least 1 lower case symbol.')
    .regex(/[A-Z]/, 'Password must have at least 1 upper case symbol.')
    .regex(/[0-9]/, 'Password must have at least 1 number.')
    .regex(
      /[^a-zA-Z0-9]/,
      'Password must have at least 1 special symbole(@, #, $, etc.)',
    ),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
