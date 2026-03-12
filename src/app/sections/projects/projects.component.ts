import { Component, computed, signal } from '@angular/core';
import {
  CATEGORY_LABELS,
  PROJECTS,
  ProjectCategory,
} from '../../core/models/project.model';
import { ProjectCardComponent } from './project-card/project-card.component';

type FilterValue = ProjectCategory | 'all';

interface FilterChip {
  value: FilterValue;
  label: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [ProjectCardComponent],
  template: `
    <section id="projects" class="section">
      <div class="container">
        <h2 class="section-heading">Projects</h2>

        <div class="filter-row">
          @for (chip of filterChips; track chip.value) {
            <button
              class="chip"
              [class.chip--active]="activeFilter() === chip.value"
              (click)="activeFilter.set(chip.value)"
            >
              {{ chip.label }}
            </button>
          }
        </div>

        <div class="project-grid">
          @for (project of filteredProjects(); track project.id) {
            <app-project-card [project]="project" />
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .section {
      padding: 4rem 1.5rem;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .section-heading {
      font-size: 1.5rem;
      font-weight: 700;
      color: #111827;
      text-align: center;
      margin-bottom: 1.5rem;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    .filter-row {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 2rem;
    }

    .chip {
      padding: 8px 16px;
      border-radius: 9999px;
      font-size: 0.8125rem;
      font-weight: 500;
      border: none;
      background: #f3f4f6;
      color: #6b7280;
      cursor: pointer;
      transition: background 0.2s ease, color 0.2s ease;
      font-family: inherit;
    }

    .chip:hover:not(.chip--active) {
      background: #e5e7eb;
    }

    .chip:focus-visible {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }

    .chip--active {
      background: #111827;
      color: #ffffff;
    }

    .project-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .project-grid app-project-card:first-child {
      grid-column: span 2;
    }

    @media (max-width: 1024px) {
      .project-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .project-grid app-project-card:first-child {
        grid-column: span 2;
      }
    }

    @media (max-width: 768px) {
      .project-grid {
        grid-template-columns: 1fr;
      }

      .project-grid app-project-card:first-child {
        grid-column: span 1;
      }
    }
  `],
})
export class ProjectsComponent {
  readonly filterChips: FilterChip[] = [
    { value: 'all', label: 'All' },
    ...Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
      value: value as ProjectCategory,
      label,
    })),
  ];

  activeFilter = signal<FilterValue>('all');

  filteredProjects = computed(() => {
    const filter = this.activeFilter();
    return filter === 'all'
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === filter);
  });
}
