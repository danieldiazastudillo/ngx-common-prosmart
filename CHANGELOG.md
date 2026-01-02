# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.3] - 2026-01-02

### Added
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

### Features
- **European format**: 1.234.567,89
- **US format**: 1,234,567.89
- **Space separator format**: 1 234 567,89
- **Custom configurations**: Fully customizable separators

### Technical
- Zero external dependencies (except Angular peer dependencies)
- Type-safe TypeScript implementation
- Standalone component architecture
- Signal-based reactive configuration
- Production-ready code quality

## [Unreleased]

### Planned
- Version 0.1.x: Angular 22.x support
- Version 1.0.x: Angular 23.x support and stable API freeze
