
import { Directive, forwardRef, ElementRef, Renderer2, HostListener } from '@angular/core';
import { rutFormat, rutClean } from '../helpers/rut-helpers';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const RUT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RutValueAccessor),
  multi: true,
};

@Directive({
  selector: 'input[formatRut]',
  providers: [RUT_VALUE_ACCESSOR],
})
export class RutValueAccessor implements ControlValueAccessor {
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(
    private readonly renderer: Renderer2,
    private readonly elementRef: ElementRef,
  ) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const cursorPosition = input.selectionStart || 0;
    const previousValue = input.value;

    // Get the raw value and clean it (only numbers and K)
    const rawValue = input.value.toUpperCase();
    const cleaned = rutClean(rawValue);

    // Format the cleaned value for display
    const formatted = rutFormat(cleaned);

    // Update the input display with formatted value
    this.renderer.setProperty(this.elementRef.nativeElement, 'value', formatted);

    // Send the cleaned (unformatted) value to the form control
    this.onChange(cleaned);

    // Adjust cursor position after formatting
    const lengthDiff = formatted.length - previousValue.length;
    const newPosition = cursorPosition + lengthDiff;

    // Restore cursor position
    setTimeout(() => {
      input.setSelectionRange(newPosition, newPosition);
    }, 0);
  }

  @HostListener('blur')
  onBlur() {
    this.onTouched();
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const key = event.key;

    // Allow: backspace, delete, tab, escape, enter, arrows, home, end
    if (['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(key)) {
      return;
    }

    // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if (event.ctrlKey || event.metaKey) {
      return;
    }

    // Allow only numbers and K/k
    if (!/^[0-9kK]$/.test(key)) {
      event.preventDefault();
    }
  }

  writeValue(value: any): void {
    const formatted = rutFormat(value) || '';
    this.renderer.setProperty(this.elementRef.nativeElement, 'value', formatted);
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
  }
}
