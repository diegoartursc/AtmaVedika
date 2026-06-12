// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    rules: {
      // Escritas em sharedValue.value são a API do Reanimated — a regra
      // de imutabilidade do react-hooks não as reconhece (falso positivo).
      "react-hooks/immutability": "warn",
      // Componentes 3D (NatalChart3D*) carregam cena em efeito e usam
      // aleatoriedade decorativa no render; refatorar é risco visual.
      // Mantidos como warning até a revisão dos componentes 3D.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
    },
  },
]);
