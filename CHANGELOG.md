# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2026-01-02]

### [ngx-rut-v2] v1.10.0

#### Added
- **Real-time RUT formatting** while user types (no longer waits for blur event)
- **Input character restriction**: Only allows numbers and letter 'K'
- **Automatic uppercase conversion** for letter 'K'
- **Cursor position preservation** during real-time formatting
- Enhanced user experience with immediate visual feedback
- Success validation message display (green checkmark for valid RUTs)
- Fixed navbar navigation with animated anchor links
- Active link detection using Intersection Observer API

#### Changed
- `RutValueAccessor` now formats input in real-time via `@HostListener('input')` instead of on blur
- Added `@HostListener('keydown')` to restrict character input to numbers and K
- Form control receives clean, unformatted data while input displays formatted value
- Input display shows formatted RUT (e.g., "12.345.678-K") while form value remains clean (e.g., "12345678K")
- Navigation refactored from route-based to fixed navbar with smooth scroll anchor links

#### Technical Details
- Enhanced `onInput` handler with cursor position management using `setSelectionRange`
- Added `onKeyDown` handler with regex validation `/^[0-9kK]$/`
- Implemented `toUpperCase()` conversion before RUT cleaning
- Cursor restoration using `setTimeout` for DOM update synchronization

#### UI/UX Improvements
- Added real-time validation feedback (success/error messages)
- Implemented smooth scrolling navigation with `scroll-behavior: smooth`
- Active section highlighting in navbar using Intersection Observer
- Home page now displays both example components (RUT and Separador Miles)

### [ngx-rut-v2] v1.9.0

#### Changed
- Updated to Angular 21.0.6 compatibility
- Updated @angular/cli to 21.0.4
- Updated @angular/build to 21.0.4
- Updated TypeScript to 5.9.3
- Updated ng-packagr to 21.0.1
- Updated peer dependencies to support Angular 20 and 21 (>=20.0.0 <22.0.0)

#### Added
- Consolidated ngx-rut-v2 library into ngx-common-prosmart monorepo
- Added library source code (directives, helpers, pipes)
- Added comprehensive README and CHANGELOG documentation
- Configured build pipeline for ngx-rut-v2

### [ngx-separador-miles] v0.0.3

#### Added
- Initial stable release of ngx-separador-miles directive
- Automatic thousands separator formatting for input fields with real-time updates
- Configurable decimal and thousands separators for international format support
- Signal-based configuration API using Angular's latest patterns
- Full ControlValueAccessor implementation for seamless form integration
- Support for Angular 21.x with backward compatibility to Angular 19.2.0+
- Cursor position preservation during number formatting
- Graceful handling of copy/paste operations
- Optional decimal value support with configurable precision
- Disabled state handling for form controls
- Comprehensive test suite with 30+ test cases covering edge cases
- Live demo and documentation site on GitHub Pages
- GitHub Actions CI/CD pipeline for automated testing and deployment
- Compatibility table for Angular version tracking

#### Features
- **European format**: 1.234.567,89
- **US format**: 1,234,567.89
- **Space separator format**: 1 234 567,89
- **Custom configurations**: Fully customizable separators

#### Technical
- Zero external dependencies (except Angular peer dependencies)
- Type-safe TypeScript implementation
- Standalone component architecture
- Signal-based reactive configuration
- Production-ready code quality

## [Unreleased]

### Planned
- [ngx-separador-miles] Version 0.1.x: Angular 22.x support
- [ngx-separador-miles] Version 1.0.x: Angular 23.x support and stable API freeze
- [ngx-rut-v2] Version 2.x: Angular 22+ support
- Integration of additional common utility libraries
