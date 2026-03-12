import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="footer">
      <p class="footer-text">Built with Angular. Deployed on AWS.</p>
      <p class="footer-copyright">&copy; {{ currentYear }} Corey. All rights reserved.</p>
    </footer>
  `,
  styles: `
    :host {
      display: block;
    }

    .footer {
      border-top: 1px solid rgba(0, 0, 0, 0.06);
      padding: 2rem;
      text-align: center;
    }

    .footer-text {
      color: #9ca3af;
      font-size: 0.8125rem;
      margin-bottom: 0.25rem;
    }

    .footer-copyright {
      color: #9ca3af;
      font-size: 0.8125rem;
    }
  `,
})
export class FooterComponent {
  readonly currentYear = new Date().getFullYear();
}
