import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RutValueAccessor } from './rut-value-accessor.directive';
import { describe, expect, it } from 'vitest';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, RutValueAccessor],
  template: `<input formatRut [formControl]="control" />`,
})
class TestHostComponent {
  control = new FormControl('');
}

describe('RutValueAccessor', () => {
  it('should create an instance', async () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const directive = fixture.debugElement
      .query(By.directive(RutValueAccessor))
      .injector.get(RutValueAccessor);
    expect(directive).toBeTruthy();
  });

  it('should format input and pass clean value to form control', async () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');

    input.value = '12345678k';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.value).toBe('12.345.678-K');
    expect(fixture.componentInstance.control.value).toBe('12345678K');
  });

  it('should prevent non-RUT keys on keydown', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');

    const event = new KeyboardEvent('keydown', { key: 'a', bubbles: true, cancelable: true });
    input.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });

  it('should allow digit keys on keydown', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');

    const event = new KeyboardEvent('keydown', { key: '5', bubbles: true, cancelable: true });
    input.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
  });
});
