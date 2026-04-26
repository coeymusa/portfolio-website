import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="footer">
      <div class="footer-inner">
        <div class="colophon">
          <span class="mono-label">COLOPHON</span>
          <p class="colophon-text">
            Set in <em>Fraunces</em> &amp; <em>JetBrains Mono</em>.
            Built with Angular 19. Deployed on Railway.
            Domain at coreyscodecave.com.
          </p>
        </div>

        <div class="footer-meta">
          <span class="mono">© MMXXVI · CMUSA</span>
          <span class="mono mono-faint">VOL. I · FOLIO 1</span>
        </div>
      </div>
    </footer>
  `,
  styles: `
    :host {
      display: block;
    }

    .footer {
      border-top: 1px solid var(--rule);
      padding: 3rem 3rem 2rem;
      background: var(--ink-deep);
      position: relative;
      z-index: 2;
    }

    .footer-inner {
      max-width: 1600px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 3rem;
      align-items: end;
    }

    .colophon {
      max-width: 540px;
    }

    .mono-label {
      font-family: var(--font-mono);
      font-size: 0.65rem;
      letter-spacing: 0.25em;
      color: var(--brass-mute);
      display: block;
      margin-bottom: 0.75rem;
    }

    .colophon-text {
      font-family: var(--font-display);
      font-style: italic;
      font-size: 0.95rem;
      color: var(--text-mute);
      line-height: 1.6;
    }

    .colophon-text em {
      color: var(--paper);
      font-style: italic;
      font-weight: 500;
    }

    .footer-meta {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.5rem;
      text-align: right;
    }

    .mono {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      letter-spacing: 0.2em;
      color: var(--text-mute);
    }

    .mono-faint {
      color: var(--text-faint);
      font-size: 0.65rem;
    }

    @media (max-width: 700px) {
      .footer {
        padding: 2.5rem 1.5rem 1.5rem;
      }
      .footer-inner {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      .footer-meta {
        align-items: flex-start;
        text-align: left;
      }
    }
  `,
})
export class FooterComponent {}
