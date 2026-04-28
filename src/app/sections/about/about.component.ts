import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="about" class="section about">
      <div class="container">
        <header class="masthead">
          <div class="masthead-rule">
            <span class="rule-tag">CHAPTER TWO</span>
          </div>
          <h2 class="archive-title">
            <em>About the</em> Author
          </h2>
        </header>

        <div class="about-grid">
          <!-- Left: Bio -->
          <article class="bio">
            <p class="bio-p">
              Nine years in software, all within
              <span class="emph">fintech and banking</span>.
              Associate Director at twenty-seven. Learned not just how to
              write software, but how to communicate ideas, formalise
              processes, and drive delivery across distributed teams.
            </p>
            <p class="bio-p">
              When AI emerged, it reignited a passion for building. I've
              shipped <span class="emph">three AI-powered platforms solo</span>
              in six months — all live, all generating revenue. Combined with
              deep enterprise experience and architectural thinking, I build
              software that's both <span class="emph">technically sound and
              commercially real</span>.
            </p>
            <a class="cv-link" routerLink="/cv">
              <span class="visit-arrow">→</span>
              <span>read full curriculum vitae</span>
            </a>
          </article>

          <!-- Right: Stats column -->
          <aside class="stats-column">
            <div class="stats-header">
              <span class="meta-num">i.</span>
              <span class="meta-label">at a glance</span>
            </div>
            <dl class="stats-list">
              @for (stat of stats; track stat.label; let i = $index) {
                <div class="stat-row">
                  <dt class="stat-label">
                    <span class="stat-num">{{ pad(i + 1) }}</span>
                    {{ stat.label }}
                  </dt>
                  <dd class="stat-value">{{ stat.value }}</dd>
                </div>
              }
            </dl>
          </aside>
        </div>
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .about {
      background: var(--ink);
    }

    /* Masthead — same as projects */
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
    }

    .archive-title em {
      font-style: italic;
      font-weight: 200;
      color: var(--text-mute);
      font-size: 0.7em;
      margin-right: 0.25rem;
    }

    /* Grid */
    .about-grid {
      display: grid;
      grid-template-columns: 1.3fr 1fr;
      gap: 5rem;
      align-items: start;
    }

    /* Bio */
    .bio-p {
      font-family: var(--font-display);
      font-size: 1.15rem;
      line-height: 1.8;
      color: var(--text);
      margin-bottom: 1.5rem;
      max-width: 60ch;
    }

    .bio-p:first-of-type::first-letter {
      font-family: var(--font-display);
      font-variation-settings: 'opsz' 144, 'WONK' 1;
      font-size: 3.5em;
      float: left;
      line-height: 0.85;
      margin-right: 0.6rem;
      margin-top: 0.4rem;
      color: var(--ember);
      font-weight: 400;
    }

    .emph {
      color: var(--paper);
      font-weight: 500;
      font-style: italic;
    }

    .cv-link {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: 1.5rem;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      letter-spacing: 0.05em;
      color: var(--text);
      text-transform: uppercase;
      transition: color 0.3s;
      position: relative;
      padding-bottom: 0.25rem;
    }

    .cv-link::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: var(--ember);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.4s cubic-bezier(0.65, 0, 0.35, 1);
    }

    .cv-link:hover {
      color: var(--ember);
    }

    .cv-link:hover::after {
      transform: scaleX(1);
    }

    .visit-arrow {
      font-size: 1.2rem;
      color: var(--ember);
      transition: transform 0.3s;
    }

    .cv-link:hover .visit-arrow {
      transform: translateX(4px);
    }

    /* Stats column */
    .stats-column {
      border: 1px solid var(--rule);
      padding: 2rem;
      background: linear-gradient(180deg, var(--ink-warm) 0%, transparent 100%);
    }

    .stats-header {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--rule);
    }

    .meta-num {
      font-family: var(--font-display);
      font-style: italic;
      font-size: 0.95rem;
      color: var(--brass);
    }

    .meta-label {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--text-mute);
    }

    .stats-list {
      display: flex;
      flex-direction: column;
    }

    .stat-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      padding: 1rem 0;
      border-bottom: 1px dashed var(--rule);
    }

    .stat-row:last-child {
      border-bottom: none;
    }

    .stat-label {
      display: flex;
      align-items: baseline;
      gap: 0.6rem;
      font-family: var(--font-display);
      font-style: italic;
      font-size: 1rem;
      color: var(--text);
    }

    .stat-num {
      font-family: var(--font-mono);
      font-size: 0.65rem;
      color: var(--brass-mute);
      letter-spacing: 0.15em;
      font-style: normal;
    }

    .stat-value {
      font-family: var(--font-display);
      font-variation-settings: 'opsz' 144, 'WONK' 1;
      font-size: 2.5rem;
      font-weight: 400;
      color: var(--ember);
      letter-spacing: -0.03em;
      line-height: 1;
    }

    @media (max-width: 900px) {
      .about-grid {
        grid-template-columns: 1fr;
        gap: 3rem;
      }
      .masthead {
        margin-bottom: 3rem;
      }
      .stat-value {
        font-size: 2rem;
      }
    }

    @media (max-width: 640px) {
      .archive-title {
        font-size: clamp(2.25rem, 12vw, 3rem);
      }
      .bio-p {
        font-size: 1rem;
        line-height: 1.7;
      }
      .stats-column {
        padding: 1.5rem;
      }
      .stat-value {
        font-size: 1.5rem;
      }
      .stat-row {
        padding: 0.75rem 0;
      }
      .stat-label {
        font-size: 0.9rem;
      }
    }

    @media (max-width: 480px) {
      .bio-p:first-of-type::first-letter {
        font-size: 2.5em;
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
export class AboutComponent {
  readonly stats = [
    { value: '9', label: 'Years in software' },
    { value: '3', label: 'AI platforms shipped' },
    { value: '8', label: 'Production projects' },
    { value: 'AD', label: 'Associate Director' },
  ];

  pad(n: number): string {
    return n.toString().padStart(2, '0');
  }
}
