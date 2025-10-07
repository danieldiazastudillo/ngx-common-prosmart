# NgxSeparadorMiles

A lightweight Angular directive for formatting numbers with thousands separators in input fields. Compatible with Angular 19 and onwards (including Angular 20+).

## 🌐 Live Demo

Check out the **[live examples and implementation guide](https://danieldiazastudillo.github.io/ngx-common-prosmart/)** on GitHub Pages.

## Features

- ✅ Automatic thousands separator formatting as you type
- ✅ Configurable decimal and thousands separators
- ✅ Optional decimal support
- ✅ Works seamlessly with Angular Reactive Forms
- ✅ Signal-based configuration
- ✅ Maintains cursor position during formatting
- ✅ Handles copy/paste operations gracefully
- ✅ Type-safe implementation
- ✅ Zero dependencies (except Angular peer dependencies)

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

## Compatibility

- **Angular**: 19.2.0 and onwards (including Angular 20+)
- **TypeScript**: 5.7+
- **Browser Support**: Modern browsers (ES2022+)

## License

This library is part of the ngx-common-prosmart project.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## Support

For issues, questions, or feature requests, please visit the [GitHub repository](https://github.com/danieldiazastudillo/ngx-common-prosmart).

## Additional Resources

- **[Live Examples & Implementation Guide](https://danieldiazastudillo.github.io/ngx-common-prosmart/)** - Interactive demos and detailed implementation instructions
- **[GitHub Repository](https://github.com/danieldiazastudillo/ngx-common-prosmart)** - Source code and issue tracking
