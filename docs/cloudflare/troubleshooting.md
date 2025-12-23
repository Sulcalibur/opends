# Cloudflare Deployment Troubleshooting

## Summary
- Use pnpm and set the Pages project Root Directory to `simplified`
- Remove all `package-lock.json` to avoid npm being selected
- Ensure `pnpm-lock.yaml` exists at root and in `simplified`
- Set `NODE_VERSION` to `20` or higher in Pages settings
- Run `pnpm run ci:predeploy` in CI before building

## Common Failures
- Rollup failed to resolve import: dependencies not installed for workspace packages when npm is used
- Ignored build scripts (esbuild): pnpm requires approvals; avoid postinstall by Pages or pre-approve locally

## Fix Steps
- Root config:
  - Add `"packageManager": "pnpm@10.11.1"` to `package.json`
  - Keep `"engines.node": ">=20.0.0"`
- Pages config:
  - Root Directory: `simplified`
  - Package Manager: `pnpm`
  - Build Command: `pnpm install --frozen-lockfile && pnpm run build`
  - Output Directory: `dist`
  - Environment: `NODE_VERSION=20`
- Lockfiles:
  - Remove `package-lock.json` from root, `simplified`, and `opends-penpot-plugin`
  - Keep `pnpm-lock.yaml` at root and `simplified`
- Functions (optional):
  - Place `functions/` inside `simplified` if you need API endpoints
  - Add `simplified/wrangler.toml` with a `compatibility_date`

## Verification
- Run `pnpm run ci:predeploy` locally or in CI
- Build with `pnpm --filter opends-simplified run build`
- Inspect Pages build logs; confirm pnpm and Node versions

## Rollback
- Use `pnpm run ci:rollback` with `CF_ACCOUNT_ID`, `CF_API_TOKEN`, and `CF_PAGES_PROJECT`
- For Workers, prefer `wrangler deployments list` and rollback to previous version

