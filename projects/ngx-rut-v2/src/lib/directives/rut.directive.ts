import { Directive, HostListener } from '@angular/core';
import { rutClean, rutFormat } from '../helpers/rut-helpers';

/**
 * @deprecated Use RutValueAccessor with formControl or ngModel instead.
 * This directive will be removed in v3.0.0.
 *
 * Migration guide:
 * - Remove [formatRutLegacy] from your template
 * - Ensure you're using formControlName or ngModel with the input
 * - The RutValueAccessor directive (selector: input[formatRut]) will be automatically applied
 *
 * @example
 * // Old (deprecated):
 * <input [(ngModel)]="rut" formatRutLegacy />
 *
 * // New (recommended):
 * <input formControlName="rut" formatRut />
 */
@Directive({
  selector: '[formatRutLegacy]'
})
export class RutDirective {
  constructor() {
    console.warn(
      '[ngx-rut-v2] DEPRECATION WARNING: The [formatRutLegacy] directive is deprecated and will be removed in v3.0.0. ' +
      'Please use RutValueAccessor with formControl/ngModel instead. ' +
      'See documentation: https://github.com/danieldiazastudillo/ngx-rut-v2#migration-guide'
    );
  }

  @HostListener('focus', ['$event'])
  onFocus(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = rutClean(input.value);
  }

  @HostListener('blur', ['$event'])
  onBlur(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = rutFormat(input.value) || '';
  }
}
