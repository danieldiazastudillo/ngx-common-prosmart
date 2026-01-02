import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SeparadorMilesAccessor } from './separador-miles.directive';
import { vi } from 'vitest';

@Component({
    template: `
    <input
      [formControl]="control"
      [libSeparadorMiles.config]="config"
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
            component.config = { allowDecimals: true };
            fixture.detectChanges();

            component.control.setValue(1234.56);
            fixture.detectChanges();
            expect(inputElement.value).toBe('1.234,56');
        });

        it('should not allow decimals by default', () => {
            component.control.setValue(1234.56);
            fixture.detectChanges();
            expect(inputElement.value).toBe('1.234');
        });
    });

    describe('Custom Configuration', () => {
        it('should use custom thousand separator', () => {
            component.config = { thousandSeparator: ',' };
            fixture.detectChanges();

            component.control.setValue(1234567);
            fixture.detectChanges();
            expect(inputElement.value).toBe('1,234,567');
        });

        it('should use custom decimal separator', () => {
            component.config = { decimalSeparator: '.', allowDecimals: true };
            fixture.detectChanges();

            component.control.setValue(1234.56);
            fixture.detectChanges();
            expect(inputElement.value).toBe('1.234.56');
        });

        it('should allow decimals when configured', () => {
            component.config = { allowDecimals: true };
            fixture.detectChanges();

            component.control.setValue(1234.56);
            fixture.detectChanges();
            expect(inputElement.value).toBe('1.234,56');
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
            component.config = { allowDecimals: true };
            fixture.detectChanges();

            inputElement.value = '123,45,67';
            inputElement.dispatchEvent(new Event('input'));

            expect(inputElement.value).toBe('123,45');
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
            component.config = { allowDecimals: true };
            fixture.detectChanges();

            directive.writeValue(1234.56);
            expect(inputElement.value).toBe('1.234,56');
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
            const result = (directive as any).parseValue('1.234,56');
            expect(result).toBe(1234.56);
        });

        it('should parse number without separators', () => {
            const result = (directive as any).parseValue('123456');
            expect(result).toBe(123456);
        });

        it('should return null for empty string', () => {
            const result = (directive as any).parseValue('');
            expect(result).toBeNull();
        });

        it('should return null for invalid number', () => {
            const result = (directive as any).parseValue('abc');
            expect(result).toBeNull();
        });

        it('should handle custom decimal separator', () => {
            component.config = { decimalSeparator: '.' };
            fixture.detectChanges();

            const result = (directive as any).parseValue('1,234.56');
            expect(result).toBe(1234.56);
        });
    });

    describe('formatValue Method', () => {
        it('should format number with thousand separators', () => {
            const result = (directive as any).formatValue(1234567);
            expect(result).toBe('1.234.567');
        });

        it('should format negative number', () => {
            const result = (directive as any).formatValue(-1234567);
            expect(result).toBe('-1.234.567');
        });

        it('should format decimal when allowed', () => {
            component.config = { allowDecimals: true };
            fixture.detectChanges();

            const result = (directive as any).formatValue(1234.56);
            expect(result).toBe('1.234,56');
        });

        it('should not format decimal when not allowed', () => {
            const result = (directive as any).formatValue(1234.56);
            expect(result).toBe('1.234');
        });

        it('should handle null value', () => {
            const result = (directive as any).formatValue(null);
            expect(result).toBe('');
        });

        it('should handle undefined value', () => {
            const result = (directive as any).formatValue(undefined);
            expect(result).toBe('');
        });

        it('should handle empty string', () => {
            const result = (directive as any).formatValue('');
            expect(result).toBe('');
        });

        it('should handle string with special characters', () => {
            const result = (directive as any).formatValue('$1,234.56');
            expect(result).toBe('1.234,56');
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
            expect(inputElement.value).toBe('1,234,567');
        });

        it('should update decimal handling when allowDecimals changes', () => {
            component.control.setValue(1234.56);
            fixture.detectChanges();
            expect(inputElement.value).toBe('1.234');

            component.config = { allowDecimals: true };
            fixture.detectChanges();
            expect(inputElement.value).toBe('1.234,56');
        });
    });
});
