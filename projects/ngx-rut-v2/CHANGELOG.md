# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2026-01-02

### Added
- Focus-aware `writeValue()` implementation in `RutValueAccessor` to handle programmatic form updates
- Cursor position preservation during programmatic updates when input is focused
- Reactive pattern for cursor management - only manages cursor when `document.activeElement === input`
- Prevention of unnecessary DOM updates by checking if value actually changed before updating

### Changed
- Migrated `RutValueAccessor` to standalone directive (no longer requires NgModule)
- Replaced constructor-based dependency injection with `inject()` pattern (Angular 14+ best practice)
- Enhanced `writeValue()` to maintain formatting even during `setValue()` or `patchValue()` operations
- Improved cursor position calculation with boundary checks to prevent out-of-range errors

### Deprecated
- **`RutDirective` (selector: `[formatRut]`) has been renamed to `[formatRutLegacy]` and is deprecated**
- The legacy focus/blur formatting directive will be removed in v3.0.0
- Console warnings now appear when using `[formatRutLegacy]` to guide migration
- **Migration Guide:**
  ```html
  <!-- ❌ Old (deprecated): -->
  <input formControlName="rut" formatRutLegacy />
  
  <!-- ✅ New (recommended): -->
  <input formControlName="rut" formatRut />
  ```
- Users should migrate to `RutValueAccessor` (selector: `input[formatRut]`) which provides better functionality:
  - Real-time formatting during typing
  - Cursor position management
  - Support for programmatic form updates
  - Keyboard input restrictions

### Fixed
- **[CRITICAL]** RUT formatting no longer lost when form values are updated programmatically (e.g., via search/fetch operations)
- Eliminated selector collision between `RutDirective` and `RutValueAccessor` (both previously used `[formatRut]`)
- Cursor position now correctly preserved during programmatic updates when input is focused
- Prevented jarring UI updates by conditionally managing cursor only when user is actively focused on input

### Technical Details
- Uses `document.activeElement` check to determine if cursor management is needed (reactive approach)
- Eliminates reliance on arbitrary `setTimeout()` delays for DOM updates in most scenarios
- Uses `Renderer2.setProperty()` for safe DOM manipulation following Angular best practices
- Cursor position calculation: `Math.max(0, Math.min(prevPos + diff, formatted.length))`
- Only updates DOM when `input.value !== formatted` to prevent unnecessary re-renders

## [1.10.0] - 2026-01-02

### Added
- Real-time RUT formatting as user types (no longer waits for blur event)
- Input character restriction: only allows numbers and letter 'K'
- Automatic uppercase conversion for letter 'K'
- Cursor position preservation during real-time formatting
- Enhanced user experience with immediate visual feedback

### Changed
- `RutValueAccessor` now formats input in real-time via `@HostListener('input')` instead of on blur
- Added `@HostListener('keydown')` to restrict character input to numbers and K
- Form control receives clean, unformatted data while input displays formatted value
- Input display shows formatted RUT (e.g., "12.345.678-K") while form value remains clean (e.g., "12345678K")

### Technical Details
- Enhanced `onInput` handler with cursor position management
- Added `onKeyDown` handler with regex validation `/^[0-9kK]$/`
- Implemented `toUpperCase()` conversion before cleaning
- Cursor restoration using `setTimeout` with `setSelectionRange`

## [1.9.0] - 2026-01-02

### Changed
- Updated to Angular 21.0.6 compatibility
- Updated @angular/cli to 21.0.4
- Updated @angular/build to 21.0.4
- Updated TypeScript to 5.9.3
- Updated ng-packagr to 21.0.1
- Updated peer dependencies to support Angular 20 and 21 (>=20.0.0 <22.0.0)

## [1.8.0] - 2025-10-06

### Changed
- Updated to Angular 20.3.3 compatibility
- Updated @angular/cli to 20.3.4
- Updated @angular/build to 20.3.4
- Updated TypeScript to 5.9.3
- Updated ng-packagr to 20.3.0
- Updated peer dependencies to support Angular ^20.0.0

## [1.7.0] - 2025-09-05

### Fixed
- Corrected README documentation to reflect actual implementation
- Fixed import examples to use correct exports (`rutValidator`, `RutValidator`, etc.)
- Removed references to non-existent `RutValidatorReactive`
- Updated reactive forms examples to use proper `rutValidator` function
- Added `RutValueAccessor` to documentation and examples
- Fixed template examples for better accuracy

### Changed
- Updated compatibility table to include version 1.7.0

## [1.6.4] - 2025-XX-XX

### Added
- Initial release with standalone components support
- RUT validation and formatting helpers
- Standalone directives for validation and formatting
- Standalone pipe for RUT formatting
- Support for Angular 19

### Changed
- Migrated from module-based to standalone components

## [1.6.0] - 2025-XX-XX

### Changed
- Updated to Angular 19 compatibility

## [1.5.0] - 2025-XX-XX

### Changed
- Updated to Angular 18 compatibility
