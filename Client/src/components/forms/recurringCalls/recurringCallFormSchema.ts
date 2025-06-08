import { z } from "zod";

export const recurringCallFormSchema = z
  .object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    locationId: z.number().min(1, { message: "Location is required" }),
    callCategoryId: z.number().min(1, { message: "Call category is required" }),
    startDate: z.string().min(1, { message: "Start date is required" }),
    endDate: z.string().optional(),
    frequency: z.string().min(1, { message: "Frequency is required" }),
    daysOfWeek: z
      .array(
        z
          .string()
          .refine(
            (value) => ["0", "1", "2", "3", "4", "5", "6"].includes(value),
            {
              message: "Invalid day of the week",
            }
          )
      )
      .min(1, { message: "At least one day of the week must be selected" }),
    times: z
      .array(z.string())
      .min(1, { message: "At least one time is required" }),
  })
  .refine(
    (data) => {
      if (!data.endDate) return true; // If endDate is not provided, it's valid
      return new Date(data.endDate) >= new Date(data.startDate); // Ensure endDate >= startDate
    },
    {
      message: "End date must be the same day or later than the start date",
      path: ["endDate"], // Attach the error to the endDate field
    }
  );
