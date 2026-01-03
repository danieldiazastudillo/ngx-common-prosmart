# ngx-rut-v2

Basado en [ngx-rut](https://github.com/danieldiazastudillo/ngx-rut) pero usando Angular con componentes, directivas y validaciones _standalone_. Para uso en Angular con módulos se recomienda esa versión.

Valida y formatea [RUT Chilenos](https://en.wikipedia.org/wiki/National_identification_number#Chile)

## Compatibilidad Angular

| Versión ngx-rut-v2 | Versión Angular | Estado |
|--------------------|-----------------|--------|
| 1.5.0              | 18              | ✅ Soportado |
| 1.6.0              | 19              | ✅ Soportado |
| 1.7.0              | 19              | ✅ Soportado |
| 1.8.0              | 20              | ✅ Soportado |
| 1.9.0              | 21              | ✅ Soportado |
| 1.10.0             | 21              | ✅ Soportado |
| **2.1.0**          | **21**          | **✅ Actual (Recomendado)** |

> **Nota:** Las versiones soportan Angular desde 20.0.0 hasta 21.x. Para versiones anteriores de Angular, consulte versiones anteriores de la librería.

## Installation

```bash
npm install --save ngx-rut-v2
```

## ⚠️ DEPRECATION NOTICE (v2.1.0)

**The `RutDirective` (selector: `[formatRut]`) has been renamed to `[formatRutLegacy]` and is deprecated.**

This legacy directive will be **removed in v3.0.0**. Please migrate to `RutValueAccessor` which provides superior functionality:

### Migration Guide

```html
<!-- ❌ Old (deprecated - will show console warning): -->
<input formControlName="rut" formatRutLegacy />

<!-- ✅ New (recommended): -->
<input formControlName="rut" formatRut />
```

### Why Migrate?

| Feature | `formatRutLegacy` (Deprecated) | `RutValueAccessor` (Recommended) |
|---------|-------------------------------|----------------------------------|
| Real-time formatting | ❌ Only on focus/blur | ✅ While typing |
| Programmatic updates | ❌ Loses formatting | ✅ Maintains formatting |
| Cursor management | ❌ No | ✅ Yes |
| Input restrictions | ❌ No | ✅ Only numbers & K |
| Standalone | ❌ No | ✅ Yes |

**What changed in v2.1.0:**
- ✅ **Fixed:** Formatting now persists during programmatic form updates (`setValue()`, `patchValue()`)
- ✅ **Added:** Focus-aware cursor management for seamless user experience
- ✅ **Improved:** Standalone directive using modern Angular patterns (`inject()`)
- ⚠️ **Deprecated:** `[formatRutLegacy]` - migrate to `[formatRut]` on form controls


## Set-up:

Se deben importar las funciones, directivas & pipes directamente (standalones)

```typescript
...
import { rutValidator, RutValidator, RutDirective, RutPipe, RutValueAccessor } from 'ngx-rut-v2';
...

@Component({
  selector: 'app-some-component',
  standalone: true, //IMPORTANTE!
  imports: [    
    RutValidator,
    RutDirective,
    RutPipe,
    RutValueAccessor
  ] 
})
class SomeComponent { }
```


## Uso

El paquete expone diversas funciones de validación de RUTs. Sin embargo se recomienda usar:
- `rutValidator`: Función validadora para formularios reactivos.
- `RutValidator`: Expone la directiva `validateRut` (para `NgModel` o `inputs` en _Template-Driven Forms_)
- `RutPipe`: Expone el _pipe_ para formatear texto como RUT
- `RutDirective`: Expone la directiva `formatRut` para formateo de `inputs`
- `RutValueAccessor`: ControlValueAccessor para formularios reactivos con formateo automático


### Reactive Forms

#### Componente
```typescript
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { rutValidator } from 'ngx-rut-v2';
export class DemoAppComponent {
  constructor (private fb: FormBuilder) {
    this.reactiveForm = fb.group({
      rut: ['30972198', [Validators.required, rutValidator]]
    });
  }
}
```

#### Template

##### Rut Pipe (standalone)

```html
{{ user.rut }}
<!-- 30972198 -->
{{ user.rut | rut }}
<!-- 3.097.219-8 -->
```

##### RutValueAccessor (Directiva con Formateo en Tiempo Real)

> **MEJORADO en v2.1.0:** Ahora mantiene el formateo durante actualizaciones programáticas del formulario (ej: después de búsquedas o fetch de datos).

> **NUEVO en v1.10.0:** Formateo automático mientras el usuario escribe, con restricción de caracteres y conversión automática a mayúsculas.

**Características:**
- ✅ Formateo en tiempo real mientras escribe (no espera blur)
- ✅ **[v2.1.0] Mantiene formateo durante `setValue()` y `patchValue()`**
- ✅ **[v2.1.0] Gestión inteligente del cursor - solo cuando el input está enfocado**
- ✅ **[v2.1.0] Directiva standalone con patrón `inject()` moderno**
- ✅ Restricción de entrada: solo números y letra 'K'
- ✅ Conversión automática de 'k' a 'K' (mayúscula)
- ✅ Preservación de la posición del cursor durante el formateo
- ✅ Validación en tiempo real con `rutValidator`
- ✅ El input muestra el valor formateado (ej: "12.345.678-K")
- ✅ El formulario recibe el valor limpio (ej: "12345678K")

```html
<input formControlName="rut" formatRut />
<!--
Mientras escribe: 12345678k
Se muestra:       12.345.678-K (automáticamente formateado y en mayúscula)
Valor del form:   12345678K (sin formato, listo para validación)
-->
```

**Ejemplo Completo con Validación:**
```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { rutValidator, RutValueAccessor, RutPipe } from 'ngx-rut-v2';

@Component({
  selector: 'app-rut-example',
  standalone: true,
  imports: [ReactiveFormsModule, RutValueAccessor, RutPipe],
  template: `
    <form [formGroup]="form">
      <label for="rut">RUT (Rol Único Tributario):</label>
      <input 
        id="rut" 
        formControlName="rut" 
        formatRut 
        class="form-control" 
      />
      
      @if (form.get('rut')?.hasError('invalidRut')) {
        <div class="text-danger">
          El RUT ingresado es inválido
        </div>
      }
      
      @if (form.get('rut')?.valid && form.get('rut')?.value) {
        <div class="text-success">
          ✓ El RUT es válido
        </div>
      }
      
      <p>Valor del formulario: {{ form.value | json }}</p>
      <p>RUT Formateado: {{ form.get('rut')?.value | rut }}</p>
    </form>
  `
})
export class RutExampleComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    rut: ['', [Validators.required, rutValidator]]
  });
}
```
##### Error Form

>IMPORTANTE: Por defecto el error que retorna la validación es `invalidRut`

```html
<mat-form-field>
  <mat-label>RUT</mat-label>
  <input matInput formControlName="rut" formatRut />
  @if (reactiveForm.get('rut')?.hasError('invalidRut')) {
    <mat-error>El RUT ingresado es <strong>inválido</strong></mat-error>
  }
</mat-form-field>
```

##### Template-Driven Forms
```html
<input [(ngModel)]="user.rut" name="rut" validateRut formatRut required>
```




