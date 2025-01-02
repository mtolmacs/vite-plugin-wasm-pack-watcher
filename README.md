# vite-plugin-wasm-pack-watcher

A Vite plugin which recompiles your Rust WebAssembly project whenever you modify
a Rust (\*.rs) file.

## Usage

Add it to your `vite.config.(js|ts)` file and set the `build.watch` parameter
to listen for .rs file changes as well:

```ts
import { defineConfig } from "vite";
import wasmPackWatchPlugin from "vite-plugin-wasm-pack-watcher";

export default defineConfig({
  build: {
    watch: {
      include: ["src/**/*.js", "src/**/*.ts", "src/**/*.rs"], // Watch for *.rs files
    },
  },
  plugins: [
    wasmPackWatchPlugin({
      /*
            buildCommand: "<your custom build command to run, defaults to wasm-pack build --dev>"
      */
    }),
  ],
});
```

> Note: Please note that this plugin is not a replacement for `vite-plugn-wasm`
> or similar plugins!
