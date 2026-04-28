# AGENTS.md — opencloud-extensions

## Bron van waarheid
Universele agent-conventies staan in `../memory/AGENTS.md`. Dit bestand is repo-specifiek en vult die aan.

## Scope
Monorepo met OpenCloud Web extension-packages. Geen backend, geen deploy-config.

## Repo-layout
```
opencloud-extensions/
├── package.json          # root — private, workspace-scripts
├── pnpm-workspace.yaml   # packages/*
├── tsconfig.json         # basis-tsconfig (packages erven via extends)
├── eslint.config.js      # ESLint v9 flat config
├── .prettierrc.json
├── .gitignore
├── AGENTS.md
└── packages/
    ├── ai-sidebar/       # SidebarPanelExtension + ActionExtension
    ├── semantic-search/  # SearchExtension
    ├── branding/         # design-system tokens, assets
    ├── h5p-viewer/       # defineWebApplication voor .h5p-bestanden
    ├── openclass-app/    # volwaardige app: defineWebApplication + sidebarNav
    └── h5p-theme/        # CSS + assets voor Lumi customization
```

## Conventies
- Taal: NL voor docs en commit-bodies; EN voor file-namen en code.
- Composition API + `<script setup>`. Geen Options API.
- Composables i.p.v. service-classes.
- `pnpm check:all` slaagt vóór elke commit (lint + format:check + type-check).
- Geen `as any`, `@ts-ignore`, `@ts-expect-error`.
- Packages zijn `private: true` — niet gepubliceerd naar npm.
- Elke package erft `tsconfig.json` van root via `"extends": "../../tsconfig.json"`.

## Extension-strategie (uit inventory §0)
- Extension-eerst: alles wat via OpenCloud's extension-system kan, doen we hier.
- Fork alleen waar het écht moet (zie inventory voor mapping).
- Conventies van OpenCloud Web volgen: Composition API, composables, pnpm check:all.

## Nuttige commando's
```bash
# Installeer alle deps
pnpm install

# Check alles (lint + format + types)
pnpm check:all

# Build alle packages
pnpm build

# Werk in één package
pnpm --filter @opencloud/ai-sidebar <script>
```

## Scope-guard
Verboden in deze repo: backend-code (Fastify, Express, Go), Docker-config, deploy-scripts.
