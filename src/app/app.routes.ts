import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./core/components/home/home.component').then(m => m.HomeComponent)
  }
];
