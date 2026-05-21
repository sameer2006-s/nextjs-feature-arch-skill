// features/<feature-name>/repositories/<entity>.repository.ts
// Integrated: use lib/db | Separate-REST: use lib/api/client

import { db } from "@/lib/db"; // Integrated only — remove for REST
// import { apiRequest, ApiError } from "@/lib/api/client"; // Separate-REST only
import type { Create<Entity>Input } from "../schemas/<entity>.schema";
// import { <entity>Schema, type <Entity> } from "../schemas/<entity>.schema"; // REST

export const <entity>Repository = {
  async findById(id: string) {
    // Integrated:
    return db.<entity>.findUnique({ where: { id } });

    // Separate-REST:
    // try {
    //   const raw = await apiRequest<unknown>(`/<entities>/${id}`);
    //   return <entity>Schema.parse(raw);
    // } catch (e) {
    //   if (e instanceof ApiError && e.status === 404) return null;
    //   throw e;
    // }
  },

  async create(data: Create<Entity>Input) {
    // Integrated:
    return db.<entity>.create({ data });

    // Separate-REST:
    // const raw = await apiRequest<unknown>("/<entities>", {
    //   method: "POST",
    //   body: JSON.stringify(data),
    // });
    // return <entity>Schema.parse(raw);
  },
};
