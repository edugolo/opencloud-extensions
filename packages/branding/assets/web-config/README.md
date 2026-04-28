# `web-config/` — runtime-config voor OpenCloud Web

JSON-overlay voor `WEB_UI_CONFIG_FILE` (zie [services/web/README.md](https://github.com/opencloud-eu/opencloud/blob/main/services/web/README.md)).

## Waarom een aparte map?

`web-config.json` is **geen theme-asset** maar een runtime-configuratie voor de web-UI. Daarom staat hij niet onder `themes/` — die map serveert via `OC_ASSET_THEMES_PATH` op `/themes/...` en wordt door browsers (en uiteindelijk extensions) als statische assets gezien. `web-config.json` wordt door de Go-`web`-service éénmalig ingelezen bij startup en als `/config.json` aan de browser geserveerd.

## Replace-semantiek (belangrijk)

`WEB_UI_CONFIG_FILE` **vervangt** de hele `WebConfig`-struct (`json.Unmarshal` over de defaults — zie `services/web/pkg/command/server.go:39-49` in `opencloud-eu/opencloud`). Er is **geen merge**.

Gevolg: deze file moet **alle** velden bevatten die de Go-defaults zouden zetten. De huidige inhoud is een 1-op-1 kopie van wat `https://cloud.opencloud.test/config.json` zonder overlay zou produceren, plus de `styles[]`-entry.

Empirische verificatie van de baseline:

```bash
curl -sk https://cloud.opencloud.test/config.json | python3 -m json.tool
```

Als upstream nieuwe defaults toevoegt (extra `apps[]`-entry, nieuwe `options`-sub-objecten), moet deze file handmatig worden bijgewerkt. Diff via:

```bash
diff <(curl -sk https://cloud.opencloud.test/config.json | python3 -m json.tool) \
     <(python3 -m json.tool < web-config.json)
```

Verschil mag alleen het `styles[]`-veld zijn.

## Inhoud

- `web-config.json` — defaults + `styles[]` met `themes/opencloud/inter.css` (zie [ADR-0006](../../../../../memory/docs/adr/0006-typography-inter.md)).

## Gebruik in `opencloud-deploy/`

```yaml
services:
  opencloud:
    environment:
      WEB_UI_CONFIG_FILE: /etc/opencloud/web-config/web-config.json
    volumes:
      - ../opencloud-extensions/packages/branding/assets/web-config:/etc/opencloud/web-config:ro,z
```

`:z`-flag voor SELinux (Fedora/Podman).

## Verificatie

Na restart van de `opencloud`-service:

```bash
curl -sk https://cloud.opencloud.test/config.json | python3 -m json.tool | grep -A1 styles
```

Verwacht: `"styles": [ { "href": "themes/opencloud/inter.css" } ]`.

Browser-DevTools → Network: `inter.css` laadt 200, `InterVariable.woff2` laadt 200, `getComputedStyle(document.body).fontFamily` start met `"Inter"`.

## Niet hier

- **Theme-tokens** (kleuren, fontFamily-naam) → `assets/themes/opencloud/theme.json`.
- **Theme-assets** (logo's, favicon, fonts, CSS) → `assets/themes/opencloud/...`.
- **IDP-login-page-overlay** → `assets/idp-overlay/...`.
