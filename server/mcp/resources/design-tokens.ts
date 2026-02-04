import TokenRepository from "../../repositories/token.repository";

export default defineMcpResource({
  name: "design_tokens",
  description: "All design tokens in OpenDS design system",
  uri: "opends://tokens",
  mimeType: "application/json",

  async load() {
    const tokens = await TokenRepository.findAll();
    return {
      contents: [
        {
          uri: "opends://tokens",
          mimeType: "application/json",
          text: JSON.stringify(
            {
              tokens: tokens,
              categories: [
                "color",
                "typography",
                "spacing",
                "border",
                "shadow",
                "animation",
                "breakpoint",
              ],
              count: tokens.length,
            },
            null,
            2,
          ),
        },
      ],
    };
  },
});
