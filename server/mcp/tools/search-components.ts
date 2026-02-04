import { z } from "zod";
import ComponentRepository from "../../repositories/component.repository";

export default defineMcpTool({
  name: "search_components",
  description: "Search for UI components by name, category, or status",
  inputSchema: {
    query: z.string().optional(),
    category: z.string().optional(),
    status: z.enum(["draft", "review", "approved", "deprecated"]).optional(),
    limit: z.number().min(1).max(100).default(20),
  },
  cache: "5m",

  handler: async ({ query, category, status, limit }) => {
    const components = await ComponentRepository.list({
      query,
      category,
      status: status || "approved",
      limit: limit || 20,
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              components: components.map((c) => ({
                id: c.id,
                name: c.name,
                displayName: c.display_name,
                category: c.category,
                description: c.description,
                status: c.status,
                previewUrl: c.preview_url,
              })),
              total: components.length,
              filters: { query, category, status },
            },
            null,
            2,
          ),
        },
      ],
    };
  },
});
