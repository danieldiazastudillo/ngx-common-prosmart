# ngx-rut-v2

Basado en [ngx-rut](https://github.com/danieldiazastudillo/ngx-rut) pero usando Angular con componentes, directivas y validaciones _standalone_. Para uso en Angular con módulos se recomienda esa versión.

Valida y formatea [RUT Chilenos](https://en.wikipedia.org/wiki/National_identification_number#Chile)

## Compatibilidad

| Versión ngx-rut-v2 | Versión Angular |
|--------------------|-----------------|
| 1.5.0              | 18              |
| 1.6.0              | 19              |
| 1.7.0              | 19              |
| 1.8.0              | 20              |
| 1.9.0              | 21              |

## Installation

```bash
npm install --save ngx-rut-v2
```


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

##### formatRut (Directiva para inputs con ControlValueAccessor)
```html
<input formControlName="rut" formatRut />
<!--
(on blur)
3.097.219-8

(on focus/input)
30972198
-->
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




