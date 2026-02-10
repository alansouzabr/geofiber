import { z } from 'zod';

export const CreateCompanySchema = z.object({
  name: z.string().min(3),
  cnpj: z.string().min(8).optional(),
});

export type CreateCompanyDto = z.infer<typeof CreateCompanySchema>;
