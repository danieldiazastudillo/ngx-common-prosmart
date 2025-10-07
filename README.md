# NgxCommonProsmart

A collection of reusable Angular libraries and components for common use cases. This monorepo contains utility libraries that can be used across different Angular projects.

## 🌐 Live Demo & Documentation

Visit our **[GitHub Pages site](https://danieldiazastudillo.github.io/ngx-common-prosmart/)** for:
- 📱 Interactive examples
- 📖 Implementation instructions
- 🎯 Real-world usage demos
- 💡 Configuration examples

## Libraries

### 📦 ngx-separador-miles

A lightweight Angular directive for formatting numbers with thousands separators in input fields.

**Features:**
- Automatic thousands separator formatting
- Configurable decimal and thousands separators
- Works with Angular Reactive Forms
- Signal-based configuration
- Supports Angular 19 and onwards (including Angular 20+)

**Installation:**
```bash
npm install ngx-separador-miles --save
```

**Quick Example:**
```typescript
import { SeparadorMilesAccessor } from 'ngx-separador-miles';

@Component({
  imports: [ReactiveFormsModule, SeparadorMilesAccessor],
  template: `
    <input formControlName="amount" libSeparadorMiles />
  `
})
```

📚 [View full documentation](./projects/ngx-separador-miles/README.md)

## Development

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.15.

### Development Server

To start a local development server with example implementations:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

### Building Libraries

To build a specific library:

```bash
ng build ngx-separador-miles
```

This will compile the library and store the build artifacts in the `dist/` directory.

To build all libraries:

```bash
ng build
```

### Publishing a Library

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

## Code Scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Running Unit Tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

To test a specific library:

```bash
ng test ngx-separador-miles
```

## Running End-to-End Tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Project Structure

```
ngx-common-prosmart/
├── projects/
│   └── ngx-separador-miles/     # Thousands separator directive library
├── src/                         # Demo application
│   └── app/
│       └── core/
│           └── components/
│               └── separador-example/  # Example implementation
├── dist/                        # Build output (generated)
└── README.md                    # This file
```

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## Links

- **[Live Examples & Demos](https://danieldiazastudillo.github.io/ngx-common-prosmart/)** - Interactive examples with implementation instructions
- **[GitHub Repository](https://github.com/danieldiazastudillo/ngx-common-prosmart)** - Source code and contributions

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
