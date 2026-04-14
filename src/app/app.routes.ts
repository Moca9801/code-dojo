import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'exercise/:id',
    loadComponent: () => import('./exercise/exercise.component').then((m) => m.ExerciseComponent),
  },
  {
    path: 'playground',
    loadComponent: () => import('./playground/playground.component').then((m) => m.PlaygroundComponent),
  },
  { path: '**', redirectTo: '' },
];
