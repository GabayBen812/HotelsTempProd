import { createApiService } from "../utils/apiFactory";

const microserviceApi = createApiService<unknown>("/organizations", {
  includeOrgId: true,
  customRoutes: {
    create: (prompt) => ({ url: "http://localhost:5000/log", data: prompt }),
  },
});

export const createLog = microserviceApi.create;

export default microserviceApi;
