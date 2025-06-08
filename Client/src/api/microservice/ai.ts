import { MutationResponse } from "@/types/api/auth";
import { createApiService } from "../utils/apiFactory";
import { AIContext } from "@/types/api/ai.types";

const aiApi = createApiService<AIContext>("/ai", {
  includeOrgId: true,
  customRoutes: {
    create: (data) => ({ url: "ai/upsert-context", data: data }),
    fetch: () => ({ url: "ai/context" }),
  },
});

export const upsert = async (data: AIContext) => {
  return aiApi.create(data) as Promise<MutationResponse<AIContext>>;
};

export const fetch = async () => {
  return aiApi.fetch() as Promise<MutationResponse<AIContext>>;
};
