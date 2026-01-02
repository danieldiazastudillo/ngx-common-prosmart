import { Pipe, PipeTransform } from '@angular/core';
import { rutFormat } from '../helpers/rut-helpers';

@Pipe({
  name: 'rut',
  standalone: true
})
export class RutPipe implements PipeTransform {
  public transform(value: string): string {
    return rutFormat(value);
  }
}
