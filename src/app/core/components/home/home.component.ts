import { Component } from '@angular/core';
import { RutExampleComponent } from '../rut-example/rut-example.component';
import { SeparadorExampleComponent } from '../separador-example/separador-example.component';

@Component({
  selector: 'app-home',
  imports: [RutExampleComponent, SeparadorExampleComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {

}
