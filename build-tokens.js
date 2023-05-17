const {
  transforms,
  registerTransforms,
} = require("@tokens-studio/sd-transforms");
const StyleDictionary = require("style-dictionary");

registerTransforms(StyleDictionary, { excludeParentKeys: true });

const sets = [
  "global",
  "button",
  "table",
  "pagination",
  "tag",
  "input",
  "dropdown",
  "sidebar",
];

const tokenFilter = (cat) => (token) => token.attributes.category === cat;

const globalFilter = (token) => !sets.includes(token.attributes.category);

const generateFilesArr = (tokensCategories) => {
  return tokensCategories.map((cat) => ({
    filter: cat === "global" ? globalFilter : tokenFilter(cat),
    destination: `tokens/${cat}.js`,
    format: "javascript/es6",
  }));
};

StyleDictionary.registerTransform({
  name: "numberify",
  type: "value",
  transitive: true,
  transformer: function (token) {
    const numberified = Number(`${token.value}`.replace(/px$/, ""));
    if (isNaN(numberified)) {
      return token.value;
    }
    return numberified;
  },
});

StyleDictionary.registerTransformGroup({
  name: "custom/tokens-studio",
  transforms: [...transforms, "attribute/cti", "numberify", "name/cti/camel"],
});

const sd = StyleDictionary.extend({
  source: [`tokens.json`],
  platforms: {
    js: {
      transformGroup: "custom/tokens-studio",
      files: generateFilesArr(sets),
    },
  },
});

sd.cleanAllPlatforms();
sd.buildAllPlatforms();
