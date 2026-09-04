import { defineConfig } from 'vitest/config';

/**
 * Extra Vitest configuration for the ClientApp unit tests, loaded by the
 * `@angular/build:unit-test` builder (`runnerConfig: "vitest.config.ts"`).
 */
export default defineConfig({
  test: {
    // Shared CI agents are slow enough for a single component creation to exceed Vitest's
    // 5000 ms default, so both timeouts are raised well above it.
    testTimeout: 30000,
    hookTimeout: 30000,
  },
});
