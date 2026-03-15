import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SeparadorMilesAccessor } from './separador-miles.directive';
import { vi, describe, it, expect, beforeEach } from 'vitest';

@Component({
    template: `
    <input
      libSeparadorMiles
      [formControl]="control"
      [config]="config"
      type="text">
  `,
    imports: [ReactiveFormsModule, SeparadorMilesAccessor],
    standalone: true
})
class TestComponent {
    control = new FormControl();
    config = {};
}

describe('SeparadorMilesAccessor', () => {
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    let inputElement: HTMLInputElement;
    let directive: SeparadorMilesAccessor;

    function createCustomFixture(config: TestComponent['config'] = {}) {
        const f = TestBed.createComponent(TestComponent);
        const c = f.componentInstance;
        c.config = config;
        f.detectChanges();
        const debugEl = f.debugElement.query(By.directive(SeparadorMilesAccessor));
        return {
            fixture: f,
            component: c,
            directive: debugEl.injector.get(SeparadorMilesAccessor),
            inputElement: debugEl.nativeElement as HTMLInputElement,
            control: c.control
        };
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        const debugElement = fixture.debugElement.query(By.directive(SeparadorMilesAccessor));
        directive = debugElement.injector.get(SeparadorMilesAccessor);
        inputElement = debugElement.nativeElement;
    });

    describe('ControlValueAccessor Implementation', () => {
        it('should implement ControlValueAccessor', () => {
            expect(directive).toBeTruthy();
            expect(typeof directive.writeValue).toBe('function');
            expect(typeof directive.registerOnChange).toBe('function');
            expect(typeof directive.registerOnTouched).toBe('function');
            expect(typeof directive.setDisabledState).toBe('function');
        });

        it('should register onChange callback', () => {
            const mockOnChange = vi.fn();
            directive.registerOnChange(mockOnChange);

            inputElement.value = '1234';
            inputElement.dispatchEvent(new Event('input'));

            expect(mockOnChange).toHaveBeenCalledWith(1234);
        });

        it('should register onTouched callback', () => {
            const mockOnTouched = vi.fn();
            directive.registerOnTouched(mockOnTouched);

            inputElement.dispatchEvent(new Event('blur'));

            expect(mockOnTouched).toHaveBeenCalled();
        });

        it('should set disabled state', () => {
            directive.setDisabledState(true);
            expect(inputElement.disabled).toBe(true);

            directive.setDisabledState(false);
            expect(inputElement.disabled).toBe(false);
        });
    });

    describe('Default Configuration', () => {
        it('should use default thousand separator (.)', () => {
            component.control.setValue(1234567);
            fixture.detectChanges();
            expect(inputElement.value).toBe('1.234.567');
        });

        it('should use default decimal separator (,)', () => {
            const { control, fixture: f, inputElement: el } = createCustomFixture({ allowDecimals: true });
            control.setValue(1234.56);
            f.detectChanges();
            expect(el.value).toBe('1.234,56');
        });

        it('should not allow decimals by default', () => {
            component.control.setValue(1234.56);
            fixture.detectChanges();
            expect(inputElement.value).toBe('1.234');
        });
    });

    describe('Custom Configuration', () => {
        it('should use custom thousand separator', () => {
            const { control, fixture: f, inputElement: el } = createCustomFixture({ thousandSeparator: ',' });
            control.setValue(1234567);
            f.detectChanges();
            expect(el.value).toBe('1,234,567');
        });

        it('should use custom decimal separator', () => {
            const { control, fixture: f, inputElement: el } = createCustomFixture({ decimalSeparator: '.', allowDecimals: true });
            control.setValue(1234.56);
            f.detectChanges();
            expect(el.value).toBe('1.234.56');
        });

        it('should allow decimals when configured', () => {
            const { control, fixture: f, inputElement: el } = createCustomFixture({ allowDecimals: true });
            control.setValue(1234.56);
            f.detectChanges();
            expect(el.value).toBe('1.234,56');
        });
    });

    describe('Input Handling', () => {
        it('should format input with thousand separators', () => {
            inputElement.value = '1234567';
            inputElement.dispatchEvent(new Event('input'));

            expect(inputElement.value).toBe('1.234.567');
        });

        it('should handle decimal input when allowed', () => {
            component.config = { allowDecimals: true };
            fixture.detectChanges();

            inputElement.value = '1234567,89';
            inputElement.dispatchEvent(new Event('input'));

            expect(inputElement.value).toBe('1.234.567,89');
        });

        it('should sanitize non-numeric characters', () => {
            inputElement.value = 'abc123def456';
            inputElement.dispatchEvent(new Event('input'));

            expect(inputElement.value).toBe('123.456');
        });

        it('should handle multiple decimal separators', () => {
            const { inputElement: el } = createCustomFixture({ allowDecimals: true });
            el.value = '123,45,67';
            el.dispatchEvent(new Event('input'));
            // separadorClean keeps all digits, only removes duplicate separators
            expect(el.value).toBe('123,4567');
        });

        it('should handle empty input', () => {
            inputElement.value = '';
            inputElement.dispatchEvent(new Event('input'));

            expect(inputElement.value).toBe('');
        });

        it('should handle partial decimal input', () => {
            component.config = { allowDecimals: true };
            fixture.detectChanges();

            inputElement.value = '123,';
            inputElement.dispatchEvent(new Event('input'));

            expect(inputElement.value).toBe('123,');
        });
    });

    describe('Blur Event Handling', () => {
        it('should format value on blur', () => {
            inputElement.value = '1234567';
            inputElement.dispatchEvent(new Event('blur'));

            expect(inputElement.value).toBe('1.234.567');
        });

        it('should handle empty value on blur', () => {
            const mockOnChange = vi.fn();
            directive.registerOnChange(mockOnChange);

            inputElement.value = '';
            inputElement.dispatchEvent(new Event('blur'));

            expect(mockOnChange).toHaveBeenCalledWith(null);
        });

        it('should format partial decimal on blur', () => {
            component.config = { allowDecimals: true };
            fixture.detectChanges();

            inputElement.value = '123,45';
            inputElement.dispatchEvent(new Event('blur'));

            expect(inputElement.value).toBe('123,45');
        });
    });

    describe('writeValue Method', () => {
        it('should format null value', () => {
            directive.writeValue(null);
            expect(inputElement.value).toBe('');
        });

        it('should format undefined value', () => {
            directive.writeValue(undefined);
            expect(inputElement.value).toBe('');
        });

        it('should format empty string', () => {
            directive.writeValue('');
            expect(inputElement.value).toBe('');
        });

        it('should format number value', () => {
            directive.writeValue(1234567);
            expect(inputElement.value).toBe('1.234.567');
        });

        it('should format string number', () => {
            directive.writeValue('1234567');
            expect(inputElement.value).toBe('1.234.567');
        });

        it('should format negative number', () => {
            directive.writeValue(-1234567);
            expect(inputElement.value).toBe('-1.234.567');
        });

        it('should format decimal when allowed', () => {
            const { directive: d, inputElement: el } = createCustomFixture({ allowDecimals: true });
            d.writeValue(1234.56);
            expect(el.value).toBe('1.234,56');
        });

        it('should not format decimal when not allowed', () => {
            directive.writeValue(1234.56);
            expect(inputElement.value).toBe('1.234');
        });

        it('should handle cursor position when focused', () => {
            inputElement.focus();
            inputElement.value = '123';
            inputElement.setSelectionRange(1, 1);

            directive.writeValue(1234567);

            expect(inputElement.value).toBe('1.234.567');
            // Cursor position should be adjusted
            expect(inputElement.selectionStart).toBeGreaterThan(0);
        });
    });

    describe('parseValue Method', () => {
        it('should parse valid number', () => {
            expect(directive.parseValue('1.234,56')).toBe(1234.56);
        });

        it('should parse number without separators', () => {
            expect(directive.parseValue('123456')).toBe(123456);
        });

        it('should return null for empty string', () => {
            expect(directive.parseValue('')).toBeNull();
        });

        it('should return null for invalid number', () => {
            expect(directive.parseValue('abc')).toBeNull();
        });

        it('should handle custom decimal separator', () => {
            const { directive: d } = createCustomFixture({ decimalSeparator: '.' });
            const result = d.parseValue('1,234.56');
            expect(result).toBe(1234.56);
        });
    });

    describe('formatValue Method', () => {
        it('should format number with thousand separators', () => {
            expect(directive.formatValue(1234567)).toBe('1.234.567');
        });

        it('should format negative number', () => {
            expect(directive.formatValue(-1234567)).toBe('-1.234.567');
        });

        it('should format decimal when allowed', () => {
            const { directive: d } = createCustomFixture({ allowDecimals: true });
            expect(d.formatValue(1234.56)).toBe('1.234,56');
        });

        it('should not format decimal when not allowed', () => {
            expect(directive.formatValue(1234.56)).toBe('1.234');
        });

        it('should handle null value', () => {
            expect(directive.formatValue(null)).toBe('');
        });

        it('should handle undefined value', () => {
            expect(directive.formatValue(undefined)).toBe('');
        });

        it('should handle empty string', () => {
            expect(directive.formatValue('')).toBe('');
        });

        it('should handle string with special characters', () => {
            // separadorFormat strips non-numeric chars; '$1,234.56' → int='1', dec='234' with default config → '1'
            expect(directive.formatValue('$1,234.56')).toBe('1');
        });
    });

    describe('Edge Cases', () => {
        it('should handle very large numbers', () => {
            directive.writeValue(999999999999);
            expect(inputElement.value).toBe('999.999.999.999');
        });

        it('should handle zero', () => {
            directive.writeValue(0);
            expect(inputElement.value).toBe('0');
        });

        it('should handle single digit', () => {
            directive.writeValue(5);
            expect(inputElement.value).toBe('5');
        });

        it('should handle two digits', () => {
            directive.writeValue(12);
            expect(inputElement.value).toBe('12');
        });

        it('should handle three digits', () => {
            directive.writeValue(123);
            expect(inputElement.value).toBe('123');
        });

        it('should handle four digits', () => {
            directive.writeValue(1234);
            expect(inputElement.value).toBe('1.234');
        });

        it('should handle multiple decimal separators in input', () => {
            component.config = { allowDecimals: true };
            fixture.detectChanges();

            inputElement.value = '123,,456';
            inputElement.dispatchEvent(new Event('input'));

            expect(inputElement.value).toBe('123,456');
        });

        it('should handle decimal separator at end', () => {
            component.config = { allowDecimals: true };
            fixture.detectChanges();

            inputElement.value = '123,';
            inputElement.dispatchEvent(new Event('input'));

            expect(inputElement.value).toBe('123,');
        });
    });

    describe('Configuration Changes', () => {
        it('should update formatting when config changes', () => {
            component.control.setValue(1234567);
            fixture.detectChanges();
            expect(inputElement.value).toBe('1.234.567');

            component.config = { thousandSeparator: ',' };
            fixture.detectChanges();
            TestBed.flushEffects(); // flush the reactive effect that re-formats on config change
            expect(inputElement.value).toBe('1,234,567');
        });

        it('should update decimal handling when allowDecimals changes', () => {
            component.control.setValue(1234.56);
            fixture.detectChanges();
            expect(inputElement.value).toBe('1.234');

            component.config = { allowDecimals: true };
            fixture.detectChanges();
            TestBed.flushEffects(); // flush the reactive effect that re-formats on config change
            expect(inputElement.value).toBe('1.234,56');
        });
    });
});
