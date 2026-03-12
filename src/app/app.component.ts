import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './sections/nav/nav.component';
import { FooterComponent } from './sections/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavComponent, FooterComponent],
  template: `
    <app-nav />
    <router-outlet />
    <app-footer />
  `,
  styles: `
    :host {
      display: block;
      min-height: 100vh;
    }
  `,
})
export class AppComponent {}
