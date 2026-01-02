/**
 * Design Tools Components List Endpoint
 * GET /api/design-tools/components
 */

import { createSuccessResponse } from "../../../utils/response";
import designToolStorage from "../storage";

export default defineEventHandler(async () => {
  const components = designToolStorage.getImportedComponents();
  const connections = designToolStorage.getConnections();

  const componentsWithSource = components.map((comp) => ({
    ...comp,
    source:
      connections.find((c) => c.tool === comp.source)?.libraryName ||
      comp.source,
  }));

  return createSuccessResponse({
    components: componentsWithSource,
    count: components.length,
  });
});
