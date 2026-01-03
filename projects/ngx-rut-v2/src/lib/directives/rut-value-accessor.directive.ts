
import { Directive, ElementRef, Renderer2, HostListener, inject } from '@angular/core';
import { rutFormat, rutClean } from '../helpers/rut-helpers';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: 'input[formatRut]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: RutValueAccessor,
      multi: true,
    },
  ],
})
export class RutValueAccessor implements ControlValueAccessor {
  private readonly renderer = inject(Renderer2);
  private readonly elementRef = inject(ElementRef);

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

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
    const input = this.elementRef.nativeElement;
    const formatted = rutFormat(value) || '';

    // Only update if value actually changed to prevent unnecessary DOM updates
    if (input.value !== formatted) {
      const prevPos = input.selectionStart ?? 0;
      const prevLength = input.value.length;

      this.renderer.setProperty(input, 'value', formatted);

      // Only manage cursor if user is actively focused (reactive approach)
      if (document.activeElement === input) {
        const nextLength = formatted.length;
        const diff = nextLength - prevLength;
        const newPos = Math.max(0, Math.min(prevPos + diff, formatted.length));

        // setTimeout needed because Renderer2 queues DOM updates
        setTimeout(() => {
          input.setSelectionRange(newPos, newPos);
        }, 0);
      }
    }
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
