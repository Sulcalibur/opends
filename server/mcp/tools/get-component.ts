import { z } from "zod";
import ComponentRepository from "../../repositories/component.repository";

export default defineMcpTool({
  name: "get_component",
  description: "Get detailed information about a specific component",
  inputSchema: {
    componentId: z.string().describe("Component UUID or name"),
  },
  cache: "10m",

  handler: async ({ componentId }) => {
    const component = await ComponentRepository.findById(componentId);

    if (!component) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Component not found: ${componentId}`,
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
              component: {
                id: component.id,
                name: component.name,
                displayName: component.display_name,
                category: component.category,
                description: component.description,
                status: component.status,
                previewUrl: component.preview_url,
                spec: component.spec,
                created_at: component.created_at,
                updated_at: component.updated_at,
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
