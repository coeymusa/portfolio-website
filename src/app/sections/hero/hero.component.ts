import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="hero" class="hero">
      <div class="content">
        <div class="avatar">
          <span class="avatar-initials">CM</span>
        </div>
        <h1 class="name">Corey</h1>
        <p class="role">Full-Stack Software Engineer</p>
        <p class="tagline">
          Building SaaS platforms, enterprise systems, and AI-powered
          applications with Angular, React, Spring Boot, and modern web technologies.
        </p>
        <div class="status">
          <span class="status-dot"></span>
          <span class="status-text">Available for opportunities</span>
        </div>
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
      padding: 140px 24px 80px;
    }

    .content {
      text-align: center;
      max-width: 720px;
    }

    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #111827, #374151);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      box-shadow:
        0 4px 12px rgba(0, 0, 0, 0.15),
        0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .avatar-initials {
      color: #ffffff;
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: 0.02em;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
        sans-serif;
    }

    .name {
      font-size: clamp(2.75rem, 7vw, 4.5rem);
      font-weight: 700;
      line-height: 1.1;
      margin: 0 0 16px 0;
      color: #111827;
      letter-spacing: -0.04em;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
        sans-serif;
    }

    .role {
      font-size: clamp(1rem, 2vw, 1.25rem);
      font-weight: 600;
      color: #4b5563;
      margin: 0 0 16px 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
        sans-serif;
    }

    .tagline {
      font-size: 1rem;
      color: #9ca3af;
      line-height: 1.7;
      margin: 0 auto;
      max-width: 560px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
        sans-serif;
    }

    .status {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 24px;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #22c55e;
      flex-shrink: 0;
    }

    .status-text {
      font-size: 0.875rem;
      color: #9ca3af;
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
