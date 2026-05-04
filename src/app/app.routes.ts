import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'cv',
    loadComponent: () =>
      import('./pages/cv/cv.component').then((m) => m.CvComponent),
  },
  {
    path: 'one-week',
    loadComponent: () =>
      import('./pages/one-week/one-week.component').then(
        (m) => m.OneWeekComponent
      ),
  },
  { path: '**', redirectTo: '' },
];
