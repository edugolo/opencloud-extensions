# @opencloud/branding

Asset-overlay voor OpenCloud login-page (IDP) en web-UI theme + runtime-config voor de Vue web-shell. Implementeert ADR-0007 (pure asset-overlay, geen source-fork) en ADR-0006-erratum (Inter via `config.json` `styles[]`).

## Scope

Conform [ADR-0007](../../../memory/docs/adr/0007-login-page-branding.md) + erratum **en** [ADR-0006-erratum](../../../memory/docs/adr/0006-typography-inter.md):

- ✅ Achtergrond-afbeelding via `IDP_LOGIN_BACKGROUND_URL`
- ✅ Favicon via `IDP_ASSET_PATH` overlay
- ✅ Web-UI logo's (logo, logo-mobile, logo-white, logo-white-mobile, favicon) via `OC_ASSET_THEMES_PATH` overlay
- ✅ Web-UI Inter-font (variable, self-hosted) + tabular-nums via `WEB_UI_CONFIG_FILE` `styles[]`
- ❌ Géén kleuren-/copy-tweaks, géén `index.html`-overlay, géén Inter op IDP-login (escalatie vereist nieuwe ADR)

## Inhoud

```
assets/
├── idp-overlay/                       # IDP login-page (Kopano)
│   └── identifier/static/
│       ├── favicon.svg                # browser-tab favicon
│       └── login-bg.svg               # full-screen login-achtergrond
├── themes/                            # Web-UI theme (oCIS) + Inter assets
│   └── opencloud/
│       ├── theme.json                 # 1-op-1 kopie van upstream (kleuren, share-roles)
│       ├── inter.css                  # @font-face + --oc-font-family + tabular-nums
│       └── assets/
│           ├── favicon.svg
│           ├── logo.svg               # 560x120, donker teal #20434f, gebruikt op IDP-login én web-UI light-theme
│           ├── logo-mobile.svg        # 32x32 mark-only
│           ├── logo-white.svg         # web-UI dark-theme
│           ├── logo-white-mobile.svg
│           └── fonts/
│               ├── InterVariable.woff2          # v4.1, variable axis, 100-900, upright + italic-axis
│               ├── InterVariable-Italic.woff2   # v4.1, variable axis, 100-900, italic
│               └── LICENSE-Inter-OFL.txt
└── web-config/                        # Web-UI runtime-config (WEB_UI_CONFIG_FILE)
    ├── web-config.json                # baseline-config + styles[]
    └── README.md                      # replace-semantiek + baseline-diff-procedure
```

### Pad-schema's

- **IDP**: `<IDP_ASSET_PATH>/identifier/static/...` op disk → URL `/signin/v1/static/...` (geen `identifier/`-prefix in URL).
- **Web-UI theme**: `<OC_ASSET_THEMES_PATH>/opencloud/...` op disk → URL `/themes/opencloud/...`. De `theme.json` verwijst zelf naar `themes/opencloud/assets/<file>.svg`-paden; daarom bevat onze overlay een 1-op-1 kopie van het upstream-`theme.json` (alleen de SVG-bestanden zijn vervangen).
- **Web-UI Inter-font**: `inter.css` en `assets/fonts/*.woff2` zitten in dezelfde theme-overlay; aangezien `OC_ASSET_THEMES_PATH` op fallback-FS draait, worden ze als `/themes/opencloud/inter.css` en `/themes/opencloud/assets/fonts/Inter*.woff2` geserveerd.
- **Web-UI runtime-config**: `<WEB_UI_CONFIG_FILE>` wijst naar `web-config.json`. **Replace-semantiek** (geen merge) — zie [`web-config/README.md`](./assets/web-config/README.md). Het `styles[]`-veld activeert `inter.css` op de Vue-shell.
- Alle drie de overlays gebruiken fallback-FS: ontbrekende files vallen terug op de embedded upstream-bundle.

## Gebruik in `opencloud-deploy/`

```yaml
services:
  opencloud:
    environment:
      IDP_ASSET_PATH: /etc/opencloud/idp-overlay
      IDP_LOGIN_BACKGROUND_URL: https://cloud.opencloud.test/signin/v1/static/login-bg.svg
      OC_ASSET_THEMES_PATH: /etc/opencloud/web-themes
      WEB_UI_CONFIG_FILE: /etc/opencloud/web-config/web-config.json
    volumes:
      - ../opencloud-extensions/packages/branding/assets/idp-overlay:/etc/opencloud/idp-overlay:ro,z
      - ../opencloud-extensions/packages/branding/assets/themes:/etc/opencloud/web-themes:ro,z
      - ../opencloud-extensions/packages/branding/assets/web-config:/etc/opencloud/web-config:ro,z
```

`:z`-flag is nodig voor SELinux-systemen (Fedora/Podman). Achtergrond wordt via dezelfde origin als oCIS geserveerd (CSP-veilig). `WEB_UI_CONFIG_FILE` heeft replace-semantiek — bij upstream-default-wijzigingen moet `web-config.json` handmatig worden bijgewerkt; baseline-diff-procedure staat in `web-config/README.md`.

## Verificatie

### IDP-login + theme-assets

1. Open `https://cloud.opencloud.test/signin/v1/identifier` (zonder trailing slash).
2. Login-page toont:
   - lichte teal-gradient achtergrond met subtiele OpenCloud-mark patroon;
   - donker teal OpenCloud-logo + woordmerk;
   - browser-tab heeft donker teal favicon.
3. Empirische md5-check:
   ```bash
   for f in favicon.svg login-bg.svg; do
     curl -sk https://cloud.opencloud.test/signin/v1/static/$f | md5sum
     md5sum assets/idp-overlay/identifier/static/$f
   done
   for f in logo.svg logo-mobile.svg logo-white.svg favicon.svg; do
     curl -sk https://cloud.opencloud.test/themes/opencloud/assets/$f | md5sum
     md5sum assets/themes/opencloud/assets/$f
   done
   ```
   Md5's moeten paarsgewijs gelijk zijn.

### Web-UI Inter-font

1. `curl -sk https://cloud.opencloud.test/config.json | jq '.styles'` → toont `[{"href":"themes/opencloud/inter.css"}]`.
2. `curl -skI https://cloud.opencloud.test/themes/opencloud/inter.css` → `200 OK`, `content-type: text/css`.
3. `curl -skI https://cloud.opencloud.test/themes/opencloud/assets/fonts/InterVariable.woff2` → `200 OK`, `content-type: font/woff2`.
4. Browser-runtime na login:
   - `getComputedStyle(document.body).fontFamily` start met `Inter`.
   - `Array.from(document.fonts).find(f => f.family === 'Inter').status` is `loaded`.
5. **Niet** verwacht: Inter op de IDP-login zelf (`/signin/v1/...`) — die gebruikt nog Material-UI-default; bewust uit scope per ADR-0007.

## Vervangen door andere assets

Vervang de SVG-bestanden ter plekke; behoud paden/namen. Geen code-changes elders nodig. Bij wijziging van `theme.json`-paden of nieuwe theme-eigenschappen: synchroniseer eerst opnieuw met upstream (`curl -sk https://cloud.opencloud.test/themes/opencloud/theme.json`) om kleuren en share-roles niet te verliezen.

Bij vervangen van het font: pin een nieuwe Inter-versie expliciet (geen `latest`), update beide woff2-files, en hou de `unicode-range` in `inter.css` in sync met wat het bestand werkelijk dekt. Voor extra subsets (Cyrillic/Greek/Vietnamese): voeg per subset een `@font-face`-blok met aparte `unicode-range` en eigen woff2 toe — niet één grote file.
