"use strict";

// Sample data: public label information. Ingredient names are kept as they
// appear on each label; normalization happens only when comparing.
const products = [
  {
    id: "white",
    name: "NuBest White",
    serving: "2 capsules daily, after meals",
    vegan: true,
    ingredients: [
      "Vitamin C", "Vitamin E", "Vitamin B2", "L-Glutathione",
      "Polypodium Leucotomos", "Alpha Lipoic Acid",
      "Milk Thistle", "Green Tea Extract"
    ]
  },
  {
    id: "collagen",
    name: "Collagen NuBest",
    serving: "3 capsules daily, after a meal",
    vegan: false,
    ingredients: ["Collagen Hydrolysate (Bovine)"]
  },
  {
    id: "womens-multi",
    name: "Women's Multi",
    serving: "1 to 2 capsules in the morning, with a meal",
    vegan: true,
    ingredients: [
      "Vitamin A", "Vitamin C", "Vitamin D3", "Vitamin E",
      "Vitamin B1", "Vitamin B2", "Vitamin B3", "Vitamin B6",
      "Folate", "Vitamin B12", "Biotin", "Pantothenic Acid",
      "Calcium", "Magnesium", "Zinc", "Selenium", "Copper",
      "Manganese", "Chromium", "Molybdenum", "Horny Goat Weed",
      "Maca", "Wild Yam", "Red Clover", "Cranberry", "Arginine",
      "Turmeric", "Green Tea", "Bilberry", "Pomegranate",
      "Cinnamon", "Hawthorn", "Grape Extract", "Black Currant",
      "Echinacea", "Spirulina", "Garlic Powder", "Beta Glucan"
    ]
  }
];

// Explicit alias list: different label wording for the same ingredient.
const ALIASES = {
  "green tea extract": "green tea",
  "riboflavin": "vitamin b2",
  "ascorbic acid": "vitamin c"
};

function normalize(name) {
  const key = name.toLowerCase().trim();
  return ALIASES[key] ?? key;
}

function findOverlap(a, b) {
  const namesB = new Set(b.ingredients.map(normalize));
  return [...new Set(a.ingredients.map(normalize))].filter(n => namesB.has(n));
}

function allOverlaps(list) {
  const results = [];
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      const shared = findOverlap(list[i], list[j]);
      if (shared.length > 0) {
        results.push({ a: list[i].name, b: list[j].name, shared });
      }
    }
  }
  return results;
}

// Count how many selected products contain each normalized ingredient.
function sharedNames(list) {
  const counts = new Map();
  list.forEach(p => {
    new Set(p.ingredients.map(normalize)).forEach(n => {
      counts.set(n, (counts.get(n) || 0) + 1);
    });
  });
  return new Set([...counts].filter(([, c]) => c > 1).map(([n]) => n));
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderPicker() {
  const container = document.getElementById("picker-options");
  products.forEach((p, index) => {
    const label = el("label");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = p.id;
    input.checked = index !== 1; // start with two products selected
    input.addEventListener("change", update);
    label.append(input, document.createTextNode(p.name));
    container.appendChild(label);
  });
}

function selectedProducts() {
  const ids = [...document.querySelectorAll("#picker-options input:checked")]
    .map(input => input.value);
  return products.filter(p => ids.includes(p.id));
}

function renderPanels(list) {
  const container = document.getElementById("panels");
  container.replaceChildren();
  const shared = sharedNames(list);

  list.forEach(p => {
    const panel = el("article", "panel");
    panel.append(
      el("h3", null, "Label Facts"),
      el("p", "product", p.name),
      el("p", "meta", `Serving: ${p.serving}`),
      el("p", "meta", `Vegan: ${p.vegan ? "Yes" : "No"}`),
      el("p", "meta", `Listed active ingredients: ${p.ingredients.length}`),
      el("p", "list-head", "Ingredients")
    );

    const ul = el("ul");
    p.ingredients.forEach(name => {
      const isShared = shared.has(normalize(name));
      const li = el("li", isShared ? "shared" : null, name);
      if (isShared) li.setAttribute("aria-label", `${name}, also in another selected product`);
      ul.appendChild(li);
    });

    panel.append(ul, el("p", "panel-end"));
    container.appendChild(panel);
  });
}

function renderOverlaps(list) {
  const ul = document.getElementById("overlap-list");
  ul.replaceChildren();

  if (list.length < 2) {
    ul.appendChild(el("li", "empty", "Select at least two products to check for shared ingredients."));
    return;
  }

  const overlaps = allOverlaps(list);
  if (overlaps.length === 0) {
    ul.appendChild(el("li", "empty", "No shared ingredients between the selected products."));
    return;
  }

  overlaps.forEach(({ a, b, shared }) => {
    ul.appendChild(el("li", null, `${a} and ${b}: ${shared.join(", ")}`));
  });
}

function update() {
  const list = selectedProducts();
  renderPanels(list);
  renderOverlaps(list);
}

renderPicker();
update();
