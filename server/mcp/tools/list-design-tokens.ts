import { z } from "zod";
import TokenRepository from "../../repositories/token.repository";
import {
  authRequiredResponse,
} from "../../utils/mcp-auth";

export default defineMcpTool({
  name: "list_design_tokens",
  description:
    "List all design tokens, optionally filtered by category or search query",
  inputSchema: {
    category: z
      .enum([
        "color",
        "typography",
        "spacing",
        "border",
        "shadow",
        "animation",
        "breakpoint",
      ])
      .optional(),
    search: z.string().optional().describe("Search query to filter tokens"),
  },
  cache: "5m",

  handler: async ({ category, search }) => {
    const event = useEvent();

    if (!event.context.userId) {
      return authRequiredResponse();
    }

    const tokens = await TokenRepository.findAll({
      category,
      search,
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              tokens,
              total: tokens.length,
              filters: { category, search },
            },
            null,
            2,
          ),
        },
      ],
    };
  },
});
