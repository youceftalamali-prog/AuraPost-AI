import { logger } from "../core/observability/logger.ts";
import { generateTemplateLibrary, VideoTemplate } from "./template-library.ts";

class TemplatesLoader {
  private templates: Map<string, VideoTemplate> = new Map();
  private categories: Map<string, Set<string>> = new Map();
  private industries: Set<string> = new Set();
  private loaded = false;

  async loadTemplates(): Promise<void> {
    if (this.loaded) return;

    try {
      const allTemplates = generateTemplateLibrary();

      for (const template of allTemplates) {
        this.templates.set(template.id, template);
        const catName = template.category;
        if (!this.categories.has(catName)) {
          this.categories.set(catName, new Set());
        }
        this.categories.get(catName)!.add(template.industry);
        this.industries.add(template.industry);
      }

      this.loaded = true;
      logger.info(
        { count: this.templates.size, categories: this.categories.size, industries: this.industries.size },
        "Video templates loaded successfully"
      );
    } catch (err: any) {
      logger.error({ err }, "Failed to load video templates");
      throw err;
    }
  }

  getTemplate(id: string): VideoTemplate | undefined {
    return this.templates.get(id);
  }

  getAllTemplates(): VideoTemplate[] {
    return Array.from(this.templates.values());
  }

  getTemplatesByCategory(category: string): VideoTemplate[] {
    return Array.from(this.templates.values()).filter((t) => t.category === category);
  }

  getTemplatesByIndustry(industry: string): VideoTemplate[] {
    return Array.from(this.templates.values()).filter((t) => t.industry === industry);
  }

  getCategories(): { name: string; count: number; industries: string[] }[] {
    return Array.from(this.categories.entries())
      .map(([name, industries]) => ({
        name,
        count: Array.from(this.templates.values()).filter((t) => t.category === name).length,
        industries: Array.from(industries).sort(),
      }))
      .sort((a, b) => b.count - a.count);
  }

  getIndustries(): string[] {
    return Array.from(this.industries).sort();
  }

  getTemplateCount(): number {
    return this.templates.size;
  }

  getCategoryCount(): number {
    return this.categories.size;
  }

  getTags(): string[] {
    const allTags = new Set<string>();
    for (const template of this.templates.values()) {
      for (const tag of template.tags) {
        allTags.add(tag);
      }
    }
    return Array.from(allTags).sort();
  }

  searchTemplates(query: string): VideoTemplate[] {
    const lower = query.toLowerCase();
    return Array.from(this.templates.values()).filter(
      (t) =>
        t.title.toLowerCase().includes(lower) ||
        t.description.toLowerCase().includes(lower) ||
        t.tags.some((tag) => tag.toLowerCase().includes(lower)) ||
        t.industry.toLowerCase().includes(lower) ||
        t.category.toLowerCase().includes(lower)
    );
  }

  getPopularTemplates(limit: number = 20): VideoTemplate[] {
    return Array.from(this.templates.values())
      .sort((a, b) => (b.creditCost || 0) - (a.creditCost || 0))
      .slice(0, limit);
  }

  getTemplatesByProvider(provider: string): VideoTemplate[] {
    return Array.from(this.templates.values()).filter((t) =>
      t.providers.includes(provider as any)
    );
  }

  getTemplatesByTag(tag: string): VideoTemplate[] {
    return Array.from(this.templates.values()).filter((t) =>
      t.tags.includes(tag.toLowerCase())
    );
  }
}

export const templatesLoader = new TemplatesLoader();
