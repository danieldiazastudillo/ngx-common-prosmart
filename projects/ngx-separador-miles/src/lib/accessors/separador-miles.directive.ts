import { Directive, ElementRef, HostListener, effect, forwardRef, input, signal, untracked } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { separadorClean, separadorFormat, separadorParse } from '../helpers/separador-helpers';

@Directive({
  selector: 'input[libSeparadorMiles]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SeparadorMilesAccessor),
      multi: true
    }
  ]
})
export class SeparadorMilesAccessor implements ControlValueAccessor {
  /**
   * Signal-based configuration for the directive. Set this from the parent/component:
   * <input [formControl]="..." [libSeparadorMiles.config]="{ thousandSeparator: '.', ... }">
   */
  config = input<{
    thousandSeparator?: string;
    decimalSeparator?: string;
    allowDecimals?: boolean;
    currency?: string;
  }>({});

  private readonly storedValue = signal<any>(null);

  private onChange = (_: any) => {};
  private onTouched = () => {};
  private disabled = false;

  private get thousandSeparator() {
    return this.config().thousandSeparator ?? '.';
  }
  private get decimalSeparator() {
    return this.config().decimalSeparator ?? ',';
  }
  private get allowDecimals() {
    return this.config().allowDecimals ?? false;
  }

  constructor(private readonly el: ElementRef<HTMLInputElement>) {
    // Re-format the display when config changes (e.g. directive receives new separators).
    // Reads storedValue() via untracked so the effect only tracks config(), not value changes.
    effect(() => {
      const config = this.config();
      const stored = untracked(() => this.storedValue());
      const inputEl = this.el.nativeElement;
      if (document.activeElement === inputEl) return;
      const formatted = separadorFormat(stored, config);
      if (inputEl.value !== formatted) inputEl.value = formatted;
    });
  }

  writeValue(value: any): void {
    this.storedValue.set(value);
    const input = this.el.nativeElement;
    const formatted = separadorFormat(value, this.config());
    // Always update value for initial display
    if (input.value !== formatted) {
      const prevLength = input.value.length;
      const prevPos = input.selectionStart ?? 0;
      input.value = formatted;
      // Only restore cursor if input is focused
      if (document.activeElement === input) {
        const nextLength = formatted.length;
        const diff = nextLength - prevLength;
        const newPos = Math.max(0, prevPos + diff);
        input.setSelectionRange(newPos, newPos);
      }
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.el.nativeElement.disabled = isDisabled;
  }

  parseValue(value: string): number | null {
    return separadorParse(value, this.config());
  }

  formatValue(value: any): string {
    return separadorFormat(value, this.config());
  }

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const input = this.el.nativeElement;
    const decSep = this.decimalSeparator;

    // Use separadorClean helper for sanitization
    const sanitized = separadorClean(value, this.config());

    // Parse using helper function
    const raw = separadorParse(sanitized, this.config());
    this.onChange(raw);
    // Format for display, preserving partial decimals (e.g., '123,')
    let formatted = sanitized;
    if (sanitized !== '') {
      const [intPart, decPart] = sanitized.split(decSep);
      const thousandSep = this.config().thousandSeparator ?? '.';
      let intFormatted = intPart.replaceAll(/\B(?=(\d{3})+(?!\d))/g, thousandSep);
      formatted = decPart === undefined ? intFormatted : intFormatted + decSep + decPart;
    }
    if (input.value !== formatted) {
      const prevPos = input.selectionStart ?? formatted.length;
      const prevLength = input.value.length;
      input.value = formatted;
      const nextLength = formatted.length;
      const diff = nextLength - prevLength;
      let newPos = prevPos + diff;
      if (decSep && formatted.includes(decSep) && newPos > formatted.indexOf(decSep)) {
        newPos = formatted.length;
      }
      input.setSelectionRange(newPos, newPos);
    }
  }

  @HostListener('blur')
  onBlur() {
    // On blur, always format whatever is in the input
    const input = this.el.nativeElement;
    if (input.value === '') {
      this.onChange(null);
    } else {
      // Always format for display, even for partial decimals
      const decSep = this.decimalSeparator;
      const thousandSep = this.config().thousandSeparator ?? '.';
      const [intPart, decPart] = input.value.split(decSep);
      let intFormatted = intPart.replaceAll(/\B(?=(\d{3})+(?!\d))/g, thousandSep);
      input.value = decPart === undefined ? intFormatted : intFormatted + decSep + decPart;
    }
    this.onTouched();
  }
}
