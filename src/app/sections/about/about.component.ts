import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="about" class="section">
      <div class="container">
        <h2 class="section-heading">About</h2>

        <div class="about-grid">
          <div class="bio-card">
            <p>
              Nine years in software, all within <strong>fintech and banking</strong>.
              Associate Director at 27. Learned not just how to write software but
              how to communicate ideas, formalise processes, and drive delivery
              across distributed teams.
            </p>
            <p>
              When AI emerged, it reignited my passion for building. I've shipped
              <strong>three AI-powered platforms solo</strong> in six months, all
              live and generating revenue. Combined with deep enterprise experience
              and architectural thinking, I build software that's both
              <strong>technically sound and commercially real</strong>.
            </p>
            <a class="cv-link" routerLink="/cv">
              Read full CV
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </a>
          </div>

          <div class="stats-grid">
            @for (stat of stats; track stat.label) {
              <div class="stat-card">
                <span class="stat-number">{{ stat.value }}</span>
                <span class="stat-label">{{ stat.label }}</span>
              </div>
            }
          </div>
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
      margin-bottom: 2.5rem;
    }

    .about-grid {
      display: grid;
      grid-template-columns: 3fr 2fr;
      gap: 16px;
      align-items: start;
    }

    .bio-card {
      background: #ffffff;
      border-radius: 20px;
      padding: 28px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
    }

    .bio-card p {
      color: #6b7280;
      font-size: 0.9375rem;
      line-height: 1.75;
      margin-bottom: 1rem;
    }

    .bio-card p:last-child {
      margin-bottom: 0;
    }

    .bio-card strong {
      color: #111827;
      font-weight: 600;
    }

    .cv-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-top: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      color: #9ca3af;
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .cv-link:hover {
      color: #111827;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .stat-card {
      background: #ffffff;
      border-radius: 20px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: 700;
      color: #111827;
      line-height: 1.2;
    }

    .stat-label {
      color: #9ca3af;
      font-size: 0.8125rem;
    }

    @media (max-width: 768px) {
      .about-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }
    }
  `,
})
export class AboutComponent {
  readonly stats = [
    { value: '9', label: 'Years in Software' },
    { value: '3', label: 'AI Platforms Shipped' },
    { value: '5', label: 'Production Apps' },
    { value: 'AD', label: 'Associate Director' },
  ];
}
