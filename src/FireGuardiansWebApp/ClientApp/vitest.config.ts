import { defineConfig } from 'vitest/config';

/**
 * Extra Vitest configuration for the ClientApp unit tests, loaded by the
 * `@angular/build:unit-test` builder (`runnerConfig: "vitest.config.ts"`).
 */
export default defineConfig({
  test: {
    server: {
      deps: {
        // `@meshmakers/shared-ui@3.3.x` imports `cronstrue/locales/de` and
        // `cronstrue/locales/en` without the `.js` extension. `cronstrue` ships no
        // `exports` map, so Node's ESM loader cannot resolve those specifiers and the
        // externalised package fails to load. Letting Vite transform the package instead
        // uses Vite's resolver, which appends the extension.
        // Remove this file once a `@meshmakers/shared-ui` release with the `.js` locale
        // imports is consumed.
        inline: [/@meshmakers[/\\]shared-ui/],
      },
    },
  },
});
