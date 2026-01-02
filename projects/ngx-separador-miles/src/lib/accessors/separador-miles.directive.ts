import { Directive, ElementRef, HostListener, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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

  constructor(private readonly el: ElementRef<HTMLInputElement>) {}

  writeValue(value: any): void {
    const input = this.el.nativeElement;
    const formatted = this.formatValue(value);
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
  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const input = this.el.nativeElement;
    const decSep = this.decimalSeparator;
    // Sanitize: allow only digits and a single decimal separator
    let sanitized = value.replaceAll(new RegExp(`[^0-9${decSep}]`, 'g'), '');
    const firstSep = sanitized.indexOf(decSep);
    if (firstSep !== -1) {
      sanitized = sanitized.substring(0, firstSep + 1) + sanitized.substring(firstSep + 1).replaceAll(new RegExp(`[${decSep}]`, 'g'), '');
    }
    // Parse and always format for display, even for partial decimals
    const raw = this.parseValue(sanitized);
    this.onChange(raw);
    let formatted = sanitized;
    if (sanitized !== '') {
      // Format even for partial decimals (e.g., '123,')
      const [intPart, decPart] = sanitized.split(decSep);
      let intFormatted = intPart.replaceAll(/\B(?=(\d{3})+(?!\d))/g, this.thousandSeparator);
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
      const [intPart, decPart] = input.value.split(decSep);
      let intFormatted = intPart.replaceAll(/\B(?=(\d{3})+(?!\d))/g, this.thousandSeparator);
      input.value = decPart === undefined ? intFormatted : intFormatted + decSep + decPart;
    }
    this.onTouched();
  }

  private formatValue(value: any): string {
    if (value === null || value === undefined || value === '') return '';
    let [integer, decimal] = String(value).replaceAll(/[^\d.,-]/g, '').split(/[.,]/);
    let sign = '';
    if (integer.startsWith('-')) {
      sign = '-';
      integer = integer.slice(1);
    }
    integer = integer.replaceAll(/\B(?=(\d{3})+(?!\d))/g, this.thousandSeparator);
    if (this.allowDecimals && decimal !== undefined) {
      return sign + integer + this.decimalSeparator + decimal;
    }
    return sign + integer;
  }
  private parseValue(value: string): number | null {
    if (!value) return null;
    // Remove all non-numeric except decimal
    let val = value.replaceAll(new RegExp(`[^0-9${this.decimalSeparator}]`, 'g'), '');
    val = val.replaceAll(this.decimalSeparator, '.');
    const num = Number.parseFloat(val);
    return Number.isNaN(num) ? null : num;
  }
}
