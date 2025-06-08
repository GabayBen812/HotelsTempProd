import { z } from "zod";

export const callSettingsFormSchema = z.object({
  name: z.object({
    he: z.string().min(2),
    en: z.string().min(2),
    ar: z.string().min(2),
  }),
  logo: z.any().optional(),
  departmentId: z.coerce.number().min(1),
  expectedTime: z.coerce.number().min(1, "Expected time must be at least 1 minute"),
});
