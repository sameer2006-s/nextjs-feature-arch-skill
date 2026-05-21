// features/<feature-name>/services/<verb>-<entity>.service.ts
// Integrated / Separate-REST: use repository
// Separate-gRPC: use *ApiClient from lib/grpc/clients.ts — see docs/snippets/grpc.md

import { <entity>Repository } from "../repositories/<entity>.repository";
import type { Create<Entity>Input } from "../schemas/<entity>.schema";

// --- Integrated: domain rules in service ---
export async function create<Entity>(input: Create<Entity>Input) {
  const existing = await <entity>Repository.findBySlug?.(input.slug);
  if (existing) {
    throw new Error("Slug already exists");
  }
  return <entity>Repository.create(input);
}

// --- Separate-REST: thin orchestration ---
// export async function create<Entity>(input: Create<Entity>Input) {
//   return <entity>Repository.create(input);
// }

// --- Separate-gRPC: ServiceResult + *ApiClient ---
// import { <api>Client } from "@/lib/grpc/clients";
// import { getAuthedContext, getErrorMessage } from "@/lib/utils";
//
// export type ServiceResult<T> =
//   | { success: true; data: T }
//   | { success: false; error: string };
//
// export async function get<Entity>(params: { request: Omit<ProtoRequest, "$typeName"> }) {
//   try {
//     const { accessToken } = await getAuthedContext();
//     const data = await <api>Client.getMethod(params.request, {
//       headers: { Authorization: `Bearer ${accessToken}` },
//     });
//     return { success: true as const, data };
//   } catch (error) {
//     return { success: false as const, error: getErrorMessage(error, "Failed") };
//   }
// }
