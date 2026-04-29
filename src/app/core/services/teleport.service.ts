import { Injectable, signal } from '@angular/core';
import { Project } from '../models/project.model';

/** A single dice-driven teleport request from the oracle to a project entry. */
export interface TeleportRequest {
  /** The project to teleport to. */
  project: Project;
  /** 0-based index of the project in the PROJECTS array. */
  projectIndex: number;
  /** Roman numeral I–VIII for the dice face the rolled landed on. */
  faceNumeral: string;
  /** Bounding rect of the source dice (viewport coords) at trigger time. */
  sourceRect: DOMRect;
  /** Project's themed accent colour, used to tint the teleport pit. */
  accent: string;
}

/**
 * Coordinates the cinematic transition from the dice oracle to a project card.
 * Produces a single `request` signal which `TeleportOverlayComponent` listens
 * to; once the overlay has finished its animation it calls `clear()`.
 */
@Injectable({ providedIn: 'root' })
export class TeleportService {
  readonly request = signal<TeleportRequest | null>(null);

  summon(req: TeleportRequest): void {
    this.request.set(req);
  }

  clear(): void {
    this.request.set(null);
  }
}
