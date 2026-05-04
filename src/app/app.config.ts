import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({
        // Reset to top on every route change so the case study (and CV)
        // open at the masthead, not wherever the previous page was scrolled.
        scrollPositionRestoration: 'top',
        // Preserve anchor jumps for fragment links like /#projects.
        anchorScrolling: 'enabled',
      })
    ),
  ],
};
