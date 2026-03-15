import { Directive, ElementRef, HostListener, effect, inject, input, model, untracked } from '@angular/core';
import { FormValueControl, ValidationError, WithOptionalFieldTree } from '@angular/forms/signals';
import { separadorClean, separadorFormat, separadorParse } from '../helpers/separador-helpers';

/**
 * Signal Forms directive for number formatting with thousand and decimal separators.
 *
 * @experimental This directive uses Angular 21's experimental Signal Forms API.
 * The API may change in future Angular versions until it becomes stable.
 * Requires Angular 21.0.0 or higher.
 *
 * @example
 * ```typescript
 * import { Component, signal } from '@angular/core';
 * import { FormField, form, validate, required } from '@angular/forms/signals';
 * import { SeparadorSignalDirective } from 'ngx-separador-miles';
 *
 * @Component({
 *   selector: 'app-price-form',
 *   standalone: true,
 *   imports: [FormField, SeparadorSignalDirective],
 *   template: `
 *     <form>
 *       <label for="amount">Monto en CLP$:</label>
 *       <input
 *         separadorSignal
 *         [formField]="priceForm.amount"
 *         id="amount"
 *       />
 *       @if (priceForm.amount().touched() && priceForm.amount().invalid()) {
 *         @for (error of priceForm.amount().errors(); track error.kind) {
 *           <span class="error">{{ error.message }}</span>
 *         }
 *       }
 *     </form>
 *   `
 * })
 * export class PriceFormComponent {
 *   priceModel = signal({ amount: null as number | null });
 *
 *   priceForm = form(this.priceModel, (f) => {
 *     required(f.amount);
 *     validate(f.amount, ({ value }) => {
 *       const amount = value();
 *       if (amount === null || amount === undefined) return undefined;
 *       return amount > 0
 *         ? undefined
 *         : { kind: 'minValue' as const, message: 'El monto debe ser mayor a 0' };
 *     });
 *   });
 * }
 * ```
 *
 * @usageNotes
 * ### Dual Value System
 * - **Display value**: Formatted number (e.g., `1.350.689,5`) shown in the input
 * - **Form value**: Clean numeric value (e.g., `1350689.5`) stored in the form model
 *
 * ### Features
 * - ✅ Real-time formatting as user types
 * - ✅ Cursor position preservation during formatting
 * - ✅ Character restriction (only numbers and configured decimal separator)
 * - ✅ Configurable thousand and decimal separators
 * - ✅ Optional decimal support (default: false for CLP$ format)
 * - ✅ Signal-based reactivity (no callbacks needed)
 * - ✅ Automatic form state synchronization
 *
 * ### Configuration
 * - `thousandSeparator`: Character for thousands (default: '.' Chilean format)
 * - `decimalSeparator`: Character for decimals (default: ',' Chilean format)
 * - `allowDecimals`: Enable decimal input (default: false, set true for UF values)
 */
@Directive({
  selector: 'input[separadorSignal]',
  standalone: true
})
export class SeparadorSignalDirective implements FormValueControl<number | null> {
  private readonly elementRef = inject(ElementRef);

  constructor() {
    // Sync the display value when the model is updated programmatically
    // (e.g. via model.set(), form reset, or patchValue). Skip the update
    // while the input is focused to not interfere with active user typing.
    // Config signals are read via untracked() so the effect only re-runs when
    // value() changes, not on every config update (avoids NG0100 in tests).
    effect(() => {
      const numericValue = this.value();
      const input = this.elementRef.nativeElement as HTMLInputElement;
      if (document.activeElement !== input) {
        const config = untracked(() => ({
          thousandSeparator: this.thousandSeparator(),
          decimalSeparator: this.decimalSeparator(),
          allowDecimals: this.allowDecimals()
        }));
        input.value = numericValue !== null && numericValue !== undefined
          ? separadorFormat(numericValue, config)
          : '';
      }
    });
  }

  /**
   * Required: The numeric value for the form model.
   * This is a two-way binding signal that automatically syncs with the form.
   */
  readonly value = model<number | null>(null);

  /**
   * Optional: Disabled state of the input.
   * Automatically bound by the Field directive.
   */
  readonly disabled = input(false);

  /**
   * Optional: Touched state of the input.
   * Set to true when the input loses focus.
   */
  readonly touched = model(false);

  /**
   * Optional: Validation errors from the form.
   * Automatically bound by the Field directive.
   */
  readonly errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);

  /**
   * Optional: Invalid state from the form.
   * Automatically bound by the Field directive.
   */
  readonly invalid = input(false);

  /**
   * Optional: Valid state from the form.
   * Automatically bound by the Field directive.
   */
  readonly valid = input(false);

  /**
   * Optional: Required state from the form.
   * Automatically bound by the Field directive.
   */
  readonly required = input(false);

  /**
   * Optional: Name attribute for the input.
   * Automatically bound by the Field directive.
   */
  readonly name = input('');

  /**
   * Character used to separate thousands.
   * Default: '.' (Chilean CLP$ standard: 1.350.689)
   */
  readonly thousandSeparator = input<string>('.');

  /**
   * Character used as decimal separator.
   * Default: ',' (Chilean standard: 1.350.689,5 for UF values)
   */
  readonly decimalSeparator = input<string>(',');

  /**
   * Whether to allow decimal values.
   * Default: false (CLP$ doesn't use decimals, set true for UF values)
   */
  readonly allowDecimals = input<boolean>(false);

  /**
   * Handles input events to format the number and update the model value.
   * Preserves cursor position during formatting.
   */
  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cursorPosition = input.selectionStart || 0;
    const previousValue = input.value;

    // Get the configuration
    const config = {
      thousandSeparator: this.thousandSeparator(),
      decimalSeparator: this.decimalSeparator(),
      allowDecimals: this.allowDecimals()
    };

    // Clean the input (remove invalid characters, allow only one decimal separator)
    // When decimals are not allowed, also strip any decimal separator that may
    // have been pasted or set programmatically (keydown blocks it for typed input).
    let cleaned = separadorClean(input.value, config);
    if (!config.allowDecimals) {
      cleaned = cleaned.replaceAll(config.decimalSeparator, '');
    }

    // Parse the cleaned value to a number
    const numericValue = separadorParse(cleaned, config);

    // Update the model value with the numeric value
    this.value.set(numericValue);

    // Format the cleaned value for display (preserves partial decimals like "123,")
    let formatted = cleaned;
    if (cleaned !== '') {
      const decSep = config.decimalSeparator;
      const [intPart, decPart] = cleaned.split(decSep);
      let intFormatted = intPart.replaceAll(/\B(?=(\d{3})+(?!\d))/g, config.thousandSeparator);
      formatted = decPart === undefined ? intFormatted : intFormatted + decSep + decPart;
    }

    // Update the input display with formatted value
    input.value = formatted;

    // Adjust cursor position after formatting
    const lengthDiff = formatted.length - previousValue.length;
    const newPosition = cursorPosition + lengthDiff;

    // Restore cursor position
    setTimeout(() => {
      input.setSelectionRange(newPosition, newPosition);
    }, 0);
  }

  /**
   * Handles blur events to mark the input as touched and finalize formatting.
   */
  @HostListener('blur')
  onBlur(): void {
    this.touched.set(true);

    // Finalize formatting on blur
    const input = this.elementRef.nativeElement as HTMLInputElement;
    if (input.value === '') {
      this.value.set(null);
    } else {
      const config = {
        thousandSeparator: this.thousandSeparator(),
        decimalSeparator: this.decimalSeparator(),
        allowDecimals: this.allowDecimals()
      };
      const decSep = config.decimalSeparator;
      const [intPart, decPart] = input.value.split(decSep);
      let intFormatted = intPart.replaceAll(/\B(?=(\d{3})+(?!\d))/g, config.thousandSeparator);
      input.value = decPart === undefined ? intFormatted : intFormatted + decSep + decPart;
    }
  }

  /**
   * Restricts keyboard input to only numbers and the configured decimal separator.
   * Allows navigation keys and common shortcuts (Ctrl+A, Ctrl+C, etc.).
   */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const key = event.key;

    // Allow: backspace, delete, tab, escape, enter, arrows, home, end
    if (['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(key)) {
      return;
    }

    // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Cmd+A, Cmd+C, Cmd+V, Cmd+X
    if (event.ctrlKey || event.metaKey) {
      return;
    }

    // Build allowed pattern: digits and optionally the decimal separator
    const decSep = this.decimalSeparator();
    const allowedPattern = this.allowDecimals()
      ? new RegExp(`^[0-9${decSep.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]$`)
      : /^[0-9]$/;

    // Allow only numbers and decimal separator (if enabled)
    if (!allowedPattern.test(key)) {
      event.preventDefault();
    }
  }
}
