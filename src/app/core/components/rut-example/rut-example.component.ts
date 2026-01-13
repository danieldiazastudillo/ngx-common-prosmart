import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { form, validate, customError, required } from '@angular/forms/signals';
import { Highlight } from 'ngx-highlightjs';
import { HighlightLineNumbers } from 'ngx-highlightjs/line-numbers';
import { rutValidator, RutValueAccessor, RutPipe, RutDirective, RutSignalDirective, rutValidate } from 'ngx-rut-v2';

@Component({
  selector: 'app-rut-example',
  imports: [ReactiveFormsModule, RutValueAccessor, RutPipe, RutDirective, RutSignalDirective, Highlight, HighlightLineNumbers, JsonPipe],
  templateUrl: './rut-example.component.html',
  styleUrl: './rut-example.component.css'
})
export class RutExampleComponent {

  private readonly fb = inject(FormBuilder);

  form = this.fb.group({
    rut: ['', [Validators.required, rutValidator]]
  });

  // Deprecated example form
  deprecatedForm = this.fb.group({
    rut: ['', [Validators.required, rutValidator]]
  });

  // 🧪 EXPERIMENTAL: Signal Forms example
  signalFormModel = signal({ rut: '' });

  signalForm = form(this.signalFormModel, (f) => {
    // Required validation
    required(f.rut);

    // Custom RUT validation
    validate(f.rut, ({ value }) => {
      const rutValue = value();
      if (!rutValue) return undefined;

      return rutValidate(rutValue)
        ? undefined
        : customError({
            kind: 'invalidRut',
            message: 'El RUT ingresado es inválido'
          });
    });
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

  deprecatedExample = `<!-- ⚠️ DEPRECATED: This directive will be removed in v3.0.0 -->
<input formControlName="rut" formatRutLegacy class="form-control" />

<!-- ✅ RECOMMENDED: Use RutValueAccessor instead -->
<input formControlName="rut" formatRut class="form-control" />`;

  // Signal Forms code examples
  signalFormsImplementation = `import { Component, signal } from '@angular/core';
import { form, validate, customError, required } from '@angular/forms/signals';
import { RutSignalDirective, rutValidate } from 'ngx-rut-v2';

@Component({
  selector: 'app-rut-example',
  imports: [RutSignalDirective],
  templateUrl: './rut-example.component.html'
})
export class RutExampleComponent {
  signalFormModel = signal({ rut: '' });

  signalForm = form(this.signalFormModel, (f) => {
    required(f.rut);

    validate(f.rut, ({ value }) => {
      const rutValue = value();
      if (!rutValue) return undefined;

      return rutValidate(rutValue)
        ? undefined
        : customError({ kind: 'invalidRut', message: 'RUT inválido' });
    });
  });
}`;

  signalFormsTemplate = `<form>
  <label for="rut-signal">RUT (Signal Forms):</label>
  <input
    id="rut-signal"
    rutSignal
    [(value)]="signalForm.rut().value"
    class="form-control"
  />

  @if (signalForm.rut().invalid()) {
    <div class="text-danger">
      @for (error of signalForm.rut().errors(); track error.kind) {
        <div>{{ error.message }}</div>
      }
    </div>
  }

  @if (signalForm.rut().valid() && signalForm.rut().value()) {
    <div class="text-success">✓ El RUT es válido</div>
  }
</form>

<!-- Display form value -->\n<p>Valor: {{ signalForm().value() | json }}</p>`;

  /**
   * Simulates a programmatic update to test formatting persistence
   * Takes the current RUT value (clean), then re-applies it programmatically
   * This demonstrates that the enhanced writeValue() maintains formatting
   * even when the form control value is updated programmatically while focused
   */
  onSimulateProgrammaticUpdate(): void {
    const currentValue = this.form.get('rut')?.value || '';

    // If no value, use a test RUT
    const rutToSet = currentValue || '161415529';

    // Re-apply the same value programmatically (simulates setValue/patchValue during a search)
    this.form.patchValue({ rut: rutToSet });

    // Show alert confirming the value was re-applied
    alert(
      `Programmatic Update Test:\n\n` +
      `Current RUT value: ${rutToSet}\n` +
      `Action: Re-applied via patchValue()\n\n` +
      `✓ Check the input - formatting should be preserved!\n` +
      `(The input should still show formatted: XX.XXX.XXX-X)`
    );
  }

  /**
   * Test for deprecated directive - shows console warning
   */
  onSimulateDeprecatedUpdate(): void {
    const testRut = '67581059'; // Valid RUT

    this.deprecatedForm.patchValue({ rut: testRut });

    const formattedValue = this.deprecatedForm.get('rut')?.value || '';
    alert(
      `Deprecated Directive Test:\n\n` +
      `Value set: ${testRut}\n` +
      `Form control value: ${formattedValue}\n\n` +
      `⚠️ Check console for deprecation warning!`
    );
  }
}
