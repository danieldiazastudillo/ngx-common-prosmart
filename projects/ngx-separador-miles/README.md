# NgxSeparadorMiles

A lightweight Angular directive for formatting numbers with thousands separators in input fields. Tested and recommended for Angular 21.x projects (with backward compatibility to Angular 19.2.0+).

## 🌐 Live Demo

Check out the **[live examples and implementation guide](https://danieldiazastudillo.github.io/ngx-common-prosmart/)** on GitHub Pages.

## Features

- ✅ Automatic thousands separator formatting as you type
- ✅ Configurable decimal and thousands separators
- ✅ Optional decimal support (for CLP$ and UF values)
- ✅ Works seamlessly with Angular Reactive Forms
- ✅ **NEW**: Experimental Signal Forms support (Angular 21+)
- ✅ Signal-based configuration
- ✅ Maintains cursor position during formatting
- ✅ Handles copy/paste operations gracefully
- ✅ Helper functions for custom formatting needs
- ✅ Type-safe implementation
- ✅ Zero dependencies (except Angular peer dependencies)

## Compatibilidad Angular

| Versión ngx-separador-miles | Versión Angular | Estado |
|----------------------------|-----------------|--------|
| 0.0.1 - 0.0.2 | 19.2.0+ | ✅ Soportado |
| 1.0.x | 19.2.0 - 21.x | ✅ Actual (Recomendado) |
| 1.1.x | 22.x | 📅 Planeado |

> **Nota:** La versión 1.0.x mantiene compatibilidad retroactiva con Angular 19.2.0+ pero está probada y optimizada para proyectos Angular 21.x.
>
> **Requisitos mínimos:**
> - Angular: >=19.2.0
> - TypeScript: 5.7+
> - Navegadores modernos (ES2022+)

## Installation

Install the package via npm:

```bash
npm install ngx-separador-miles --save
```

## Usage

### Basic Example

Import the directive in your component:

```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SeparadorMilesAccessor } from 'ngx-separador-miles';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [ReactiveFormsModule, SeparadorMilesAccessor],
  template: `
    <form [formGroup]="form">
      <label for="amount">Amount</label>
      <input 
        id="amount" 
        formControlName="amount" 
        libSeparadorMiles 
        type="text" 
      />
      <p>Value: {{ form.value.amount }}</p>
    </form>
  `
})
export class ExampleComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    amount: [5250000]
  });
}
```

### Advanced Configuration

You can customize the separator behavior using signal-based configuration:

```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SeparadorMilesAccessor } from 'ngx-separador-miles';

@Component({
  selector: 'app-advanced-example',
  standalone: true,
  imports: [ReactiveFormsModule, SeparadorMilesAccessor],
  template: `
    <form [formGroup]="form">
      <label for="price">Price (with decimals)</label>
      <input 
        id="price" 
        formControlName="price" 
        libSeparadorMiles
        [libSeparadorMiles.config]="{
          thousandSeparator: ',',
          decimalSeparator: '.',
          allowDecimals: true
        }"
        type="text" 
      />
      <p>Value: {{ form.value.price }}</p>
    </form>
  `
})
export class AdvancedExampleComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    price: [1234567.89]
  });
}
```

## Configuration Options

The directive accepts a configuration object with the following properties:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `thousandSeparator` | `string` | `'.'` | Character used to separate thousands (e.g., `'.'`, `','`, `' '`) |
| `decimalSeparator` | `string` | `','` | Character used for decimal point (e.g., `','`, `'.'`) |
| `allowDecimals` | `boolean` | `false` | Whether to allow decimal values |
| `currency` | `string` | `undefined` | Currency symbol (reserved for future use) |

### Common Configurations

**European Format (default):**
```typescript
{
  thousandSeparator: '.',
  decimalSeparator: ',',
  allowDecimals: true
}
// Example: 1.234.567,89
```

**US Format:**
```typescript
{
  thousandSeparator: ',',
  decimalSeparator: '.',
  allowDecimals: true
}
// Example: 1,234,567.89
```

**Space Separator:**
```typescript
{
  thousandSeparator: ' ',
  decimalSeparator: ',',
  allowDecimals: true
}
// Example: 1 234 567,89
```

## 🧪 Signal Forms (Experimental - Angular 21+)

⚠️ **EXPERIMENTAL**: This feature uses Angular 21's experimental Signal Forms API (`@angular/forms/signals`). The API may change until it becomes stable. Requires Angular 21.0.0 or higher.

### Why Signal Forms?

Signal Forms provide a modern, reactive approach to form management with:
- **Signal-based reactivity**: Automatic UI updates without manual subscriptions
- **Simplified API**: No callbacks, just reactive signals
- **Better type safety**: Compile-time type checking for form values
- **Performance**: More efficient change detection

### Basic Signal Forms Example

```typescript
import { Component, signal } from '@angular/core';
import { FormField, form, required } from '@angular/forms/signals';
import { SeparadorSignalDirective } from 'ngx-separador-miles';

@Component({
  selector: 'app-price-signal',
  standalone: true,
  imports: [FormField, SeparadorSignalDirective],
  template: `
    <form>
      <label for="amount">Monto en CLP$:</label>
      <input
        separadorSignal
        [formField]="priceForm.amount"
        id="amount"
      />
      <p>Valor: {{ priceForm().value().amount }}</p>
    </form>
  `
})
export class PriceSignalComponent {
  // Create model with initial value
  priceModel = signal({ amount: 1350689 as number | null });

  // Create form with validation
  priceForm = form(this.priceModel, (f) => {
    required(f.amount); // Make field required
  });
}
```

### Signal Forms with Validation

```typescript
import { Component, signal } from '@angular/core';
import { FormField, form, validate, required } from '@angular/forms/signals';
import { SeparadorSignalDirective } from 'ngx-separador-miles';

@Component({
  selector: 'app-advanced-signal',
  standalone: true,
  imports: [FormField, SeparadorSignalDirective],
  template: `
    <form>
      <label for="amount">Monto en CLP$:</label>
      <input
        separadorSignal
        [formField]="priceForm.amount"
        id="amount"
      />

      @if (priceForm.amount().touched() && priceForm.amount().invalid()) {
        @for (error of priceForm.amount().errors(); track error.kind) {
          @if (error.kind === 'required') {
            <div class="error">El monto es requerido</div>
          }
          @if (error.kind === 'minValue') {
            <div class="error">{{ error.message }}</div>
          }
          @if (error.kind === 'maxValue') {
            <div class="error">{{ error.message }}</div>
          }
        }
      }

      @if (priceForm.amount().valid() && priceForm.amount().value() !== null) {
        <div class="success">✓ Monto válido</div>
      }
    </form>
  `
})
export class AdvancedSignalComponent {
  priceModel = signal({ amount: null as number | null });

  priceForm = form(this.priceModel, (f) => {
    required(f.amount);

    // Custom validation: min value
    validate(f.amount, ({ value }) => {
      const amount = value();
      if (amount === null || amount === undefined) return undefined;
      return amount >= 1000
        ? undefined
        : { kind: 'minValue' as const, message: 'El monto mínimo es $1.000' };
    });

    // Custom validation: max value
    validate(f.amount, ({ value }) => {
      const amount = value();
      if (amount === null || amount === undefined) return undefined;
      return amount <= 100000000
        ? undefined
        : { kind: 'maxValue' as const, message: 'El monto máximo es $100.000.000' };
    });
  });
}
```

### Signal Forms with Decimals (UF values)

For UF (Unidad de Fomento) values that require decimals:

```typescript
import { Component, signal } from '@angular/core';
import { FormField, form, required } from '@angular/forms/signals';
import { SeparadorSignalDirective } from 'ngx-separador-miles';

@Component({
  selector: 'app-uf-signal',
  standalone: true,
  imports: [FormField, SeparadorSignalDirective],
  template: `
    <form>
      <label for="uf">Valor en UF:</label>
      <input
        separadorSignal
        [formField]="ufForm.uf"
        [allowDecimals]="true"
        id="uf"
      />
      <p>Display: {{ ufForm().value().uf }} UF</p>
      <p>Example: 1.350.689,5 UF</p>
    </form>
  `
})
export class UfSignalComponent {
  ufModel = signal({ uf: 1350689.5 as number | null });

  ufForm = form(this.ufModel, (f) => {
    required(f.uf);
  });
}
```

### Signal Forms Configuration Options

The `separadorSignal` directive accepts the same configuration as the Reactive Forms version:

```html
<input
  separadorSignal
  [formField]="form.amount"
  [thousandSeparator]="'.'"     <!-- Default: '.' (Chilean CLP$: 1.350.689) -->
  [decimalSeparator]="','"      <!-- Default: ',' (Chilean UF: 1.350.689,5) -->
  [allowDecimals]="true"        <!-- Default: false (set true for UF values) -->
/>
```

### Reactive Forms vs Signal Forms

| Feature | Reactive Forms (`libSeparadorMiles`) | Signal Forms (`separadorSignal`) |
|---------|-------------------------------------|----------------------------------|
| **API** | ControlValueAccessor | FormValueControl |
| **Angular Version** | 19.2.0+ | 21.0.0+ |
| **Status** | ✅ Stable | ⚠️ Experimental |
| **Reactivity** | Observables/Subscriptions | Signals (automatic) |
| **Configuration** | `[libSeparadorMiles.config]="{...}"` | `[thousandSeparator]="'.'"` |
| **Validation** | ValidatorFn | `validate()` function |
| **Display Format** | 1.350.689 or 1.350.689,5 | 1.350.689 or 1.350.689,5 |
| **Form Value** | `number \| null` | `number \| null` |
| **Use Case** | Production apps | Angular 21+ modern apps |

## Helper Functions

For advanced use cases, you can import and use the formatting functions directly:

```typescript
import { separadorFormat, separadorParse, separadorClean, SeparadorConfig } from 'ngx-separador-miles';

// Format a number for display
const formatted = separadorFormat(1350689, {
  thousandSeparator: '.',
  decimalSeparator: ',',
  allowDecimals: false
});
console.log(formatted); // "1.350.689"

// Parse formatted string to number
const parsed = separadorParse("1.350.689,5", {
  decimalSeparator: ','
});
console.log(parsed); // 1350689.5

// Clean/sanitize user input
const cleaned = separadorClean("12a3,4,5", {
  decimalSeparator: ','
});
console.log(cleaned); // "123,45"
```

### Helper Function API

#### `separadorFormat(value, config?): string`

Formats a numeric value with thousand and decimal separators.

**Parameters:**
- `value: any` - The numeric value to format
- `config?: SeparadorConfig` - Optional configuration

**Returns:** Formatted string

**Examples:**
```typescript
separadorFormat(1350689);                                          // "1.350.689"
separadorFormat(1350689.5, { allowDecimals: true });               // "1.350.689,5"
separadorFormat(-42000, { thousandSeparator: ',' });               // "-42,000"
separadorFormat(1234.56, { 
  thousandSeparator: ',', 
  decimalSeparator: '.', 
  allowDecimals: true 
});                                                                // "1,234.56"
```

#### `separadorParse(value, config?): number | null`

Parses a formatted string to a clean numeric value.

**Parameters:**
- `value: string` - The formatted string to parse
- `config?: SeparadorConfig` - Optional configuration

**Returns:** Numeric value or `null` if invalid

**Examples:**
```typescript
separadorParse("1.350.689,5", { decimalSeparator: ',' });  // 1350689.5
separadorParse("1,234.56", { decimalSeparator: '.' });     // 1234.56
separadorParse("42,000");                                  // 42000
separadorParse("");                                        // null
```

#### `separadorClean(value, config?): string`

Sanitizes input to only allow digits and one decimal separator.

**Parameters:**
- `value: string` - The raw input string to sanitize
- `config?: SeparadorConfig` - Optional configuration

**Returns:** Sanitized string

**Examples:**
```typescript
separadorClean("12a3,4,5");                           // "123,45"
separadorClean("1..2..3");                            // "123"
separadorClean("abc123def");                          // "123"
separadorClean("1,234.56", { decimalSeparator: '.' }); // "123456"
```

## API Reference

### Directive Selector

```typescript
selector: 'input[libSeparadorMiles]'
```

### ControlValueAccessor Implementation

The directive implements Angular's `ControlValueAccessor` interface, making it fully compatible with:
- Reactive Forms (`FormControl`, `FormGroup`)
- Template-driven Forms (`ngModel`)
- Form validation
- Disabled states

### Methods

The directive automatically handles:
- **Value formatting**: Formats the value when programmatically set via form controls
- **User input**: Sanitizes and formats input as the user types
- **Blur events**: Ensures proper formatting when the input loses focus
- **Cursor positioning**: Maintains cursor position during real-time formatting

## Building the Library

To build the library for production:

```bash
ng build ngx-separador-miles
```

The compiled library will be available in the `dist/ngx-separador-miles` directory.

### Building and Publishing

1. Build the library:
   ```bash
   ng build ngx-separador-miles
   ```

2. Navigate to the distribution directory:
   ```bash
   cd dist/ngx-separador-miles
   ```

3. Publish to npm:
   ```bash
   npm publish
   ```

## Development

### Running Tests

Execute the unit tests:

```bash
ng test ngx-separador-miles
```

### Local Development

To test the library locally in your Angular application:

1. Build the library:
   ```bash
   ng build ngx-separador-miles --watch
   ```

2. In your consuming application, link to the local build:
   ```bash
   npm link ../path/to/ngx-common-prosmart/dist/ngx-separador-miles
   ```

## License

This library is part of the ngx-common-prosmart project.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## Support

For issues, questions, or feature requests, please visit the [GitHub repository](https://github.com/danieldiazastudillo/ngx-common-prosmart).

## Additional Resources

- **[Live Examples & Implementation Guide](https://danieldiazastudillo.github.io/ngx-common-prosmart/)** - Interactive demos and detailed implementation instructions
- **[GitHub Repository](https://github.com/danieldiazastudillo/ngx-common-prosmart)** - Source code and issue tracking
