import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'separador-miles',
    loadComponent: () => import('./core/components/separador-example/separador-example.component').then(m => m.SeparadorExampleComponent)
  },
  {
    path: 'rut-validator',
    loadComponent: () => import('./core/components/rut-example/rut-example.component').then(m => m.RutExampleComponent)
  },
  {
    path: '',
    redirectTo: 'separador-miles',
    pathMatch: 'full'
  }
];
