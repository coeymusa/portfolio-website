import { Component } from '@angular/core';
import { HeroComponent } from '../../sections/hero/hero.component';
import { ProjectsComponent } from '../../sections/projects/projects.component';
import { AboutComponent } from '../../sections/about/about.component';
import { ContactComponent } from '../../sections/contact/contact.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, ProjectsComponent, AboutComponent, ContactComponent],
  template: `
    <app-hero />
    <app-projects />
    <app-about />
    <app-contact />
  `,
})
export class HomeComponent {}
