# OPDS-45: AI settings — BYOK provider API keys + enable/off + AI doc/description assist

**Flowlu ID:** 969
**Flowlu Label:** OPDS-45
**Type:** Task
**Priority:** Medium
**Status:** Backlog

## Triage
**State:** needs-triage
**Updated:** 2026-09-05T22:00:00.000Z

## Description

Goal: Add an admin AI settings area where the instance owner brings their own key: enable/off toggle, provider choice (Anthropic + OpenAI first), API key stored server-side and NEVER exposed to the client (redacted on reads, masked in the UI). First gated feature: AI-assist in the component editor that drafts or improves a component description / doc page from its spec, tokens and props. No AI code exists today — this is the foundation layer + one consumer.

Tasks:
- Settings: ai_enabled, ai_provider (anthropic|openai), ai_api_key (server-side secret — encrypt at rest or OS secret where available, never returned by settings API; only a masked flag/prefix to the client)
- Server-side provider client (Anthropic + OpenAI) with timeouts, error surfacing, and per-call token/usage caps
- Admin AI settings UI: toggle, provider select, BYOK field (write-only), "test connection" call, status display
- First feature: AI-assist button in the component editor — drafts/improves description or a doc page from spec/variants/props/tokens; clearly marked as AI-generated; admin-only action; disabled when ai_enabled is off
- No key ever leaves the server; logs redact the key; provider calls are server-to-server
- Tests: settings API never leaks the key; assist endpoint works with a mock provider; toggle disables features

Acceptance Criteria:
- Admin can enable AI, choose a provider, and store a BYOK key without it ever appearing client-side
- AI-assist produces a component description/doc draft from the spec when enabled, and is unavailable when off
- Typecheck green, vitest + E2E pass

Context: Greenfield — no LLM code exists in the repo. Keep the provider client behind an interface so more providers are a config row. Privacy default: content sent to the provider is the minimum needed for the assist action, and only when the instance owner opted in.
