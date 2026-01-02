import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Highlight } from 'ngx-highlightjs';
import { HighlightLineNumbers } from 'ngx-highlightjs/line-numbers';
import { rutValidator, RutValueAccessor, RutPipe } from 'ngx-rut-v2';

@Component({
  selector: 'app-rut-example',
  imports: [ReactiveFormsModule, RutValueAccessor, RutPipe, Highlight, HighlightLineNumbers, JsonPipe],
  templateUrl: './rut-example.component.html',
  styleUrl: './rut-example.component.css'
})
export class RutExampleComponent {

  private readonly fb = inject(FormBuilder);

  form = this.fb.group({
    rut: ['', [Validators.required, rutValidator]]
  });

  bash = `npm install ngx-rut-v2 --save`;

  textoImplementacion = `import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { rutValidator, RutValueAccessor, RutPipe } from 'ngx-rut-v2';

@Component({
  selector: 'app-rut-example',
  imports: [ReactiveFormsModule, RutValueAccessor, RutPipe],
  templateUrl: './rut-example.component.html',
  styleUrl: './rut-example.component.css'
})
export class RutExampleComponent {
  private readonly fb = inject(FormBuilder);

  form = this.fb.group({
    rut: ['', [Validators.required, rutValidator]]
  });
}
  `;

  textoTemplate = `<form [formGroup]="form">
  <label for="rut" class="form-label">RUT (Rol Único Tributario)</label>
  <input id="rut" formControlName="rut" formatRut class="form-control" />
  @if (form.get('rut')?.hasError('invalidRut')) {
    <div class="text-danger">El RUT ingresado es inválido</div>
  }
</form>

<!-- Display formatted RUT -->
<p>RUT Formateado: {{ form.get('rut')?.value | rut }}</p>
  `;
}
