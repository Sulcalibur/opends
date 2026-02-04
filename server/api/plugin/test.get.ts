export default defineEventHandler(() => {
  return {
    status: "ok",
    service: "opends",
    version: "0.2.0",
    timestamp: new Date().toISOString(),
    authRequired: false,
  };
});
