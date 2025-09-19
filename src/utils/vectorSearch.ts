import resources from '@/resources.json';

interface Resource {
  id: string;
  title: string;
  type: string;
  category: string;
  description: string;
  url: string;
  tags: string[];
}

class VectorSearch {
  private resources: Resource[] = [];

  async initialize() {
    if (this.resources.length > 0) return; // Already initialized

    this.resources = resources as Resource[];
  }

  async search(query: string, k: number = 5): Promise<Resource[]> {
    await this.initialize();
    
    // Simple text-based search
    const queryLower = query.toLowerCase();
    
    const scoredResources = this.resources.map(resource => {
      let score = 0;
      
      // Check title match
      if (resource.title.toLowerCase().includes(queryLower)) {
        score += 3;
      }
      
      // Check description match
      if (resource.description.toLowerCase().includes(queryLower)) {
        score += 2;
      }
      
      // Check tags match
      resource.tags.forEach(tag => {
        if (tag.toLowerCase().includes(queryLower)) {
          score += 1;
        }
      });
      
      // Check category match
      if (resource.category.toLowerCase().includes(queryLower)) {
        score += 1;
      }
      
      return { resource, score };
    });

    // Sort by score and return top k
    return scoredResources
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, k)
      .map(item => item.resource);
  }

  getResourceById(id: string): Resource | undefined {
    return this.resources.find(resource => resource.id === id);
  }

  getAllResources(): Resource[] {
    return this.resources;
  }
}

// Export singleton instance
export const vectorSearch = new VectorSearch();
