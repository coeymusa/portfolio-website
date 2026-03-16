import { Component, ChangeDetectionStrategy } from '@angular/core';

interface ContactLink {
  label: string;
  url: string;
  urlText: string;
  icon: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="contact" class="section">
      <div class="container">
        <h2 class="section-heading">Get in Touch</h2>
        <p class="subtitle">Interested in working together? Reach out.</p>

        <div class="links-row">
          @for (link of links; track link.label) {
            <a
              class="link-card"
              [href]="link.url"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div class="icon-circle">
                <svg
                  class="link-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  [innerHTML]="link.icon"
                ></svg>
              </div>
              <span class="link-label">{{ link.label }}</span>
              <span class="link-url">{{ link.urlText }}</span>
            </a>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .section-heading {
      font-size: 1.5rem;
      font-weight: 700;
      color: #111827;
      text-align: center;
      margin-bottom: 0.75rem;
    }

    .subtitle {
      text-align: center;
      color: #9ca3af;
      font-size: 0.9375rem;
      margin-bottom: 2.5rem;
    }

    .links-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .link-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      background: #ffffff;
      border: 1px solid rgba(0, 0, 0, 0.04);
      border-radius: 20px;
      padding: 32px;
      cursor: pointer;
      text-decoration: none;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
      transition: box-shadow 0.25s ease, transform 0.25s ease;
    }

    .link-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04);
    }

    .link-card:focus-visible {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }

    .icon-circle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #f9fafb;
      transition: background 0.25s ease;
    }

    .link-card:hover .icon-circle {
      background: #f3f4f6;
    }

    .link-icon {
      color: #9ca3af;
      transition: color 0.25s ease;
    }

    .link-card:hover .link-icon {
      color: #111827;
    }

    .link-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: #111827;
    }

    .link-url {
      font-size: 0.75rem;
      color: #9ca3af;
    }

    @media (max-width: 600px) {
      .links-row {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class ContactComponent {
  readonly links: ContactLink[] = [
    {
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/corey-musa/',
      urlText: 'linkedin.com/in/corey-musa',
      icon: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
    },
    {
      label: 'Email',
      url: 'mailto:coreymusa@outlook.com',
      urlText: 'coreymusa@outlook.com',
      icon: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
    },
    {
      label: 'Instagram',
      url: 'https://instagram.com/coreym96',
      urlText: '@coreym96',
      icon: '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>',
    },
  ];
}
