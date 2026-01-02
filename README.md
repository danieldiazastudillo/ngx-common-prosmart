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
- ✅ Automatic thousands separator formatting as you type
- ✅ Configurable decimal and thousands separators
- ✅ Optional decimal support
- ✅ Works seamlessly with Angular Reactive Forms
- ✅ Signal-based configuration
- ✅ Maintains cursor position during formatting
- ✅ Tested and recommended for Angular 21.x projects

**Compatibilidad Angular:**

| ngx-separador-miles | Angular | Estado |
|---------------------|---------|--------|
| 0.0.1 - 0.0.2 | 19.2.0+ | ✅ Soportado |
| 0.0.3 | 19.2.0 - 21.x | ✅ Actual (Recomendado) |
| 0.1.x | 22.x | 📅 Planeado |
| 1.0.x | 23.x | 📅 Planeado |

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

---

### 📦 ngx-rut-v2

An Angular library for validating and formatting Chilean RUT (Rol Único Tributario) with standalone components support.

**Features:**
- ✅ Real-time RUT formatting as user types (NEW in v1.10.0)
- ✅ Input restriction: only numbers and letter 'K'
- ✅ Automatic uppercase conversion for 'K'
- ✅ RUT validation for reactive and template-driven forms
- ✅ Automatic RUT formatting (12.345.678-K)
- ✅ Standalone components, directives, and pipes
- ✅ ControlValueAccessor for seamless form integration
- ✅ Zero external dependencies (except Angular)
- ✅ Fully typed TypeScript implementation

**Compatibilidad Angular:**

| ngx-rut-v2 | Angular | Estado |
|------------|---------|--------|
| 1.5.0      | 18      | ✅ Soportado |
| 1.6.0      | 19      | ✅ Soportado |
| 1.7.0      | 19      | ✅ Soportado |
| 1.8.0      | 20      | ✅ Soportado |
| 1.9.0      | 21      | ✅ Soportado |
| 1.10.0     | 21      | ✅ Actual (Recomendado) |

**Installation:**
```bash
npm install ngx-rut-v2 --save
```

**Quick Example:**
```typescript
import { rutValidator, RutValueAccessor, RutPipe } from 'ngx-rut-v2';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, RutValueAccessor, RutPipe],
  template: `
    <input formControlName="rut" formatRut />
    <!-- Real-time formatting: 12345678k → 12.345.678-K -->
    <p>Formatted: {{ userRut | rut }}</p>
  `
})
export class MyComponent {
  form = this.fb.group({
    rut: ['', [Validators.required, rutValidator]]
  });
}
```

📚 [View full documentation](./projects/ngx-rut-v2/README.md)

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

## 🚀 CI/CD & Publication Workflows

This project uses GitHub Actions for automated continuous integration, deployment, and publication. There are three main workflows:

### 📦 Library Publication to npm

Two automated workflows handle publishing libraries to npm when changes are pushed to the `main` branch:

#### **ngx-separador-miles** (`.github/workflows/publish-ngx-separador-miles.yml`)
- **Triggers:** Changes to `projects/ngx-separador-miles/**` or the workflow file itself
- **Process:**
  1. Detects changes in the library directory
  2. Installs dependencies and builds the library
  3. Checks if the version in `package.json` is already published on npm
  4. Publishes to npm with `--access public` if version is new
- **Requirements:** `NPM_TOKEN` secret configured in GitHub repository settings

#### **ngx-rut-v2** (`.github/workflows/publish-ngx-rut-v2.yml`)
- **Triggers:** Changes to `projects/ngx-rut-v2/**` or the workflow file itself
- **Process:** Same as ngx-separador-miles
- **Requirements:** `NPM_TOKEN` secret configured in GitHub repository settings

**Important Notes:**
- 📌 Version must be updated in the library's `package.json` before pushing
- 🔐 Requires npm authentication token stored as GitHub secret
- ✅ Automatically skips publication if version already exists on npm
- 🔄 Runs on every push to `main` branch (only when library files change)

### 🌐 GitHub Pages Deployment

#### **Deploy Angular App** (`.github/workflows/deploy.yml`)
- **Triggers:** Push or pull request to `main` branch
- **Process:**
  1. Builds both libraries in parallel (`ngx-separador-miles` & `ngx-rut-v2`)
  2. Builds the demo Angular application
  3. Deploys to GitHub Pages at `https://danieldiazastudillo.github.io/ngx-common-prosmart/`
- **Output:** Live interactive examples and documentation site

**What gets deployed:**
- 📱 Interactive component demos
- 📖 Implementation examples
- 🎯 Real-world usage scenarios
- 💡 Configuration guides

### 🔄 Workflow Best Practices

**Before Publishing a New Version:**

1. **Update version number** in library's `package.json`:
   ```json
   {
     "name": "ngx-rut-v2",
     "version": "1.10.0",  // Increment this
     ...
   }
   ```

2. **Update CHANGELOG.md** with new features/fixes

3. **Update README.md** compatibility table if needed

4. **Commit and push** to `main` branch:
   ```bash
   git add .
   git commit -m "chore: release ngx-rut-v2 v1.10.0"
   git push origin main
   ```

5. **Workflow automatically:**
   - ✅ Detects changes
   - ✅ Builds library
   - ✅ Checks version
   - ✅ Publishes to npm
   - ✅ Deploys demo to GitHub Pages

### 📋 Workflow Status

Check the **Actions** tab in GitHub to monitor:
- Build status
- Publication results
- Deployment logs
- Error messages (if any)

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
│   ├── ngx-separador-miles/     # Thousands separator directive library
│   └── ngx-rut-v2/              # Chilean RUT validation & formatting library
├── src/                         # Demo application
│   └── app/
│       └── core/
│           └── components/
│               ├── separador-example/  # Separador-miles examples
│               └── rut-example/        # RUT validation examples
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
