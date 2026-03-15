import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { SeparadorSignalDirective } from './separador-signal.directive';
import { vi, describe, it, expect, beforeEach } from 'vitest';

@Component({
  template: `
    <input
      separadorSignal
      [thousandSeparator]="thousandSeparator"
      [decimalSeparator]="decimalSeparator"
      [allowDecimals]="allowDecimals"
    />
  `,
  imports: [SeparadorSignalDirective],
  standalone: true
})
class TestHostComponent {
  thousandSeparator = '.';
  decimalSeparator = ',';
  allowDecimals = false;
}

describe('SeparadorSignalDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let inputElement: HTMLInputElement;
  let directive: SeparadorSignalDirective;

  function createCustomFixture(overrides: { thousandSeparator?: string; decimalSeparator?: string; allowDecimals?: boolean } = {}) {
    const f = TestBed.createComponent(TestHostComponent);
    const c = f.componentInstance;
    if (overrides.thousandSeparator !== undefined) c.thousandSeparator = overrides.thousandSeparator;
    if (overrides.decimalSeparator !== undefined) c.decimalSeparator = overrides.decimalSeparator;
    if (overrides.allowDecimals !== undefined) c.allowDecimals = overrides.allowDecimals;
    f.detectChanges();
    const debugEl = f.debugElement.query(By.directive(SeparadorSignalDirective));
    return {
      fixture: f,
      directive: debugEl.injector.get(SeparadorSignalDirective),
      inputElement: debugEl.nativeElement as HTMLInputElement
    };
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const debugEl = fixture.debugElement.query(By.directive(SeparadorSignalDirective));
    directive = debugEl.injector.get(SeparadorSignalDirective);
    inputElement = debugEl.nativeElement;
  });

  describe('FormValueControl implementation', () => {
    it('should create the directive', () => {
      expect(directive).toBeTruthy();
    });

    it('should have value model signal initialized to null', () => {
      expect(directive.value()).toBeNull();
    });

    it('should have touched model signal initialized to false', () => {
      expect(directive.touched()).toBe(false);
    });

    it('should have Chilean default separators', () => {
      expect(directive.thousandSeparator()).toBe('.');
      expect(directive.decimalSeparator()).toBe(',');
      expect(directive.allowDecimals()).toBe(false);
    });

    it('should have state input signals defaulting to inactive', () => {
      expect(directive.disabled()).toBe(false);
      expect(directive.invalid()).toBe(false);
      expect(directive.required()).toBe(false);
      expect(directive.errors()).toEqual([]);
      expect(directive.name()).toBe('');
    });
  });

  describe('Programmatic value sync (effect)', () => {
    it('should update display when value is set programmatically', () => {
      directive.value.set(1234567);
      fixture.detectChanges();
      expect(inputElement.value).toBe('1.234.567');
    });

    it('should clear display when value is set to null', () => {
      directive.value.set(1234567);
      fixture.detectChanges();
      directive.value.set(null);
      fixture.detectChanges();
      expect(inputElement.value).toBe('');
    });

    it('should format zero correctly', () => {
      directive.value.set(0);
      fixture.detectChanges();
      expect(inputElement.value).toBe('0');
    });

    it('should format large numbers correctly', () => {
      directive.value.set(999999999);
      fixture.detectChanges();
      expect(inputElement.value).toBe('999.999.999');
    });

    it('should use custom separators from inputs when formatting', () => {
      const { directive: d, inputElement: el, fixture: f } = createCustomFixture({ thousandSeparator: ',', decimalSeparator: '.' });
      d.value.set(1234567);
      f.detectChanges();
      expect(el.value).toBe('1,234,567');
    });

    it('should format decimals when allowDecimals is true', () => {
      const { directive: d, inputElement: el, fixture: f } = createCustomFixture({ allowDecimals: true });
      d.value.set(1234.56);
      f.detectChanges();
      expect(el.value).toBe('1.234,56');
    });
  });

  describe('Input event handling', () => {
    it('should format a number with thousand separator', () => {
      inputElement.value = '1234567';
      inputElement.dispatchEvent(new Event('input'));
      expect(inputElement.value).toBe('1.234.567');
    });

    it('should update value model with parsed numeric value', () => {
      inputElement.value = '1234567';
      inputElement.dispatchEvent(new Event('input'));
      expect(directive.value()).toBe(1234567);
    });

    it('should set value to null on empty input', () => {
      inputElement.value = '';
      inputElement.dispatchEvent(new Event('input'));
      expect(directive.value()).toBeNull();
    });

    it('should sanitize non-numeric characters', () => {
      inputElement.value = 'abc123def456';
      inputElement.dispatchEvent(new Event('input'));
      expect(inputElement.value).toBe('123.456');
    });

    it('should handle partial decimal input when allowDecimals is true', () => {
      const { inputElement: el } = createCustomFixture({ allowDecimals: true });
      el.value = '123,';
      el.dispatchEvent(new Event('input'));
      expect(el.value).toBe('123,');
    });

    it('should handle full decimal input when allowDecimals is true', () => {
      const { inputElement: el } = createCustomFixture({ allowDecimals: true });
      el.value = '1234567,89';
      el.dispatchEvent(new Event('input'));
      expect(el.value).toBe('1.234.567,89');
    });

    it('should not allow decimals when allowDecimals is false (default)', () => {
      inputElement.value = '123,45';
      inputElement.dispatchEvent(new Event('input'));
      // Decimal separator stripped since allowDecimals=false
      expect(inputElement.value).toBe('12.345');
    });

    it('should restore cursor position after formatting', () => {
      vi.useFakeTimers();
      inputElement.value = '1234';
      inputElement.setSelectionRange(4, 4);
      inputElement.dispatchEvent(new Event('input'));
      // '1234' → '1.234': length diff +1, cursor was at 4 → 5
      vi.runAllTimers();
      expect(inputElement.selectionStart).toBe(5);
      vi.useRealTimers();
    });

    it('should handle multiple decimal separators (keep only first)', () => {
      const { inputElement: el } = createCustomFixture({ allowDecimals: true });
      el.value = '123,,456';
      el.dispatchEvent(new Event('input'));
      expect(el.value).toBe('123,456');
    });
  });

  describe('Blur event handling', () => {
    it('should mark touched as true on blur', () => {
      expect(directive.touched()).toBe(false);
      inputElement.dispatchEvent(new Event('blur'));
      expect(directive.touched()).toBe(true);
    });

    it('should set value to null when input is empty on blur', () => {
      inputElement.value = '';
      inputElement.dispatchEvent(new Event('blur'));
      expect(directive.value()).toBeNull();
    });

    it('should finalize integer formatting on blur', () => {
      inputElement.value = '1234567';
      inputElement.dispatchEvent(new Event('blur'));
      expect(inputElement.value).toBe('1.234.567');
    });

    it('should finalize decimal formatting on blur', () => {
      const { inputElement: el } = createCustomFixture({ allowDecimals: true });
      el.value = '1234567,89';
      el.dispatchEvent(new Event('blur'));
      expect(el.value).toBe('1.234.567,89');
    });
  });

  describe('Keydown restriction', () => {
    function createKeyEvent(key: string, extra?: Partial<KeyboardEventInit>): KeyboardEvent {
      return new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...extra });
    }

    it('should allow digit keys', () => {
      const event = createKeyEvent('5');
      inputElement.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
    });

    it('should block letter keys', () => {
      const event = createKeyEvent('a');
      inputElement.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
    });

    it('should block space key', () => {
      const event = createKeyEvent(' ');
      inputElement.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
    });

    it('should allow navigation keys', () => {
      const navKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
      for (const key of navKeys) {
        const event = createKeyEvent(key);
        inputElement.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(false);
      }
    });

    it('should allow Ctrl shortcuts', () => {
      const event = createKeyEvent('c', { ctrlKey: true });
      inputElement.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
    });

    it('should allow Meta (Cmd) shortcuts', () => {
      const event = createKeyEvent('v', { metaKey: true });
      inputElement.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
    });

    it('should block decimal separator when allowDecimals is false', () => {
      const event = createKeyEvent(',');
      inputElement.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
    });

    it('should allow decimal separator when allowDecimals is true', () => {
      const { inputElement: el } = createCustomFixture({ allowDecimals: true });
      const event = createKeyEvent(',');
      el.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
    });

    it('should allow custom decimal separator when allowDecimals is true', () => {
      const { inputElement: el } = createCustomFixture({ allowDecimals: true, decimalSeparator: '.', thousandSeparator: ',' });
      const event = createKeyEvent('.');
      el.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
    });
  });

  describe('Configuration via inputs', () => {
    it('should use custom thousand separator for formatting', () => {
      const { inputElement: el } = createCustomFixture({ thousandSeparator: ',' });
      el.value = '1234567';
      el.dispatchEvent(new Event('input'));
      expect(el.value).toBe('1,234,567');
    });

    it('should use custom decimal separator when allowDecimals is true', () => {
      const { inputElement: el } = createCustomFixture({ allowDecimals: true, thousandSeparator: ',', decimalSeparator: '.' });
      el.value = '1234567.89';
      el.dispatchEvent(new Event('input'));
      expect(el.value).toBe('1,234,567.89');
    });
  });
});
