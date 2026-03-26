import { describe, it, expect } from "vitest";
import { loadTemplate, listTemplates, TemplateType } from "./index";

describe("Template Registry", () => {
  it("should load base component template", async () => {
    const template = await loadTemplate("component", "base");
    expect(template).toContain("<template>");
    expect(template).toContain("</template>");
  });

  it("should list available templates", async () => {
    const templates = await listTemplates("component");
    expect(templates).toContain("base");
    expect(templates).toContain("with-props");
    expect(templates).toContain("with-slots");
  });

  it("should throw for non-existent template", async () => {
    await expect(loadTemplate("component", "non-existent")).rejects.toThrow(
      "Template not found",
    );
  });
});
