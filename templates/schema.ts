// features/<feature-name>/schemas/<entity>.schema.ts
import { z } from "zod";

export const create<Entity>Schema = z.object({
  // field: z.string().min(1),
});

export type Create<Entity>Input = z.infer<typeof create<Entity>Schema>;

// Optional: API response schema (Separate-REST)
export const <entity>Schema = z.object({
  id: z.string(),
  // ...
});

export type <Entity> = z.infer<typeof <entity>Schema>;
