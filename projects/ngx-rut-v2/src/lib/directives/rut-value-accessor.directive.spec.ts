import { RutValueAccessor } from './rut-value-accessor.directive';
import { ElementRef, Renderer2 } from '@angular/core';

describe('RutValueAccessor', () => {
  it('should create an instance', () => {
    const renderer = {} as Renderer2;
    const elementRef = {} as ElementRef;
    const directive = new RutValueAccessor(renderer, elementRef);
    expect(directive).toBeTruthy();
  });
});
