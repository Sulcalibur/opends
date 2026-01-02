/**
 * Design Tool Format Converters
 * Convert between different design tool formats and OpenDS format
 */

export interface OpenDSToken {
  id?: string;
  name: string;
  type:
    | "color"
    | "typography"
    | "spacing"
    | "shadow"
    | "radius"
    | "size"
    | "other";
  value: any;
  description?: string;
  category?: string;
  source?: string;
  sourceId?: string;
  set?: string;
  rawValue?: string;
}

export interface OpenDSComponent {
  id?: string;
  name: string;
  description?: string;
  category?: string;
  props: any[];
  slots?: any[];
  events?: any[];
  source?: string;
  sourceId?: string;
}

export function penpotColorToOpenDS(penpotColor: any): OpenDSToken {
  return {
    name: penpotColor.name,
    type: "color",
    value: penpotColor.value,
    description: penpotColor.description,
    source: "penpot",
    sourceId: penpotColor.id,
    category: "color",
  };
}

export function penpotTypographyToOpenDS(penpotTypography: any): OpenDSToken {
  return {
    name: penpotTypography.name,
    type: "typography",
    value: {
      fontFamily: penpotTypography.fontFamily,
      fontWeight: penpotTypography.fontWeight,
      fontSize: penpotTypography.fontSize,
      lineHeight: penpotTypography.lineHeight,
      letterSpacing: penpotTypography.letterSpacing,
    },
    description: penpotTypography.description,
    source: "penpot",
    sourceId: penpotTypography.id,
    category: "typography",
  };
}

export function penpotComponentToOpenDS(penpotComponent: any): OpenDSComponent {
  return {
    name: penpotComponent.name,
    description: penpotComponent.description,
    category: penpotComponent.category,
    props: penpotComponent.properties || [],
    source: "penpot",
    sourceId: penpotComponent.id,
  };
}

export function figmaStyleToOpenDS(figmaStyle: any): OpenDSToken | null {
  if (figmaStyle.style_type === "FILL") {
    return {
      name: figmaStyle.name,
      type: "color",
      value: figmaStyle.description || "#000000",
      description: figmaStyle.description,
      source: "figma",
      sourceId: figmaStyle.key,
      category: "color",
    };
  } else if (figmaStyle.style_type === "TEXT") {
    return {
      name: figmaStyle.name,
      type: "typography",
      value: {
        fontFamily: "Inter",
        fontSize: 16,
      },
      description: figmaStyle.description,
      source: "figma",
      sourceId: figmaStyle.key,
      category: "typography",
    };
  }
  return null;
}

export function figmaNodeToOpenDS(figmaNode: any): OpenDSComponent | null {
  if (figmaNode.type === "COMPONENT" || figmaNode.type === "COMPONENT_SET") {
    return {
      name: figmaNode.name,
      description: figmaNode.description || "",
      category: "Imported",
      props: extractFigmaProperties(figmaNode),
      source: "figma",
      sourceId: figmaNode.id,
    };
  }
  return null;
}

function extractFigmaProperties(node: any): any[] {
  const props: any[] = [];

  if (node.componentProperties) {
    Object.entries(node.componentProperties).forEach(
      ([name, prop]: [string, any]) => {
        props.push({
          name,
          type: prop.type || "string",
          defaultValue: prop.defaultValue,
          options: prop.values || [],
        });
      },
    );
  }

  return props;
}

export function sketchColorToOpenDS(sketchColor: any): OpenDSToken {
  return {
    name: sketchColor.name,
    type: "color",
    value: sketchColor.value,
    description: sketchColor.description,
    source: "sketch",
    sourceId: sketchColor.id,
    category: "color",
  };
}

export function sketchLayerStyleToOpenDS(sketchStyle: any): OpenDSToken | null {
  if (sketchStyle.fills) {
    return {
      name: sketchStyle.name,
      type: "color",
      value: sketchStyle.fills[0]?.color || "#000000",
      description: sketchStyle.name,
      source: "sketch",
      sourceId: sketchStyle.id,
      category: "color",
    };
  }
  return null;
}

export function sketchSymbolToOpenDS(sketchSymbol: any): OpenDSComponent {
  return {
    name: sketchSymbol.name,
    description: sketchSymbol.description || "",
    category: "Imported",
    props: [],
    source: "sketch",
    sourceId: sketchSymbol.symbolId,
  };
}

export function openDSTokenToPenpot(token: OpenDSToken): any {
  if (token.type === "color") {
    return {
      name: token.name,
      value: token.value,
      description: token.description,
    };
  } else if (token.type === "typography") {
    return {
      name: token.name,
      fontFamily: token.value.fontFamily,
      fontWeight: token.value.fontWeight,
      fontSize: token.value.fontSize,
      lineHeight: token.value.lineHeight,
      description: token.description,
    };
  }
  return null;
}

export function resolveTokenReferences(tokens: OpenDSToken[]): OpenDSToken[] {
  const tokenMap = new Map<string, any>();

  tokens.forEach((token) => {
    tokenMap.set(token.name, token.value);
  });

  const resolved = tokens.map((token) => {
    if (
      typeof token.value === "string" &&
      token.value.startsWith("{") &&
      token.value.endsWith("}")
    ) {
      const refName = token.value.slice(1, -1);
      token.rawValue = token.value;
      token.value = tokenMap.get(refName) || token.value;
    }
    return token;
  });

  return resolved;
}
