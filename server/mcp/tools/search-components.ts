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
    // findAll (both SQL and PB repos) takes { category, status, search } —
    // limit is applied here since the SQL repo returns all matches.
    const components = await ComponentRepository.findAll({
      category,
      status: status || "approved",
      search: query,
    });
    const limited = components.slice(0, limit || 20);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              components: limited.map((c) => ({
                id: c.id,
                name: c.name,
                displayName: c.display_name,
                category: c.category,
                description: c.description,
                status: c.status,
                previewUrl: c.preview_url,
              })),
              total: limited.length,
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
