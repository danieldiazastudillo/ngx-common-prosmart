/*
 * Public API Surface of ngx-rut-v2
 */

// Core helpers — rutClean, rutFormat, rutValidate, isAllowedRutKey
export * from './lib/helpers/rut-helpers';
export * from './lib/directives/rut-validator.directive';
export * from './lib/directives/rut-value-accessor.directive';
export * from './lib/directives/rut.directive';
export * from './lib/pipes/rut.pipe';

/**
 * @experimental Signal Forms support (requires Angular 21+)
 * This directive uses Angular's experimental Signal Forms API.
 * The API may change until it becomes stable in future Angular versions.
 */
export * from './lib/controls/rut-signal.directive';
