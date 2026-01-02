/**
 * Webhook Router for Design Tools
 * Endpoint: /api/webhooks/design-tools/:tool
 */

import {
  createSuccessResponse,
  createErrorResponse,
  ErrorCodes,
} from "../../utils/response";
import { DesignTool } from "../design-tools/types";
import designToolStorage from "../design-tools/storage";
import crypto from "crypto";

const WEBHOOK_SECRET_KEY =
  process.env.WEBHOOK_SECRET || "opends-webhook-secret";

export default defineEventHandler(async (event) => {
  const method = getMethod(event);
  const path = getPath(event);

  if (method !== "POST") {
    throw createErrorResponse(
      ErrorCodes.INVALID_INPUT,
      "Only POST method is allowed for webhooks",
    );
  }

  const segments = path.split("/");
  const tool = segments[segments.length - 1] as DesignTool;

  if (!["penpot", "figma", "sketch"].includes(tool)) {
    throw createErrorResponse(
      ErrorCodes.INVALID_INPUT,
      `Unsupported design tool: ${tool}`,
    );
  }

  const signature = getHeader(event, "x-webhook-signature");
  const timestamp = getHeader(event, "x-webhook-timestamp");

  const body = await readBody(event);

  if (!validateWebhook(signature, timestamp, body)) {
    throw createErrorResponse(
      ErrorCodes.UNAUTHORIZED,
      "Invalid webhook signature",
    );
  }

  if (isReplayAttack(timestamp)) {
    throw createErrorResponse(
      ErrorCodes.INVALID_INPUT,
      "Replay attack detected: webhook timestamp is too old",
    );
  }

  const webhookEvent = {
    tool,
    eventType: body.event || body.type || "unknown",
    payload: body.data || body,
    receivedAt: new Date().toISOString(),
  };

  console.log(`Received webhook from ${tool}:`, webhookEvent.eventType);

  const connection = designToolStorage.getConnection(tool);
  if (connection) {
    designToolStorage.saveConnection({
      ...connection,
      lastSync: new Date().toISOString(),
    });
  }

  await processWebhookEvent(tool, webhookEvent);

  return createSuccessResponse({
    received: true,
    event: webhookEvent.eventType,
    timestamp: webhookEvent.receivedAt,
  });
});

function validateWebhook(
  signature: string | undefined,
  timestamp: string | undefined,
  body: any,
): boolean {
  if (!signature || !timestamp) {
    return false;
  }

  const payload = JSON.stringify({
    timestamp,
    body,
  });

  const expectedSignature = crypto
    .createHmac("sha256", WEBHOOK_SECRET_KEY)
    .update(payload)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature),
  );
}

function isReplayAttack(timestamp: string | undefined): boolean {
  if (!timestamp) return true;

  const webhookTime = parseInt(timestamp, 10);
  const currentTime = Date.now();

  return currentTime - webhookTime > 5 * 60 * 1000;
}

async function processWebhookEvent(
  tool: DesignTool,
  event: any,
): Promise<void> {
  switch (event.eventType) {
    case "file.updated":
    case "library.updated":
    case "colors.updated":
    case "components.updated":
      console.log(`Triggering sync for ${tool} due to ${event.eventType}`);
      break;

    case "ping":
      console.log(`${tool} webhook connection verified`);
      break;

    default:
      console.log(`Unhandled webhook event from ${tool}: ${event.eventType}`);
  }
}
