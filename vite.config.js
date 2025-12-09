// vite.config.js  (CJS with dynamic import of ESM plugin)
const { defineConfig } = require('vite');

/**
 * When an installed plugin is ESM-only, use dynamic import inside an async function.
 * Vite accepts a Promise that resolves to the config.
 */
module.exports = defineConfig(async () => {
  // Dynamically import the ESM plugin and get its default export
  const reactPlugin = (await import('@vitejs/plugin-react')).default;

  return {
    plugins: [ reactPlugin() ],
    // other config...
  };
});
