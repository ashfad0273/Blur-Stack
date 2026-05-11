# Blur Stack

A tiny zero-dependency JavaScript utility that creates layered backdrop-blur effects using multiple absolutely-positioned layers and CSS masks. It generates a stacked blur gradient over any element with the `data-blur-stack` attribute so you can create soft, directional blur transitions (like a glassy vignette) over images or backgrounds.

Repository: https://github.com/ashfad0273/Blur-Stack

Quick link to the main script: https://github.com/ashfad0273/Blur-Stack/blob/main/blur-stack.js

## Features

- No dependencies — single small script (`blur-stack.js`).
- Works by injecting CSS and creating multiple `.blur-layer` elements with backdrop-filter blur and CSS masks.
- Supports configurable steps, min/max blur, direction, and modes (soft/full).

## Quick usage

1. Include `blur-stack.js` on your page (before the closing `</body>` is fine):

```html
<!-- Local file -->
<script src="blur-stack.js"></script>

<!-- CDN (recommended quick test or remote hosting) -->
<script src="https://cdn.jsdelivr.net/gh/ashfad0273/Blur-Stack@main/blur-stack.js"></script>
```

2. Add the `data-blur-stack` attribute to an element that has a background (image, gradient, or other content). Example:

```html
<div
	data-blur-stack="step-10_min-0_max-16_topToBottom_soft"
	style="width:500px;height:500px;background-image:url('https://framerusercontent.com/images/OvoeUUoJieDxhdSVb3JYp89qeI.png');border-radius:8px;"
></div>
```

The script will automatically run on DOMContentLoaded and generate the blur layers.

## Attribute API

Provide options via the `data-blur-stack` attribute. Options are underscore-separated. Recognized parts:

- step-{N} — number of blur layers to create (default: 8). Example: `step-10`.
- min-{X} — minimum blur value in px (default: 2). Example: `min-0`.
- max-{Y} — maximum blur value in px (default: 16). Example: `max-20`.
- Direction — one of `leftToRight`, `rightToLeft`, `topToBottom`, `bottomToTop` (default: `topToBottom`).
- Mode — `soft` (default) or `full`.

Example parts combined: `step-10_min-0_max-16_topToBottom_soft`

Notes:
- The script parses these parts and falls back to sensible defaults when parts are missing.
- The `soft` mode creates overlapping gradient masks for a smooth stacked transition. `full` fills the entire element with a single blur amount per layer.

## Example `index.html`

This repository includes a working example in `index.html`. A minimal page to try it locally:

```html
<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width,initial-scale=1">
		<title>Blur Stack Example</title>
		<style>
			body{margin:0;display:flex;align-items:center;justify-content:center;height:100vh;background:#111}
			[data-blur-stack]{border-radius:8px;background-size:cover;background-position:center}
		</style>
	</head>
	<body>
		<div
			data-blur-stack="step-10_min-0_max-16_topToBottom_soft"
			style="width:500px;height:500px;background-image:url('https://framerusercontent.com/images/OvoeUUoJieDxhdSVb3JYp89qeI.png');"
		></div>
		<script src="blur-stack.js"></script>
	</body>
	</html>
```

## How it works (short)

- On load the script injects required base CSS for `.blur-layer` and then scans for elements with `data-blur-stack`.
- For each matching element it creates multiple absolutely-positioned `.blur-layer` children.
- Each layer uses `backdrop-filter: blur(Xpx)` and a `mask-image` (and `-webkit-mask-image`) linear gradient to create a directional blur fade.
- Finally the script ensures the original element content is positioned above the blur layers.

## Using on a website / CDN

- Local: copy `blur-stack.js` into your project and include it via a script tag as shown above.
- Direct GitHub raw: you can link the raw file, but note some browsers block raw GitHub content due to CORS/Content-Type. Prefer serving the file from your site or via a proper CDN.
- CDN/unpkg: If you publish the package to npm you can use unpkg/jsdelivr. For now, include the local file or host it on your server.

CDN quick example (jsDelivr)

```html
<!-- Use this tag to load directly from the repository via jsDelivr (main branch): -->
<script src="https://cdn.jsdelivr.net/gh/ashfad0273/Blur-Stack@main/blur-stack.js"></script>
```

Note: Loading directly from GitHub via a CDN is an easy way to test or demo the script, but for production it's better to vendor the file or serve it from your own CDN to avoid unexpected changes when the repo is updated.

## Browser support & notes

- Uses CSS backdrop-filter — this requires browser support (works in modern Chromium-based browsers and Safari with -webkit-backdrop-filter). There is graceful behavior in unsupported browsers (the blur simply won't appear).
- Ensure the element has a background (image/gradient) or is placed over content that can be blurred via backdrop-filter.
- Masking uses CSS masks — older browsers may not support mask-image or -webkit-mask-image.

## License

MIT

## Credits

Created by the repository owner. See the source: https://github.com/ashfad0273/Blur-Stack/blob/main/blur-stack.js

