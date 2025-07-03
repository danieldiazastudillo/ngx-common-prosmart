import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SeparadorExampleComponent } from "./core/components/separador-example/separador-example.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SeparadorExampleComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ngx-common-prosmart';
}
