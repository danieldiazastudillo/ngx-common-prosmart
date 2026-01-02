import { Directive, HostListener } from '@angular/core';
import { rutClean, rutFormat } from '../helpers/rut-helpers';

@Directive({
  selector: '[formatRut]',
  standalone: true
})
export class RutDirective {
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
