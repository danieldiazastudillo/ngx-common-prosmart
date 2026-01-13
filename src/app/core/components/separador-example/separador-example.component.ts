import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { form, validate, customError, required } from '@angular/forms/signals';
import { Highlight } from 'ngx-highlightjs';
import { HighlightLineNumbers } from 'ngx-highlightjs/line-numbers';
import { SeparadorMilesAccessor, SeparadorSignalDirective } from 'ngx-separador-miles';

@Component({
  selector: 'app-separador-example',
  imports: [ReactiveFormsModule, SeparadorMilesAccessor, SeparadorSignalDirective, Highlight, HighlightLineNumbers, JsonPipe],
  templateUrl: './separador-example.component.html',
  styleUrl: './separador-example.component.css'
})
export class SeparadorExampleComponent {

  private readonly fb = inject(FormBuilder);

  form = this.fb.group({
    exampleControl: [5250000]
  });

  // Signal Forms (Experimental - Angular 21+)
  signalFormModel = signal({ amount: 1350689 as number | null });

  signalForm = form(this.signalFormModel, (f) => {
    required(f.amount);

    // Min value validation: $1.000
    validate(f.amount, ({ value }) => {
      const amount = value();
      if (amount === null || amount === undefined) return undefined;
      return amount >= 1000
        ? undefined
        : customError({ kind: 'minValue', message: 'El monto mínimo es $1.000' });
    });

    // Max value validation: $100.000.000
    validate(f.amount, ({ value }) => {
      const amount = value();
      if (amount === null || amount === undefined) return undefined;
      return amount <= 100000000
        ? undefined
        : customError({ kind: 'maxValue', message: 'El monto máximo es $100.000.000' });
    });
  });

  bash = `npm install ngx-separador-miles --save`;

  textoImplementacion = `import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SeparadorMilesAccessor } from 'ngx-separador-miles';

@Component({
  selector: 'app-separador-example',
  imports: [ReactiveFormsModule, SeparadorMilesAccessor],
  templateUrl: './separador-example.component.html',
  styleUrl: './separador-example.component.css'
})
export class SeparadorExampleComponent {
  private readonly fb = inject(FormBuilder);

  form = this.fb.group({
    exampleControl: [5250000]
  });
}
  `;

  textoTemplate = `<form [formGroup]="form">
  <label for="exampleControl" class="form-label">Example Control</label>
  <input id="exampleControl" formControlName="exampleControl" libSeparadorMiles class="form-control" />
</form>
  `;

  textoSignalImplementacion = `import { Component, signal } from '@angular/core';
import { form, validate, customError, required } from '@angular/forms/signals';
import { SeparadorSignalDirective } from 'ngx-separador-miles';

@Component({
  selector: 'app-separador-example',
  imports: [SeparadorSignalDirective],
  templateUrl: './separador-example.component.html'
})
export class SeparadorExampleComponent {
  signalFormModel = signal({ amount: 1350689 as number | null });

  signalForm = form(this.signalFormModel, (f) => {
    required(f.amount);

    validate(f.amount, ({ value }) => {
      const amount = value();
      if (amount === null || amount === undefined) return undefined;
      return amount >= 1000
        ? undefined
        : customError({ kind: 'minValue', message: 'El monto mínimo es $1.000' });
    });
  });
}
  `;

  textoSignalTemplate = `<form>
  <label for="amount-signal">Monto en CLP$:</label>
  <input
    separadorSignal
    [(value)]="signalForm.amount().value"
    id="amount-signal"
  />

  @if (signalForm.amount().errors(); as errors) {
    @for (error of errors; track error.kind) {
      @if (error.kind === 'required') {
        <div class="text-danger">El monto es requerido</div>
      }
      @if (error.kind === 'minValue') {
        <div class="text-danger">{{ error.message }}</div>
      }
    }
  }

  @if (signalForm.amount().valid() && signalForm.amount().value()) {
    <div class="text-success">✓ Monto válido</div>
  }
</form>
  `;
}
