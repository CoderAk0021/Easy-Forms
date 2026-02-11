import { z } from 'zod';

export const createFormSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(100),
    questions: z.array(z.object({
      id: z.string(),
      type: z.enum(["short_text", "long_text", "multiple_choice", "checkbox", "dropdown", "rating", "date", "email", "number", "file_upload"]),
      title: z.string().min(1),
      required: z.boolean().optional(),
      options: z.array(z.any()).optional(),
    })),
    settings: z.object({
      allowMultipleResponses: z.boolean().optional(),
      confirmationMessage: z.string().optional(),
    }).optional(),
  })
});