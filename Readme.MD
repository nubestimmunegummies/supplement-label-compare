# Supplement Label Compare

A small, dependency-free web app that shows supplement labels side by side and highlights ingredients that appear in more than one selected product.

It's a practical exercise in three everyday front-end skills:

- **Modeling real-world data** as plain JavaScript objects
- **Comparing lists with `Set`**, including normalizing ingredient names that are written differently on different labels (for example, "Green Tea" and "Green Tea Extract")
- **Rendering to the DOM safely** with `createElement` and `textContent` instead of `innerHTML`

## Features

- Select any combination of products with accessible checkboxes
- Labels render as "Supplement Facts" style panels
- Shared ingredients are highlighted in each panel and listed in a summary
- Explicit alias map for ingredient name normalization
- Light and dark mode, responsive layout, visible keyboard focus
- No build step, no frameworks, no dependencies

## Getting started

Clone the repository and open `index.html` in a browser:

```bash
git clone https://github.com/<your-username>/supplement-label-compare.git
cd supplement-label-compare
open index.html   # or double-click the file
```

To publish it, enable **GitHub Pages** in the repository settings (Settings → Pages → Deploy from branch → `main` / root).

## Project structure

```
supplement-label-compare/
├── index.html   # Page structure
├── style.css    # Layout, label-panel styling, light/dark themes
├── script.js    # Data, normalization, overlap logic, rendering
└── README.md
```

## How the comparison works

1. Each product stores its ingredient names exactly as printed on the label.
2. Before comparing, `normalize()` lowercases and trims each name, then maps known aliases to one canonical name.
3. `findOverlap()` turns one product's ingredients into a `Set` and filters the other list against it.
4. `allOverlaps()` checks every pair of selected products once.

To add a product, append an object to the `products` array in `script.js`. To handle a new naming variation, add an entry to `ALIASES`.

## Ideas for extending it

- Store amounts and units (`{ name, amount, unit }`) and show combined totals
- Represent serving ranges as `{ min, max }`
- Load product data from a JSON file with `fetch()`
- Add filters for dietary tags such as vegan or gluten-free

## Data source

The sample data uses the public product labels of three products in the [NuBest skin brightening collection](https://www.nubest.com/collections/skin-brightening-supplement). Labels can change over time, so verify against the current source before reusing the data.

## Disclaimer

This project is a coding demo for comparing ingredient lists. It is not health or medical advice, and it does not evaluate whether any supplement or combination is appropriate for anyone. Talk to a doctor or pharmacist before starting or combining supplements.

**Disclosure:** The author works with NuBest Nutrition, whose product labels are used as sample data.

## License

MIT
