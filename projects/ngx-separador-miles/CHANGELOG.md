# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-03-14

### Fixed
- Added `effect()` constructor to `SeparadorSignalDirective` to automatically sync the input display value when the form model is updated programmatically (e.g. `model.set()`, form reset). This matches the existing behaviour in `ngx-rut-v2`.
- Replaced deprecated `WithOptionalField<ValidationError>` type with `WithOptionalFieldTree<ValidationError>` in the Signal Forms directive.

### Added
- Test suite for `SeparadorSignalDirective` (`separador-signal.directive.spec.ts`) covering programmatic sync, input/blur/keydown event handling, cursor position restoration, and configurable separators.

### Docs
- Corrected Angular compatibility table (was showing incorrect version `0.0.3` as current; now shows `1.0.x`).
- Updated all Signal Forms code examples to use the canonical `[formField]` binding with `FormField` imported (replaces the manual `[(value)]` pattern).
- Removed stale references to `customError()` (removed from `@angular/forms/signals` API); validator callbacks now return plain objects `{ kind, message }`.

## [1.0.0] - 2026-01-02

### 🎉 First Stable Release

This marks the first stable release of ngx-separador-miles, indicating production-ready status.

### Changed
- Updated to Angular 21.x compatibility
- Maintained backward compatibility with Angular 19.2.0+
- Enhanced documentation with Angular compatibility table
- Improved README with live demo links and comprehensive examples
- Updated version to 1.0.0 to reflect stable, production-ready status

### Added
- Comprehensive Angular version compatibility table
- Status indicators for current and planned versions
- Links to live examples on GitHub Pages
- Automated npm publication workflow via GitHub Actions
- CI/CD pipeline documentation

### Fixed
- Stabilized API for long-term support
- Verified all features working correctly in production scenarios

## [0.0.2] - 2025-XX-XX

### Added
- Signal-based configuration support
- Configurable thousand and decimal separators
- Optional decimal support
- Cursor position maintenance during formatting
- Type-safe implementation

### Changed
- Improved input sanitization
- Enhanced blur event handling
- Optimized real-time formatting performance

## [0.0.1] - 2025-XX-XX

### Added
- Initial release with standalone directive support
- Basic thousands separator formatting
- Angular Reactive Forms integration
- ControlValueAccessor implementation
- Support for Angular 19.2.0+
