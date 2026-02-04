import McpKeyRepository from "../repositories/mcp-key.repository";
import {
  validateMcpApiKey,
} from "../utils/mcp-auth";

export default defineMcpHandler({
  name: "OpenDS Design System",

  middleware: async (event) => {
    const result = await validateMcpApiKey(event);

    if (result) {
      event.context.user = result.user;
      event.context.userId = result.userId;
      event.context.keyScope = result.keyScope;

      await McpKeyRepository.updateLastUsed(result.keyId);
    }
  },
});
