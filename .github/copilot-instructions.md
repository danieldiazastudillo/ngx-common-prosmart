# ngx-common-prosmart - AI Coding Agent Guide

## Project Overview

This is an **Angular 21 monorepo** designed to host multiple publishable npm libraries (currently two, but extensible). Each library is independent, with its own GitHub Actions workflow for CI/CD and publication. The workspace uses modern Angular features (standalone components, signals) and automated publishing.

**Architecture:**
- **Demo App** (`src/`): Standalone Angular app that publishes to GitHub Pages and showcases all libraries with live examples
- **Libraries** (`projects/`):
  - `ngx-separador-miles`: Thousands separator directive with signal-based config
  - `ngx-rut-v2`: Chilean RUT validation/formatting directives
  - *(future libraries can be added here, each with its own workflow)*

## Critical Patterns & Conventions

### 1. Standalone-First & Declarative Architecture
All components, directives, and pipes MUST be standalone. Never use `NgModule`. Always prefer a declarative, signal-based approach as per Angular MCP best practices.

**Dependency Injection:** Always use `inject()` for DI, never constructor injection.

```typescript
// ✅ Correct
@Component({
  standalone: true,
  imports: [ReactiveFormsModule, SeparadorMilesAccessor]
})
private readonly fb = inject(FormBuilder);

// ❌ Wrong
constructor(private fb: FormBuilder) {}
```

### 2. ControlValueAccessor Pattern
Both libraries implement custom form controls via `ControlValueAccessor`. Key patterns:

**Cursor Position Management** - Essential for real-time formatting:
```typescript
@HostListener('input', ['$event'])
onInput(event: Event) {
  const prevPos = input.selectionStart ?? 0;
  const prevLength = input.value.length;
  // Format value...
  input.value = formatted;
  // Restore cursor accounting for length changes
  const newPos = prevPos + (formatted.length - prevLength);
  input.setSelectionRange(newPos, newPos);
}
```

**Separation of Concerns**:
- Display value (formatted): What user sees in `<input>`
- Control value (clean): What reactive form receives
- Example: Display `12.345.678-K`, form gets `12345678K`

### 3. Signal-Based Configuration
Use `input()` signals for directive configuration (Angular 21+):

```typescript
// In directive
config = input<{ thousandSeparator?: string }>({});
// In template
<input [libSeparadorMiles.config]="{ thousandSeparator: ',' }" />
```

### 4. Testing with Vitest
This project uses **Vitest**. Always cover main functionalities, especially cursor position and formatting logic. No coverage thresholds required.

```typescript
import { vi } from 'vitest';
import { describe, it, expect, beforeEach } from 'vitest';
// Mock timers for cursor position tests
vi.useFakeTimers();
setTimeout(() => input.setSelectionRange(newPos, newPos), 0);
vi.runAllTimers();
```

## Developer Workflows

### Library Development Workflow
```bash
# Start dev server with hot reload
npm start  # Runs demo app with library imports

# Build specific library
ng build ngx-separador-miles
ng build ngx-rut-v2

# Test specific library
ng test ngx-separador-miles
ng test ngx-rut-v2
```

### Publishing Workflow (Automated via GitHub Actions)
**NEVER manually run `npm publish`**. The CI/CD handles this:

#### Semantic Versioning
- **Major**: Breaking changes or incompatible API updates
- **Minor**: New features, backward-compatible
- **Patch**: Bug fixes, backward-compatible

1. Update version in `projects/<library>/package.json` (follow semantic versioning)
2. Update `CHANGELOG.md` and compatibility tables
3. Commit and push to `main` branch
4. GitHub Actions automatically:
  - Builds library
  - Checks if version exists on npm
  - Publishes if new version
  - Deploys demo to GitHub Pages

See [.github/workflows/publish-ngx-separador-miles.yml](.github/workflows/publish-ngx-separador-miles.yml)

### Demo App Structure
Each library has example components in `src/app/core/components/`:
- `separador-example/` - Demonstrates `ngx-separador-miles` usage
- `rut-example/` - Demonstrates `ngx-rut-v2` usage

These use `ngx-highlightjs` to display code examples alongside working demos.

## Key Files & Their Purpose

- **Public APIs** (`projects/*/src/public-api.ts`): Only exports here are available to library consumers
- **Helper Functions** (`projects/ngx-rut-v2/src/lib/helpers/rut-helpers.ts`): Reusable validation/formatting logic, exported for advanced users
- **ng-package.json**: Library build configuration, defines entry point and output paths
- **angular.json**: Defines 3 projects (1 app + 2 libraries), each with build/test targets

## Common Tasks

### Adding New Directive to Library
1. Create directive in `projects/<lib>/src/lib/`
2. Export in `public-api.ts`
3. Add tests with cursor position verification
4. Update library README with usage example
5. Add demo in `src/app/core/components/`

### Version Compatibility Updates
When supporting new Angular versions, update **both**:
- Library `README.md` compatibility table
- Root `README.md` compatibility table (keep in sync)

### Adding Library Configuration Options
Use signal inputs for reactive config:
```typescript
config = input<YourConfigType>({ /* defaults */ });

private get myOption() {
  return this.config().myOption ?? 'default';
}
```

## Gotchas & Important Notes

- **Cursor Position**: Always test cursor behavior during formatting. Use `setTimeout(() => setSelectionRange(), 0)` for async cursor updates
- **Library Imports in Demo**: Import from package name (`ngx-separador-miles`), NOT relative paths. This ensures demo matches real-world usage
- **Vitest Browser Mode**: Tests run in browser-like environment via `vitest` config, not headless browser
- **Chilean RUT Logic**: Validation uses a strict modulo-11 algorithm for the numeric part. The DV (digit verifier) can be numeric or 'K'. See `rutValidate()` in rut-helpers.ts for implementation details.
- **Separator Characters**: Default to Chilean convention (`.` for thousands, `,` for decimals) but allow customization

## Deployment

**GitHub Pages**: https://danieldiazastudillo.github.io/ngx-common-prosmart/
- Auto-deploys on push to `main`
- Serves compiled demo app from `dist/`
- Workflow: [.github/workflows/deploy.yml](.github/workflows/deploy.yml)
