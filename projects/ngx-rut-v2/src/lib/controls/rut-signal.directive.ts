import { Directive, ElementRef, HostListener, Renderer2, inject, input, model, effect } from '@angular/core';
import { FormValueControl, ValidationError, WithOptionalFieldTree } from '@angular/forms/signals';
import { rutClean, rutFormat, isAllowedRutKey } from '../helpers/rut-helpers';

/**
 * Signal Forms directive for RUT formatting and validation.
 *
 * @experimental This directive uses Angular 21's experimental Signal Forms API.
 * The API may change in future Angular versions until it becomes stable.
 * Requires Angular 21.0.0 or higher.
 *
 * @example
 * ```typescript
 * import { Component, signal } from '@angular/core';
 * import { FormField, form, validate, required } from '@angular/forms/signals';
 * import { RutSignalDirective, rutValidate } from 'ngx-rut-v2';
 *
 * @Component({
 *   selector: 'app-user-form',
 *   standalone: true,
 *   imports: [FormField, RutSignalDirective],
 *   template: `
 *     <form>
 *       <input rutSignal [formField]="userForm.rut" />
 *       @if (userForm.rut().touched() && userForm.rut().invalid()) {
 *         @for (error of userForm.rut().errors(); track error.kind) {
 *           <span class="error">{{ error.message }}</span>
 *         }
 *       }
 *     </form>
 *   `
 * })
 * export class UserFormComponent {
 *   userModel = signal({ rut: '' });
 *
 *   userForm = form(this.userModel, (f) => {
 *     required(f.rut);
 *     validate(f.rut, ({ value }) => {
 *       const rutValue = value();
 *       if (!rutValue) return undefined;
 *       return rutValidate(rutValue)
 *         ? undefined
 *         : { kind: 'invalidRut', message: 'El RUT es inválido' };
 *     });
 *   });
 * }
 * ```
 *
 * @usageNotes
 * ### Dual Value System
 * - **Display value**: Formatted RUT (e.g., `12.345.678-K`) shown in the input
 * - **Form value**: Clean RUT (e.g., `12345678K`) stored in the form model
 *
 * ### Features
 * - ✅ Real-time formatting as user types
 * - ✅ Cursor position preservation during formatting
 * - ✅ Character restriction (only numbers and letter 'K')
 * - ✅ Automatic uppercase conversion for 'k' → 'K'
 * - ✅ Signal-based reactivity (no callbacks needed)
 * - ✅ Automatic form state synchronization
 */
@Directive({
  selector: 'input[rutSignal]',
  standalone: true
})
export class RutSignalDirective implements FormValueControl<string> {
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  constructor() {
    // Sync the display value when the model is updated programmatically
    // (e.g. via patchValue, model.set(), or form reset). Skip the update
    // while the input is focused to not interfere with active user typing.
    effect(() => {
      const clean = this.value();
      const input = this.elementRef.nativeElement as HTMLInputElement;
      if (document.activeElement !== input) {
        input.value = clean ? rutFormat(clean) : '';
      }
    });

    // Propagate disabled state from the FormField directive to the native input.
    effect(() => {
      this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', this.disabled());
    });

    // Propagate readonly state from the FormField directive to the native input.
    effect(() => {
      this.renderer.setProperty(this.elementRef.nativeElement, 'readOnly', this.readonly());
    });

    // Propagate name attribute from the FormField directive to the native input.
    effect(() => {
      const name = this.name();
      if (name) {
        this.renderer.setAttribute(this.elementRef.nativeElement, 'name', name);
      }
    });
  }

  /**
   * Required: The clean RUT value (without formatting) for the form model.
   * This is a two-way binding signal that automatically syncs with the form.
   */
  readonly value = model<string>('');

  /**
   * Optional: Disabled state of the input.
   * Automatically bound by the FormField directive.
   */
  readonly disabled = input(false);

  /**
   * Optional: Readonly state of the input.
   * Automatically bound by the FormField directive.
   */
  readonly readonly = input(false);

  /**
   * Optional: Touched state of the input.
   * Set to true when the input loses focus.
   */
  readonly touched = model(false);

  /**
   * Optional: Validation errors from the form.
   * Automatically bound by the FormField directive.
   */
  readonly errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);

  /**
   * Optional: Invalid state from the form.
   * Automatically bound by the FormField directive.
   */
  readonly invalid = input(false);

  /**
   * Optional: Valid state from the form.
   * Automatically bound by the FormField directive.
   */
  readonly valid = input(false);

  /**
   * Optional: Required state from the form.
   * Automatically bound by the FormField directive.
   */
  readonly required = input(false);

  /**
   * Optional: Name attribute for the input.
   * Automatically bound by the FormField directive.
   */
  readonly name = input('');

  /**
   * Handles input events to format RUT and update the model value.
   * Preserves cursor position during formatting.
   */
  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cursorPosition = input.selectionStart || 0;
    const previousValue = input.value;

    // Clean the raw value (rutClean handles uppercase conversion internally)
    const cleaned = rutClean(input.value);

    // Update the model value with cleaned RUT
    this.value.set(cleaned);

    // Format the cleaned value for display
    const formatted = rutFormat(cleaned);

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
   * Handles blur events to mark the input as touched.
   */
  @HostListener('blur')
  onBlur(): void {
    this.touched.set(true);
  }

  /**
   * Restricts keyboard input to only numbers and the letter 'K'.
   * Allows navigation keys and common shortcuts (Ctrl+A, Ctrl+C, etc.).
   */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!isAllowedRutKey(event)) {
      event.preventDefault();
    }
  }
}
