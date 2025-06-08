// components/forms/callFormSchema.ts
import { z } from "zod";

export const callFormSchema = z.object({
  description: z.string().min(1, { message: "Description is required" }),
  locationId: z.number().min(1, { message: "Location is required" }),
  callCategoryId: z.number().min(1, { message: "Call category is required" }),
  assignedToId: z.any().optional(),
  status: z.string().min(1, { message: "Status is required" }),
});
