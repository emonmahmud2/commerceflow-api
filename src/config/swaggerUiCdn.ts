/** Pin to a stable swagger-ui-dist release (CDN). Bump when you want newer UI. */
const SWAGGER_UI_DIST_VERSION = "5.32.4";

const cdn = `https://cdn.jsdelivr.net/npm/swagger-ui-dist@${SWAGGER_UI_DIST_VERSION}`;

/**
 * HTML shell: assets from CDN; init runs from `/api-docs/ui-init.js` (no inline script — Helmet CSP).
 */
export function swaggerUiCdnPageHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Order API Docs</title>
  <link rel="stylesheet" href="${cdn}/swagger-ui.css" crossorigin="anonymous" />
  <style>html { box-sizing: border-box; } *, *:before, *:after { box-sizing: inherit; } body { margin: 0; background: #fafafa; }</style>
</head>
<body>
<div id="swagger-ui"></div>
<script defer src="${cdn}/swagger-ui-bundle.js" crossorigin="anonymous"></script>
<script defer src="${cdn}/swagger-ui-standalone-preset.js" crossorigin="anonymous"></script>
<script defer src="/api-docs/ui-init.js"></script>
</body>
</html>`;
}

export function swaggerUiInitScript(specUrl: string): string {
  return `window.addEventListener("DOMContentLoaded", function () {
  window.ui = SwaggerUIBundle({
    url: ${JSON.stringify(specUrl)},
    dom_id: "#swagger-ui",
    deepLinking: true,
    presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
    plugins: [SwaggerUIBundle.plugins.DownloadUrl],
    layout: "StandaloneLayout",
  });
});
`;
}
