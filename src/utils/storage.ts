// Simple in-memory storage for roadmaps
// In production, replace with a proper database like PostgreSQL, MongoDB, or Redis

interface Roadmap {
  id: string;
  goal: string;
  background?: string;
  timeline?: string;
  weaknesses?: string[];
  milestones: Array<{ id: string; title: string; description: string; tasks: string[]; resource_links: Array<{ title: string; url: string; resource_id: string }>; estimated_duration: string }>;
  generated_at: string;
}

class RoadmapStorage {
  private roadmaps = new Map<string, Roadmap>();

  store(roadmap: Roadmap): void {
    this.roadmaps.set(roadmap.id, roadmap);
  }

  get(id: string): Roadmap | undefined {
    return this.roadmaps.get(id);
  }

  has(id: string): boolean {
    return this.roadmaps.has(id);
  }

  delete(id: string): boolean {
    return this.roadmaps.delete(id);
  }

  getAll(): Roadmap[] {
    return Array.from(this.roadmaps.values());
  }

  clear(): void {
    this.roadmaps.clear();
  }
}

// Export singleton instance
export const roadmapStorage = new RoadmapStorage();
