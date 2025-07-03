import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Highlight } from 'ngx-highlightjs';
import { HighlightLineNumbers } from 'ngx-highlightjs/line-numbers';
import { SeparadorMilesAccessor } from 'ngx-separador-miles';

@Component({
  selector: 'app-separador-example',
  imports: [ReactiveFormsModule, SeparadorMilesAccessor, Highlight, HighlightLineNumbers, JsonPipe],
  templateUrl: './separador-example.component.html',
  styleUrl: './separador-example.component.css'
})
export class SeparadorExampleComponent {

  private readonly fb = inject(FormBuilder);

  form = this.fb.group({
    exampleControl: [5250000]
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
}
