# Build System Documentation

This document explains the TypeScript build system configuration for the Remix project.

## Overview

The project now supports both development (TypeScript) and production (compiled JavaScript) workflows:

- **Development**: Uses `vite-node` to run TypeScript directly
- **Production**: Compiles TypeScript to JavaScript using `tsc` for consistency and traceability

## Build Configuration Files

### 1. `tsconfig.server.json`
Dedicated TypeScript configuration for compiling the server:
- Outputs to `./build/server.js`
- Configured for ESM (ES Modules)
- Includes source maps for debugging
- Excludes app files (handled by Remix/Vite)

### 2. `types/remix-server.d.ts`
Type definitions for Remix build artifacts:
- Provides type safety for `./build/server/index.js`
- Handles `virtual:remix/server-build` module
- Committed to repository for build consistency

## Available Scripts

### Development
```bash
npm run dev                 # Run development server with vite-node
npm run typecheck          # Type check all files
npm run typecheck:server   # Type check server only (no emit)
```

### Building
```bash
npm run build              # Build Remix app (client + server)
npm run build:server       # Compile server.ts to JavaScript
npm run build:all          # Build both Remix app and server
```

### Production
```bash
npm run start              # Run with vite-node (development-like)
npm run start:compiled     # Run compiled JavaScript server
```

## Build Process

### For Development
1. `npm run dev` - Runs TypeScript directly with vite-node

### For Production/CI
1. `npm run build:all` - Builds everything:
   - Remix builds client and server bundles to `build/`
   - TypeScript compiles `server.ts` to `build/server.js`
2. `npm run start:compiled` - Runs the compiled JavaScript

## File Structure

```
project/
├── server.ts                    # TypeScript server source
├── tsconfig.json               # Main TypeScript config (development)
├── tsconfig.server.json        # Server build config (production)
├── types/
│   └── remix-server.d.ts       # Type definitions for build artifacts
└── build/
    ├── server.js               # Compiled TypeScript server
    ├── server.js.map           # Source map
    ├── client/                 # Remix client build
    └── server/                 # Remix server build
        └── index.js            # Remix server bundle
```

## ESM Compatibility

The build system ensures full ESM compatibility:
- `"type": "module"` in package.json
- TypeScript compiles to ESM (`import/export`)
- No CommonJS (`require()`) in output
- Compatible with Node.js ESM requirements

## DevOps Integration

This setup enables:
- **Consistent builds**: Same compiled code in testing and production
- **Traceability**: Source maps for debugging production issues
- **Type safety**: Full TypeScript checking during build
- **Performance**: Compiled JavaScript runs faster than runtime TypeScript

## Troubleshooting

### Build Errors
- Ensure `npm run build` completes before `npm run build:server`
- Check that `types/remix-server.d.ts` is committed to repository

### Runtime Errors
- Verify `build/server/index.js` exists (run `npm run build` first)
- Check that all imports use ESM syntax
- Ensure Node.js version supports ESM (>=14.x)

### Type Errors
- Run `npm run typecheck:server` to check server types only
- Update `types/remix-server.d.ts` if Remix build structure changes
