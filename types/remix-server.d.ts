// Type definitions for Remix server build output
// This file provides type safety for the compiled Remix server build

declare module "./build/server/index.js" {
  import type { ServerBuild } from "@remix-run/node";
  
  const build: ServerBuild;
  export default build;
  export = build;
}

declare module "*/build/server/index.js" {
  import type { ServerBuild } from "@remix-run/node";
  
  const build: ServerBuild;
  export default build;
  export = build;
}

// Additional type declarations for build artifacts
declare module "virtual:remix/server-build" {
  import type { ServerBuild } from "@remix-run/node";
  
  const build: ServerBuild;
  export default build;
}
