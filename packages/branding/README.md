# @opencloud/branding

Login-page asset-overlay voor OpenCloud IDP. Implementeert ADR-0007 (pure asset-overlay, geen source-fork).

## Scope

Conform [ADR-0007](../../../memory/docs/adr/0007-login-page-branding.md):

- ✅ Achtergrond-afbeelding via `IDP_LOGIN_BACKGROUND_URL`
- ✅ Favicon via `IDP_ASSET_PATH` overlay
- ❌ Géén logo, kleuren, font of `index.html`-overlay (escalatie vereist nieuwe ADR)

## Inhoud

```
assets/
└── idp-overlay/
    └── identifier/
        └── static/
            ├── favicon.svg                 # 32x32 SVG, vervangt upstream-default
            └── login-bg.svg                # full-screen login-achtergrond
```

De `idp-overlay/`-structuur volgt het pad-schema van `services/idp/pkg/assets/option.go` in oCIS. **Belangrijk:** de file-system-overlay gebruikt `<IDP_ASSET_PATH>/identifier/static/...`, maar oCIS 6.1 serveert deze assets via URL-pad `/signin/v1/static/...` (zonder `identifier/`-prefix). De overlay-fallback-FS werkt: ontbrekende files vallen terug op embedded upstream-bundle.

## Gebruik in `opencloud-deploy/`

Mount de overlay-directory en zet de env-vars op de OpenCloud-container:

```yaml
services:
  opencloud:
    environment:
      IDP_ASSET_PATH: /etc/opencloud/idp-overlay
      IDP_LOGIN_BACKGROUND_URL: https://cloud.opencloud.test/signin/v1/static/login-bg.svg
    volumes:
      - ../opencloud-extensions/packages/branding/assets/idp-overlay:/etc/opencloud/idp-overlay:ro,z
```

De `:z`-flag is nodig voor SELinux-systemen (Fedora/Podman). De achtergrond wordt via dezelfde origin als oCIS geserveerd (CSP-veilig).

## Verificatie

1. Open `https://cloud.opencloud.test/signin/v1/identifier` (zonder trailing slash).
2. Achtergrond is de blauwe gradient-SVG.
3. Browser-tab toont blauwe favicon.
4. Empirische check:
   ```bash
   curl -sk https://cloud.opencloud.test/signin/v1/static/favicon.svg | md5sum
   md5sum assets/idp-overlay/identifier/static/favicon.svg
   ```
   Md5's moeten gelijk zijn.

## Vervangen door productie-assets

Vervang de bestanden ter plekke. Geen code-changes elders nodig. Houd de paden en bestandsnamen identiek.
