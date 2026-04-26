import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DiceRollerComponent } from './dice-roller/dice-roller.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [DiceRollerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="hero" class="hero">
      <!-- Top folio bar -->
      <header class="folio-top">
        <span class="folio-mono">CODEX · VOL. I</span>
        <span class="folio-rule"></span>
        <span class="folio-mono">EST. MMXVII</span>
      </header>

      <!-- Asymmetric main content -->
      <div class="hero-grid">
        <!-- Left: marginalia -->
        <aside class="marginalia">
          <span class="folio-num">№ 01</span>
          <div class="margin-meta">
            <span class="meta-label">subject</span>
            <span class="meta-value">portfolio</span>
          </div>
          <div class="margin-meta">
            <span class="meta-label">archivist</span>
            <span class="meta-value">corey musa</span>
          </div>
          <div class="margin-meta">
            <span class="meta-label">discipline</span>
            <span class="meta-value">full-stack engineering</span>
          </div>
        </aside>

        <!-- Center: title -->
        <div class="title-block">
          <p class="eyebrow">an archive of the works of</p>
          <h1 class="display-name">
            <span class="given">Corey</span>
            <span class="surname">Musa<em class="period">.</em></span>
          </h1>
          <h2 class="cave-title">
            <span class="cave-prefix">the</span>
            <span class="cave-word">Code Cave</span>
          </h2>

          <div class="abstract-rule"><span>ABSTRACT</span></div>

          <p class="abstract">
            A curated archive of seven entries — AI-driven
            <em>SaaS platforms</em>, fintech systems, machine-learning pipelines,
            and consultancy services. Built solo. Shipped in production.
            Collected, here, in one place.
          </p>

          <div class="cta-row">
            <button class="btn-primary" (click)="scrollToProjects()">
              <span>Begin Reading</span>
              <span class="btn-arrow">↓</span>
            </button>
            <a class="btn-ghost" href="#contact" (click)="scrollToContact($event)">
              <span class="mono">$</span> initiate contact
            </a>
          </div>
        </div>

        <!-- Right: dice + index sidebar -->
        <aside class="index-sidebar">
          <app-dice-roller />

          <div class="status-pulse">
            <span class="pulse-dot"></span>
            <span class="status-text">accepting commissions</span>
          </div>
        </aside>
      </div>

      <!-- Bottom rule + scroll indicator -->
      <footer class="folio-bot">
        <span class="folio-mono">[ scroll to explore ]</span>
      </footer>
    </section>
  `,
  styles: [`
    :host {
      display: block;
      position: relative;
    }

    .hero {
      position: relative;
      min-height: 100vh;
      padding: 6rem 2rem 3rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 3rem;
    }

    /* Folio bars */
    .folio-top, .folio-bot {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      font-family: var(--font-mono);
      font-size: 0.7rem;
      letter-spacing: 0.2em;
      color: var(--text-mute);
      text-transform: uppercase;
    }

    .folio-bot {
      justify-content: center;
    }

    .folio-rule {
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, var(--rule), var(--rule-light), var(--rule));
    }

    .folio-mono {
      white-space: nowrap;
    }

    /* Asymmetric grid */
    .hero-grid {
      display: grid;
      grid-template-columns: 160px minmax(0, 1fr) 200px;
      gap: 2.5rem;
      align-items: start;
      flex: 1;
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
      box-sizing: border-box;
    }

    /* Marginalia (left sidebar) */
    .marginalia {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding-top: 2rem;
      border-right: 1px solid var(--rule);
      padding-right: 1.5rem;
      animation: fadeIn 1.2s ease 0.2s both;
    }

    .folio-num {
      font-family: var(--font-display);
      font-style: italic;
      font-size: 3rem;
      font-weight: 300;
      color: var(--ember);
      line-height: 1;
      letter-spacing: -0.03em;
    }

    .margin-meta {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .meta-label {
      font-family: var(--font-mono);
      font-size: 0.65rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--text-faint);
    }

    .meta-value {
      font-family: var(--font-display);
      font-size: 0.95rem;
      font-style: italic;
      color: var(--text);
    }

    /* Title block (center) */
    .title-block {
      max-width: 760px;
      animation: rise 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) both;
    }

    .eyebrow {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--brass);
      margin-bottom: 1.5rem;
      font-weight: 500;
    }

    .display-name {
      font-family: var(--font-display);
      font-variation-settings: 'opsz' 144, 'SOFT' 50, 'WONK' 1;
      font-size: clamp(3rem, 9vw, 7rem);
      line-height: 0.9;
      font-weight: 300;
      letter-spacing: -0.04em;
      color: var(--paper);
      margin-bottom: 0.5rem;
    }

    .display-name .given {
      display: block;
      font-style: italic;
      font-weight: 200;
    }

    .display-name .surname {
      display: block;
      font-weight: 500;
    }

    .display-name .period {
      color: var(--ember);
      font-style: normal;
    }

    .cave-title {
      font-family: var(--font-display);
      font-variation-settings: 'opsz' 144, 'WONK' 1;
      font-size: clamp(1.5rem, 3vw, 2.25rem);
      font-weight: 300;
      color: var(--text-mute);
      letter-spacing: -0.01em;
      margin-bottom: 3rem;
      display: flex;
      align-items: baseline;
      gap: 0.6rem;
      flex-wrap: wrap;
    }

    .cave-prefix {
      font-style: italic;
      font-weight: 200;
      font-size: 0.75em;
      color: var(--text-faint);
    }

    .cave-word {
      color: var(--ember);
      font-weight: 400;
      font-style: italic;
      letter-spacing: -0.02em;
    }

    .abstract-rule {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.25rem;
      color: var(--rule-light);
    }

    .abstract-rule span {
      font-family: var(--font-mono);
      font-size: 0.65rem;
      letter-spacing: 0.25em;
      color: var(--brass-mute);
    }

    .abstract-rule::before,
    .abstract-rule::after {
      content: '';
      height: 1px;
      background: var(--rule);
    }

    .abstract-rule::before { width: 24px; }
    .abstract-rule::after { flex: 1; }

    .abstract {
      font-family: var(--font-display);
      font-size: clamp(1.05rem, 1.4vw, 1.25rem);
      line-height: 1.7;
      color: var(--text);
      max-width: 60ch;
      margin-bottom: 2.5rem;
    }

    .abstract em {
      color: var(--paper);
      font-style: italic;
    }

    /* CTAs */
    .cta-row {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.95rem 1.75rem;
      background: var(--ember);
      color: var(--ink);
      border: none;
      font-family: var(--font-mono);
      font-size: 0.85rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .btn-primary::before {
      content: '';
      position: absolute;
      inset: 0;
      background: var(--paper);
      transform: translateY(100%);
      transition: transform 0.4s cubic-bezier(0.65, 0, 0.35, 1);
      z-index: 0;
    }

    .btn-primary span {
      position: relative;
      z-index: 1;
    }

    .btn-primary:hover {
      box-shadow: 0 0 30px var(--ember-glow);
    }

    .btn-primary:hover::before {
      transform: translateY(0);
    }

    .btn-arrow {
      display: inline-block;
      animation: bob 2s ease-in-out infinite;
    }

    .btn-ghost {
      font-family: var(--font-mono);
      font-size: 0.85rem;
      color: var(--text-mute);
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--rule-light);
      padding-bottom: 0.25rem;
      transition: color 0.3s, border-color 0.3s;
    }

    .btn-ghost:hover {
      color: var(--ember);
      border-color: var(--ember);
    }

    .btn-ghost .mono {
      color: var(--ember);
    }

    /* Index sidebar (right) */
    .index-sidebar {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      padding-top: 2rem;
      padding-left: 1.25rem;
      border-left: 1px solid var(--rule);
      animation: fadeIn 1.2s ease 0.4s both;
      min-width: 0;
      overflow: hidden;
    }

    .index-sidebar app-dice-roller {
      display: block;
      width: 100%;
    }

    .index-header {
      font-family: var(--font-mono);
      font-size: 0.65rem;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--brass-mute);
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--rule);
    }

    .index-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      font-family: var(--font-display);
      font-size: 0.95rem;
      color: var(--text);
      font-style: italic;
    }

    .index-list .num {
      display: inline-block;
      width: 1.75rem;
      color: var(--brass);
      font-style: normal;
      font-family: var(--font-mono);
      font-size: 0.75rem;
    }

    .status-pulse {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      margin-top: auto;
      padding-top: 1rem;
      border-top: 1px solid var(--rule);
      font-family: var(--font-mono);
      font-size: 0.7rem;
      color: var(--text-mute);
      letter-spacing: 0.05em;
    }

    .pulse-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--ember);
      box-shadow: 0 0 0 0 var(--ember);
      animation: pulse 2.4s ease-in-out infinite;
    }

    /* Animations */
    @keyframes rise {
      from { opacity: 0; transform: translateY(28px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    @keyframes pulse {
      0%, 100% { box-shadow: 0 0 0 0 var(--ember-glow); }
      50%      { box-shadow: 0 0 0 6px transparent; }
    }

    @keyframes bob {
      0%, 100% { transform: translateY(0); }
      50%      { transform: translateY(3px); }
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .hero {
        padding: 5rem 1.5rem 2rem;
      }
      .hero-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      .marginalia, .index-sidebar {
        border: none;
        padding: 1rem 0;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 1rem 2rem;
        border-top: 1px solid var(--rule);
        border-bottom: 1px solid var(--rule);
      }
      .index-sidebar {
        align-items: center;
      }
      .folio-num {
        font-size: 2rem;
      }
      .folio-top, .folio-bot {
        font-size: 0.6rem;
        gap: 0.75rem;
      }
    }

    @media (max-width: 640px) {
      .hero {
        padding: 4.5rem 1.25rem 1.5rem;
        gap: 2rem;
      }
      .display-name {
        font-size: clamp(2.5rem, 14vw, 4rem);
        line-height: 0.95;
      }
      .cave-title {
        font-size: clamp(1.25rem, 5vw, 1.75rem);
        margin-bottom: 2rem;
      }
      .abstract {
        font-size: 1rem;
        line-height: 1.65;
      }
      .marginalia, .index-sidebar {
        gap: 0.75rem 1.5rem;
        padding: 0.75rem 0;
      }
      .index-sidebar {
        flex-direction: column;
        align-items: stretch;
      }
      .cta-row {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
      }
      .btn-primary {
        width: 100%;
        justify-content: center;
      }
      .btn-ghost {
        text-align: center;
      }
      .folio-top {
        flex-wrap: nowrap;
      }
      .folio-top .folio-mono {
        font-size: 0.55rem;
      }
      .folio-rule {
        display: none;
      }
    }
  `],
})
export class HeroComponent {
  scrollToProjects(): void {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToContact(event: Event): void {
    event.preventDefault();
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }
}
