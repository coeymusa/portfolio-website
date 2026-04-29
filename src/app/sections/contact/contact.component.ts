import { Component, ChangeDetectionStrategy } from '@angular/core';

interface ContactLink {
  label: string;
  url: string;
  urlText: string;
  channel: string;
  icon: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="contact" class="section contact">
      <div class="container">
        <header class="masthead">
          <div class="masthead-rule">
            <span class="rule-tag">CHAPTER THREE</span>
          </div>
          <h2 class="archive-title">
            <em>Initiate</em> Correspondence
          </h2>
          <p class="archive-subtitle">
            Looking for a senior engineer who has shipped both at
            <em>billion-dollar institutions</em> and <em>solo</em>?
            Two channels, both read.
          </p>
        </header>

        <div class="channels">
          @for (link of links; track link.label; let i = $index) {
            <a
              class="channel"
              [href]="link.url"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div class="channel-num">{{ pad(i + 1) }}</div>
              <div class="channel-meta">
                <span class="channel-tag">{{ link.channel }}</span>
                <h3 class="channel-label">{{ link.label }}</h3>
                <span class="channel-url">{{ link.urlText }}</span>
              </div>
              <div class="channel-arrow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </a>
          }
        </div>

        <div class="closing">
          <span class="mono">— end of volume I —</span>
        </div>
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .contact {
      background: var(--ink);
    }

    /* Masthead */
    .masthead {
      margin-bottom: 5rem;
      max-width: 780px;
    }

    .masthead-rule {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .masthead-rule::before {
      content: '';
      flex: 0 0 60px;
      height: 1px;
      background: var(--ember);
    }

    .masthead-rule::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--rule);
    }

    .rule-tag {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      letter-spacing: 0.25em;
      color: var(--brass);
    }

    .archive-title {
      font-family: var(--font-display);
      font-variation-settings: 'opsz' 144, 'WONK' 1;
      font-size: clamp(3rem, 8vw, 6rem);
      line-height: 0.95;
      font-weight: 400;
      color: var(--paper);
      letter-spacing: -0.04em;
      margin-bottom: 1.5rem;
    }

    .archive-title em {
      font-style: italic;
      font-weight: 200;
      color: var(--text-mute);
      font-size: 0.7em;
      margin-right: 0.25rem;
    }

    .archive-subtitle {
      font-family: var(--font-display);
      font-style: italic;
      font-size: 1.15rem;
      color: var(--text);
      line-height: 1.7;
    }

    .archive-subtitle em {
      color: var(--paper);
      font-weight: 500;
    }

    /* Channels list */
    .channels {
      display: flex;
      flex-direction: column;
      border-top: 1px solid var(--rule);
    }

    .channel {
      display: grid;
      grid-template-columns: 80px 1fr 40px;
      align-items: center;
      gap: 2rem;
      padding: 2rem 1rem;
      border-bottom: 1px solid var(--rule);
      transition: background 0.3s ease, padding 0.3s ease;
      position: relative;
    }

    .channel::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 0;
      background: var(--ember);
      transition: width 0.4s cubic-bezier(0.65, 0, 0.35, 1);
    }

    .channel:hover {
      background: var(--ink-warm);
      padding-left: 2rem;
    }

    .channel:hover::before {
      width: 3px;
    }

    .channel-num {
      font-family: var(--font-display);
      font-variation-settings: 'opsz' 144, 'WONK' 1;
      font-size: 3rem;
      font-weight: 200;
      color: var(--ember);
      line-height: 1;
      letter-spacing: -0.03em;
    }

    .channel-meta {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .channel-tag {
      font-family: var(--font-mono);
      font-size: 0.65rem;
      letter-spacing: 0.25em;
      color: var(--brass);
      text-transform: uppercase;
    }

    .channel-label {
      font-family: var(--font-display);
      font-size: 1.75rem;
      font-weight: 400;
      color: var(--paper);
      letter-spacing: -0.02em;
      line-height: 1.1;
    }

    .channel-url {
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: var(--text-mute);
    }

    .channel-arrow {
      color: var(--text-mute);
      transition: color 0.3s, transform 0.3s;
    }

    .channel:hover .channel-arrow {
      color: var(--ember);
      transform: translateX(8px);
    }

    .channel:hover .channel-label {
      color: var(--ember);
    }

    /* Closing */
    .closing {
      text-align: center;
      margin-top: 4rem;
      padding-top: 3rem;
      border-top: 1px solid var(--rule);
    }

    .closing .mono {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--text-faint);
    }

    /* Responsive */
    @media (max-width: 700px) {
      .channel {
        grid-template-columns: 60px 1fr 30px;
        gap: 1.25rem;
        padding: 1.5rem 0.75rem;
      }

      .channel:hover {
        padding-left: 1.5rem;
      }

      .channel-num {
        font-size: 2.25rem;
      }

      .channel-label {
        font-size: 1.25rem;
      }

      .channel-url {
        font-size: 0.7rem;
        word-break: break-all;
      }

      .masthead {
        margin-bottom: 3rem;
      }

      .archive-title {
        font-size: clamp(2.25rem, 12vw, 3rem);
      }

      .archive-subtitle {
        font-size: 1rem;
      }
    }

    @media (max-width: 480px) {
      .channel {
        grid-template-columns: 50px 1fr 24px;
        gap: 1rem;
        padding: 1.25rem 0.5rem;
      }
      .channel-num {
        font-size: 1.75rem;
      }
      .channel-label {
        font-size: 1.1rem;
      }
      .channel-tag {
        font-size: 0.55rem;
        letter-spacing: 0.2em;
      }
      .closing {
        margin-top: 2.5rem;
        padding-top: 2rem;
      }
      .masthead-rule::before {
        flex: 0 0 30px;
      }
      .rule-tag {
        font-size: 0.6rem;
      }
    }
  `,
})
export class ContactComponent {
  readonly links: ContactLink[] = [
    {
      channel: 'PROFESSIONAL',
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/corey-musa/',
      urlText: 'linkedin.com/in/corey-musa',
      icon: '',
    },
    {
      channel: 'DIRECT',
      label: 'Electronic Mail',
      url: 'mailto:coreymusa@outlook.com',
      urlText: 'coreymusa@outlook.com',
      icon: '',
    },
  ];

  pad(n: number): string {
    return n.toString().padStart(2, '0');
  }
}
