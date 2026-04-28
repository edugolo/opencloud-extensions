# @opencloud/branding

Asset-overlay voor OpenCloud login-page (IDP) en web-UI theme. Implementeert ADR-0007 (pure asset-overlay, geen source-fork).

## Scope

Conform [ADR-0007](../../../memory/docs/adr/0007-login-page-branding.md) + erratum:

- ✅ Achtergrond-afbeelding via `IDP_LOGIN_BACKGROUND_URL`
- ✅ Favicon via `IDP_ASSET_PATH` overlay
- ✅ Web-UI logo's (logo, logo-mobile, logo-white, logo-white-mobile, favicon) via `OC_ASSET_THEMES_PATH` overlay
- ❌ Géén kleuren, font of `index.html`-overlay (escalatie vereist nieuwe ADR)

## Inhoud

```
assets/
├── idp-overlay/                       # IDP login-page (Kopano)
│   └── identifier/static/
│       ├── favicon.svg                # browser-tab favicon
│       └── login-bg.svg               # full-screen login-achtergrond
└── themes/                            # Web-UI theme (oCIS)
    └── opencloud/
        ├── theme.json                 # 1-op-1 kopie van upstream (kleuren, share-roles)
        └── assets/
            ├── favicon.svg
            ├── logo.svg               # 560x120, donker teal #20434f, gebruikt op IDP-login én web-UI light-theme
            ├── logo-mobile.svg        # 32x32 mark-only
            ├── logo-white.svg         # web-UI dark-theme
            └── logo-white-mobile.svg
```

### Pad-schema's

- **IDP**: `<IDP_ASSET_PATH>/identifier/static/...` op disk → URL `/signin/v1/static/...` (geen `identifier/`-prefix in URL).
- **Web-UI theme**: `<OC_ASSET_THEMES_PATH>/opencloud/...` op disk → URL `/themes/opencloud/...`. De `theme.json` verwijst zelf naar `themes/opencloud/assets/<file>.svg`-paden; daarom bevat onze overlay een 1-op-1 kopie van het upstream-`theme.json` (alleen de SVG-bestanden zijn vervangen).
- Beide overlays gebruiken fallback-FS: ontbrekende files vallen terug op de embedded upstream-bundle.

## Gebruik in `opencloud-deploy/`

```yaml
services:
  opencloud:
    environment:
      IDP_ASSET_PATH: /etc/opencloud/idp-overlay
      IDP_LOGIN_BACKGROUND_URL: https://cloud.opencloud.test/signin/v1/static/login-bg.svg
      OC_ASSET_THEMES_PATH: /etc/opencloud/web-themes
    volumes:
      - ../opencloud-extensions/packages/branding/assets/idp-overlay:/etc/opencloud/idp-overlay:ro,z
      - ../opencloud-extensions/packages/branding/assets/themes:/etc/opencloud/web-themes:ro,z
```

`:z`-flag is nodig voor SELinux-systemen (Fedora/Podman). Achtergrond wordt via dezelfde origin als oCIS geserveerd (CSP-veilig).

## Verificatie

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

## Vervangen door andere assets

Vervang de SVG-bestanden ter plekke; behoud paden/namen. Geen code-changes elders nodig. Bij wijziging van `theme.json`-paden of nieuwe theme-eigenschappen: synchroniseer eerst opnieuw met upstream (`curl -sk https://cloud.opencloud.test/themes/opencloud/theme.json`) om kleuren en share-roles niet te verliezen.
