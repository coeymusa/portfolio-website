import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="hero" class="hero">
      <div class="content">
        <h1 class="name">Corey</h1>
        <p class="role">Full-Stack Software Engineer</p>
        <p class="tagline">
          Building SaaS platforms, enterprise systems, and AI-powered
          applications with Angular, React, Spring Boot, and modern web technologies.
        </p>
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .hero {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 120px 24px 60px;
    }

    .content {
      text-align: center;
      max-width: 720px;
    }

    .name {
      font-size: clamp(2.5rem, 6vw, 4rem);
      font-weight: 700;
      line-height: 1.1;
      margin: 0 0 16px 0;
      color: #111827;
      letter-spacing: -0.03em;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
        sans-serif;
    }

    .role {
      font-size: clamp(1rem, 2vw, 1.25rem);
      font-weight: 500;
      color: #6b7280;
      margin: 0 0 16px 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
        sans-serif;
    }

    .tagline {
      font-size: 1rem;
      color: #9ca3af;
      line-height: 1.7;
      margin: 0 auto;
      max-width: 520px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
        sans-serif;
    }
  `,
})
export class HeroComponent {
  scrollToProjects(): void {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  }
}
