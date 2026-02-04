import { z } from "zod";
import ComponentRepository from "../../repositories/component.repository";
import { generateCode, generateUsageExample } from "../../utils/codeGenerator";

export default defineMcpTool({
  name: "generate_component_code",
  description: "Generate framework code for a component (Vue, React, Svelte)",
  inputSchema: {
    componentId: z.string().describe("Component UUID"),
    framework: z.enum(["vue", "react", "svelte"]),
    variant: z.string().optional().describe("Component variant name"),
  },

  handler: async ({ componentId, framework, variant }) => {
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

    const code = await generateCode(component.spec, framework, variant);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              component: component.name,
              framework,
              code: code,
              usage: await generateUsageExample(component.name, framework),
            },
            null,
            2,
          ),
        },
      ],
    };
  },
});
