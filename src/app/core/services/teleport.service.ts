import { Injectable, signal } from '@angular/core';
import { Project } from '../models/project.model';

/** Which kind of "spectral object" rises and plummets through the portal. */
export type GhostKind = 'face' | 'card';

/** A single oracle-driven teleport request from a chooser to a project entry. */
export interface TeleportRequest {
  /** The project to teleport to. */
  project: Project;
  /** 0-based index of the project in the PROJECTS array. */
  projectIndex: number;
  /** Roman numeral I–VIII for the rolled / drawn entry. */
  faceNumeral: string;
  /** Bounding rect of the source object (dice / card) at trigger time. */
  sourceRect: DOMRect;
  /** Project's themed accent colour, used to tint the teleport pit. */
  accent: string;
  /** Triangular dice face vs rectangular tarot card. */
  ghostKind: GhostKind;
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
