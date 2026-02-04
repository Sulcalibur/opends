import { z } from "zod";
import TokenRepository from "../../repositories/token.repository";
import { hasMcpPermission, authRequiredResponse } from "../../utils/mcp-auth";

export default defineMcpTool({
  name: "get_design_token",
  description: "Get detailed information about a specific design token",
  inputSchema: {
    tokenId: z.string().describe("Token UUID or name"),
  },
  cache: "10m",

  handler: async ({ tokenId }) => {
    const event = useEvent();

    if (!event.context.userId) {
      return authRequiredResponse();
    }

    if (!hasMcpPermission(event, "read:tokens")) {
      return insufficientPermissionsResponse("read:tokens");
    }

    const token = await TokenRepository.findById(tokenId);

    if (!token) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Token not found: ${tokenId}`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              token: {
                id: token.id,
                name: token.name,
                category: token.category,
                value: token.value,
                description: token.description,
                created_at: token.created_at,
                updated_at: token.updated_at,
              },
            },
            null,
            2,
          ),
        },
      ],
    };
  },
});
