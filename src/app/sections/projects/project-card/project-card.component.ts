import { Component, input } from '@angular/core';
import { Project, TechItem } from '../../../core/models/project.model';

@Component({
  selector: 'app-project-card',
  standalone: true,
  template: `
    <article class="card">
      <div class="header">
        <svg
          class="project-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          [innerHTML]="project().icon"
        ></svg>
        <h3 class="title">{{ project().title }}</h3>
        @if (project().liveUrl) {
          <a
            class="live-link"
            [href]="project().liveUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Live
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        }
      </div>

      <p class="tagline">{{ project().tagline }}</p>

      <p class="description">{{ project().description }}</p>

      <div class="tech-stack">
        @for (tech of project().techStack; track tech.name) {
          <span class="pill" [class]="'pill pill--' + tech.category">
            {{ tech.name }}
          </span>
        }
      </div>

      <ul class="features">
        @for (feature of project().features; track feature) {
          <li class="feature-item">
            <svg
              class="check-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#16a34a"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span>{{ feature }}</span>
          </li>
        }
      </ul>
    </article>
  `,
  styles: [`
    :host {
      display: block;
    }

    .card {
      background: #ffffff;
      border: none;
      border-radius: 20px;
      padding: 28px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      height: 100%;
      box-sizing: border-box;
    }

    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04);
    }

    .header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.5rem;
    }

    .project-icon {
      color: #111827;
      flex-shrink: 0;
    }

    .title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #111827;
      flex: 1;
      min-width: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    .live-link {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.75rem;
      color: #9ca3af;
      white-space: nowrap;
      flex-shrink: 0;
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .live-link:hover {
      color: #111827;
    }

    .live-link:focus-visible {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
      border-radius: 4px;
    }

    .tagline {
      color: #6b7280;
      font-size: 0.8125rem;
      margin-bottom: 0.75rem;
    }

    .description {
      color: #6b7280;
      font-size: 0.875rem;
      line-height: 1.7;
      margin-bottom: 1.25rem;
    }

    .tech-stack {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1.25rem;
    }

    .pill {
      font-size: 0.75rem;
      padding: 4px 10px;
      border-radius: 8px;
      font-weight: 500;
    }

    .pill--frontend {
      background: #dbeafe;
      color: #2563eb;
    }

    .pill--backend {
      background: #ede9fe;
      color: #7c3aed;
    }

    .pill--database {
      background: #dcfce7;
      color: #16a34a;
    }

    .pill--infra {
      background: #e2e8f0;
      color: #475569;
    }

    .pill--api {
      background: #fff7ed;
      color: #ea580c;
    }

    .features {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 0;
      margin: 0;
    }

    .feature-item {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      color: #6b7280;
      font-size: 0.8125rem;
      line-height: 1.5;
    }

    .check-icon {
      flex-shrink: 0;
      margin-top: 2px;
    }
  `],
})
export class ProjectCardComponent {
  project = input.required<Project>();
}
