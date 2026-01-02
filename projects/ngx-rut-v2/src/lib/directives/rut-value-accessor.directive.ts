
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
  standalone: true,
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
    const value = (event.target as HTMLInputElement).value;
    this.onChange(rutClean(value));
  }

  @HostListener('blur')
  onBlur() {
    const value = this.elementRef.nativeElement.value;
    const formatted = rutFormat(value);
    this.renderer.setProperty(this.elementRef.nativeElement, 'value', formatted);
    this.onTouched();
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
