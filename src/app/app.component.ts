import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './sections/nav/nav.component';
import { FooterComponent } from './sections/footer/footer.component';
import { TeleportOverlayComponent } from './core/components/teleport-overlay/teleport-overlay.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavComponent, FooterComponent, TeleportOverlayComponent],
  template: `
    <app-nav />
    <router-outlet />
    <app-footer />
    <app-teleport-overlay />
  `,
  styles: `
    :host {
      display: block;
      min-height: 100vh;
    }
  `,
})
export class AppComponent {}
