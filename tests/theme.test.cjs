const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
const path = require("node:path");

function loadModule(file, dependencies = {}) {
  const source = fs.readFileSync(path.join(__dirname, "..", file), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  });
  const exports = {};
  vm.runInNewContext(outputText, {
    exports,
    require: (name) => {
      assert.ok(name in dependencies, `Unexpected dependency: ${name}`);
      return dependencies[name];
    },
  }, { filename: file });
  return exports;
}

test("theme preference survives reload without touching authentication", async () => {
  const values = new Map([["@petos:token", "session-token"]]);
  const storage = {
    getItem: async (key) => values.get(key) ?? null,
    setItem: async (key, value) => { values.set(key, value); },
  };
  const dependencies = { "@react-native-async-storage/async-storage": storage };
  const theme = loadModule("src/storage/themeStorage.ts", dependencies);
  assert.equal(await theme.getThemePreference(), null);
  await theme.saveThemePreference("light");
  const reloaded = loadModule("src/storage/themeStorage.ts", dependencies);
  assert.equal(await reloaded.getThemePreference(), "light");
  await reloaded.saveThemePreference("dark");
  assert.equal(await theme.getThemePreference(), "dark");
  assert.equal(values.get("@petos:token"), "session-token");
  values.set("@petos:theme", "invalid-value");
  assert.equal(await theme.getThemePreference(), null);
});

test("storage failures remain visible to the theme provider", async () => {
  const failure = new Error("Storage unavailable");
  const theme = loadModule("src/storage/themeStorage.ts", {
    "@react-native-async-storage/async-storage": {
      getItem: async () => { throw failure; },
      setItem: async () => { throw failure; },
    },
  });
  await assert.rejects(theme.getThemePreference(), failure);
  await assert.rejects(theme.saveThemePreference("light"), failure);
});

function luminance(hex) {
  const channels = hex.slice(1).match(/../g).map((value) => {
    const channel = parseInt(value, 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

test("both palettes keep readable text, accents and error messages", () => {
  const { themeColors } = loadModule("src/styles/colors.ts");
  for (const [mode, colors] of Object.entries(themeColors)) {
    const pairs = [
      ...["background", "surface", "surfaceMuted", "successSurface", "infoSurface"].flatMap(
        (background) => [["text", background], ["textSecondary", background]],
      ),
      ["accentText", "surface"], ["accentText", "successSurface"],
      ["onAccent", "accent"], ["onDanger", "danger"],
      ["dangerText", "dangerSurface"], ["dangerText", "background"],
    ];
    for (const [foreground, background] of pairs) {
      const values = [luminance(colors[foreground]), luminance(colors[background])].sort((a, b) => a - b);
      const contrast = (values[1] + 0.05) / (values[0] + 0.05);
      assert.ok(contrast >= 4.5, `${mode}: ${foreground}/${background} contrast ${contrast.toFixed(2)}`);
    }
  }
});
