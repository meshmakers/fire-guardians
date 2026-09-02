/**
 * Vitest setup for the Fire Guardians ClientApp workspace.
 * Referenced via the `setupFiles` option of the `@angular/build:unit-test` target.
 * Execution order (enforced by the builder): polyfills.js (zone.js, zone.js/testing)
 * -> Angular TestBed initialisation -> this file -> spec files.
 */

// Wraps Vitest's describe/it/beforeEach/afterEach in zone.js ProxyZone so that
// fakeAsync/tick/flush/waitForAsync keep working. Requires zone.js/testing to be loaded already.
import 'zone.js/plugins/vitest-patch';

// ---- jsdom shims: APIs jsdom does not implement but specs spy on or components call unguarded ----

// navigator.clipboard: jsdom does not implement the async clipboard API. Components that copy
// or paste call it unguarded, and specs need something spy-able.
if (!('clipboard' in navigator)) {
  Object.defineProperty(navigator, 'clipboard', {
    value: {
      writeText: (): Promise<void> => Promise.resolve(),
      readText: (): Promise<string> => Promise.resolve(''),
    },
    configurable: true,
    writable: true,
  });
}

// window.fetch / Response / Request / Headers: defensive bridge from Node's globals.
// Under Vitest's jsdom environment `window === globalThis`, so these are normally already
// present; specs that spy on `window.fetch` or construct `new Response(...)` rely on it.
const w = window as unknown as Record<string, unknown>;
const g = globalThis as unknown as Record<string, unknown>;
for (const name of ['fetch', 'Response', 'Request', 'Headers']) {
  if (typeof w[name] === 'undefined' && typeof g[name] !== 'undefined') {
    w[name] = g[name];
  }
}

// URL.createObjectURL / revokeObjectURL: jsdom implements neither. Anything that triggers a
// client-side download or previews a Blob calls them, and specs spy on them.
if (typeof URL.createObjectURL !== 'function') {
  URL.createObjectURL = (): string => 'blob:vitest';
  URL.revokeObjectURL = (): void => undefined;
}

// ResizeObserver: not implemented by jsdom. Kendo and the CDK feature-detect it, but component
// code frequently constructs it unguarded.
if (typeof globalThis.ResizeObserver === 'undefined') {
  class ResizeObserverStub {
    observe(): void { /* no-op */ }
    unobserve(): void { /* no-op */ }
    disconnect(): void { /* no-op */ }
  }
  (globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver = ResizeObserverStub;
}

// HTMLElement.innerText: jsdom implements none. Widgets that read it during change detection
// (Kendo's SplitButton does, in ngDoCheck) would throw on undefined, so map it to textContent.
if (!('innerText' in HTMLElement.prototype)) {
  Object.defineProperty(HTMLElement.prototype, 'innerText', {
    get(this: HTMLElement): string {
      return this.textContent ?? '';
    },
    set(this: HTMLElement, value: string) {
      this.textContent = value;
    },
    configurable: true,
  });
}

// Element.prototype pointer capture: jsdom implements none of the three. Drag, resize and
// pan interactions call them on pointerdown/pointerup.
const proto = Element.prototype as unknown as Record<string, unknown>;
for (const name of ['setPointerCapture', 'releasePointerCapture', 'hasPointerCapture']) {
  if (typeof proto[name] !== 'function') {
    proto[name] = name === 'hasPointerCapture' ? (): boolean => false : (): void => undefined;
  }
}

// DragEvent: jsdom has neither DragEvent nor DataTransfer, so specs cannot dispatch a
// drag-and-drop event without a stand-in. MouseEvent carries the coordinates that matter.
if (typeof (globalThis as unknown as { DragEvent?: unknown }).DragEvent === 'undefined') {
  class DragEventStub extends MouseEvent {
    readonly dataTransfer: null = null;
  }
  (globalThis as unknown as { DragEvent: unknown }).DragEvent = DragEventStub;
}

// window.matchMedia: jsdom 28 does not implement it. Components and services that react to a
// media query call it unguarded in field initialisers, so it must exist before the first
// TestBed instantiation. Guard on typeof, not `'matchMedia' in window`.
if (typeof window.matchMedia !== 'function') {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: (): void => undefined,
    removeListener: (): void => undefined,
    addEventListener: (): void => undefined,
    removeEventListener: (): void => undefined,
    dispatchEvent: (): boolean => false,
  })) as unknown as typeof window.matchMedia;
}

// ---- Jasmine parity ----

// Jasmine restored every spy after each spec; Vitest keeps vi.spyOn spies (and their call history)
// alive across tests unless restored. Restore them after every test for Jasmine parity.
// Vitest 4's restoreAllMocks no longer clears standalone vi.fn() state, so describe-scoped
// stubs (not created via spyOn) leaked call history between tests — clearAllMocks covers those.
afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});
