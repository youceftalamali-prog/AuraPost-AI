import { Express, Request, Response } from "express";
import { templatesLoader, VideoTemplate } from "./templates-loader.ts";
import { logger } from "../core/observability/logger.ts";

interface TemplateRatingStore {
  [templateId: string]: {
    workspaceId: string;
    rating: number;
    review?: string;
    createdAt: string;
  }[];
}

interface FavoriteStore {
  [workspaceId: string]: string[];
}

interface CollectionStore {
  [workspaceId: string]: Array<{
    id: string;
    name: string;
    description?: string;
    templateIds: string[];
    createdAt: string;
    updatedAt: string;
  }>;
}

interface AnalyticsStore {
  [templateId: string]: {
    totalRenders: number;
    completedRenders: number;
    failedRenders: number;
    totalRating: number;
    totalRatings: number;
    providerUsage: Record<string, number>;
    totalDuration: number;
  };
}

const ratings: TemplateRatingStore = {};
const favorites: FavoriteStore = {};
const collections: CollectionStore = {};
const analytics: AnalyticsStore = {};

export async function initializeTemplateRoutes(app: Express): Promise<void> {
  try {
    await templatesLoader.loadTemplates();
    logger.info(
      { templateCount: templatesLoader.getTemplateCount(), categoryCount: templatesLoader.getCategoryCount() },
      "Template loader initialized successfully"
    );
  } catch (err: any) {
    logger.error({ err }, "Failed to initialize template loader");
    throw err;
  }

  // ─── TEMPLATE MARKETPLACE ─────────────────────────────────────

  app.get("/api/video/templates", (req: Request, res: Response) => {
    try {
      const category = req.query.category as string | undefined;
      const industry = req.query.industry as string | undefined;
      const provider = req.query.provider as string | undefined;
      const search = (req.query.search as string | undefined)?.toLowerCase();
      const tag = req.query.tag as string | undefined;
      const sort = (req.query.sort as string) || "popular";
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
      const aspectRatio = req.query.aspectRatio as string | undefined;
      const quality = req.query.quality as string | undefined;
      const minDuration = parseInt(req.query.minDuration as string) || 0;
      const maxDuration = parseInt(req.query.maxDuration as string) || 999;

      let templates = templatesLoader.getAllTemplates();

      if (category) templates = templates.filter((t) => t.category.toLowerCase() === category.toLowerCase().replace(/-/g, " "));
      if (industry) templates = templates.filter((t) => t.industry.toLowerCase() === industry.toLowerCase().replace(/-/g, " "));
      if (provider) templates = templates.filter((t) => t.providers.includes(provider as any));
      if (tag) templates = templates.filter((t) => t.tags.some((tg) => tg.toLowerCase().includes(tag.toLowerCase())));
      if (aspectRatio) templates = templates.filter((t) => t.aspectRatio === aspectRatio);
      if (quality) templates = templates.filter((t) => t.quality === quality);
      if (minDuration > 0) templates = templates.filter((t) => t.duration >= minDuration);
      if (maxDuration < 999) templates = templates.filter((t) => t.duration <= maxDuration);
      if (search) {
        templates = templates.filter(
          (t) =>
            t.title.toLowerCase().includes(search) ||
            t.description.toLowerCase().includes(search) ||
            t.tags.some((tg) => tg.toLowerCase().includes(search)) ||
            t.industry.toLowerCase().includes(search) ||
            t.category.toLowerCase().includes(search)
        );
      }

      if (sort === "newest") {
        templates.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } else if (sort === "oldest") {
        templates.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      } else if (sort === "cheapest") {
        templates.sort((a, b) => a.creditCost - b.creditCost);
      } else if (sort === "most_expensive") {
        templates.sort((a, b) => b.creditCost - a.creditCost);
      } else {
        templates.sort((a, b) => (analytics[b.id]?.completedRenders || 0) - (analytics[a.id]?.completedRenders || 0));
      }

      const total = templates.length;
      const startIdx = (page - 1) * limit;
      const paginated = templates.slice(startIdx, startIdx + limit);

      return res.json({
        templates: paginated,
        total,
        page,
        limit,
        hasMore: startIdx + limit < total,
      });
    } catch (err: any) {
      logger.error({ err }, "Failed to fetch templates");
      return res.status(500).json({ error: "Failed to fetch templates" });
    }
  });

  app.get("/api/video/templates/categories", (_req: Request, res: Response) => {
    try {
      const cats = templatesLoader.getCategories();
      const industries = templatesLoader.getIndustries();
      const result: Record<string, { name: string; count: number; industries: string[]; coverUrl?: string }> = {};
      for (const cat of cats) {
        result[cat.name] = { ...cat };
        const first = templatesLoader.getTemplatesByCategory(cat.name)[0];
        if (first) result[cat.name].coverUrl = first.thumbnail;
      }
      return res.json({ categories: result, industries, total: cats.length });
    } catch (err: any) {
      logger.error({ err }, "Failed to fetch categories");
      return res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.get("/api/video/templates/popular", (_req: Request, res: Response) => {
    try {
      const limit = Math.min(50, parseInt(_req.query.limit as string) || 20);
      return res.json({ templates: templatesLoader.getPopularTemplates(limit) });
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to fetch popular templates" });
    }
  });

  app.get("/api/video/templates/tags", (_req: Request, res: Response) => {
    try {
      return res.json({ tags: templatesLoader.getTags() });
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to fetch tags" });
    }
  });

  app.get("/api/video/templates/industries", (_req: Request, res: Response) => {
    try {
      const industries = templatesLoader.getIndustries().map((ind) => ({
        name: ind,
        count: templatesLoader.getTemplatesByIndustry(ind).length,
      }));
      return res.json({ industries });
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to fetch industries" });
    }
  });

  app.get("/api/video/templates/:id", (req: Request, res: Response) => {
    try {
      const template = templatesLoader.getTemplate(req.params.id);
      if (!template) return res.status(404).json({ error: "Template not found" });
      return res.json(template);
    } catch (err: any) {
      logger.error({ err, templateId: req.params.id }, "Failed to fetch template");
      return res.status(500).json({ error: "Failed to fetch template" });
    }
  });

  app.get("/api/video/templates/:id/related", (req: Request, res: Response) => {
    try {
      const template = templatesLoader.getTemplate(req.params.id);
      if (!template) return res.status(404).json({ error: "Template not found" });
      const related = templatesLoader
        .getAllTemplates()
        .filter((t) => t.id !== template.id && (t.category === template.category || t.industry === template.industry))
        .slice(0, 12);
      return res.json({ templates: related });
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to fetch related templates" });
    }
  });

  // ─── TEMPLATE RATINGS ─────────────────────────────────────────

  app.post("/api/video/templates/:id/rate", (req: Request, res: Response) => {
    try {
      const { workspaceId, rating, review } = req.body;
      if (!workspaceId || !rating) return res.status(400).json({ error: "workspaceId and rating required" });
      const numRating = Math.max(1, Math.min(5, parseInt(rating)));
      if (!ratings[req.params.id]) ratings[req.params.id] = [];
      const existing = ratings[req.params.id].find((r) => r.workspaceId === workspaceId);
      if (existing) {
        existing.rating = numRating;
        existing.review = review;
        existing.createdAt = new Date().toISOString();
      } else {
        ratings[req.params.id].push({ workspaceId, rating: numRating, review, createdAt: new Date().toISOString() });
      }
      return res.json({ success: true, averageRating: getAverageRating(req.params.id), totalRatings: ratings[req.params.id].length });
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to rate template" });
    }
  });

  app.get("/api/video/templates/:id/ratings", (req: Request, res: Response) => {
    try {
      const templateRatings = ratings[req.params.id] || [];
      return res.json({
        averageRating: getAverageRating(req.params.id),
        totalRatings: templateRatings.length,
        ratings: templateRatings,
      });
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to fetch ratings" });
    }
  });

  // ─── FAVORITE TEMPLATES ───────────────────────────────────────

  app.get("/api/video/favorites", (req: Request, res: Response) => {
    try {
      const workspaceId = req.query.workspaceId as string;
      if (!workspaceId) return res.status(400).json({ error: "workspaceId required" });
      const favIds = favorites[workspaceId] || [];
      const favTemplates = favIds.map((id) => templatesLoader.getTemplate(id)).filter(Boolean);
      return res.json({ templates: favTemplates, ids: favIds });
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to fetch favorites" });
    }
  });

  app.post("/api/video/favorites/toggle", (req: Request, res: Response) => {
    try {
      const { workspaceId, templateId } = req.body;
      if (!workspaceId || !templateId) return res.status(400).json({ error: "workspaceId and templateId required" });
      if (!favorites[workspaceId]) favorites[workspaceId] = [];
      const idx = favorites[workspaceId].indexOf(templateId);
      if (idx >= 0) {
        favorites[workspaceId].splice(idx, 1);
        return res.json({ favorited: false, ids: favorites[workspaceId] });
      } else {
        favorites[workspaceId].push(templateId);
        return res.json({ favorited: true, ids: favorites[workspaceId] });
      }
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to toggle favorite" });
    }
  });

  // ─── COLLECTIONS ──────────────────────────────────────────────

  app.get("/api/video/collections", (req: Request, res: Response) => {
    try {
      const workspaceId = req.query.workspaceId as string;
      if (!workspaceId) return res.status(400).json({ error: "workspaceId required" });
      const cols = collections[workspaceId] || [];
      return res.json({ collections: cols });
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to fetch collections" });
    }
  });

  app.post("/api/video/collections", (req: Request, res: Response) => {
    try {
      const { workspaceId, name, description } = req.body;
      if (!workspaceId || !name) return res.status(400).json({ error: "workspaceId and name required" });
      if (!collections[workspaceId]) collections[workspaceId] = [];
      const newCol = {
        id: `col_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        name,
        description: description || "",
        templateIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      collections[workspaceId].push(newCol);
      return res.json({ collection: newCol });
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to create collection" });
    }
  });

  app.put("/api/video/collections/:id", (req: Request, res: Response) => {
    try {
      const { workspaceId, name, description } = req.body;
      const colId = req.params.id;
      if (!workspaceId) return res.status(400).json({ error: "workspaceId required" });
      const cols = collections[workspaceId];
      if (!cols) return res.status(404).json({ error: "Collection not found" });
      const col = cols.find((c) => c.id === colId);
      if (!col) return res.status(404).json({ error: "Collection not found" });
      if (name) col.name = name;
      if (description !== undefined) col.description = description;
      col.updatedAt = new Date().toISOString();
      return res.json({ collection: col });
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to update collection" });
    }
  });

  app.delete("/api/video/collections/:id", (req: Request, res: Response) => {
    try {
      const { workspaceId } = req.body;
      const colId = req.params.id;
      if (!workspaceId) return res.status(400).json({ error: "workspaceId required" });
      const cols = collections[workspaceId];
      if (!cols) return res.status(404).json({ error: "Collection not found" });
      const idx = cols.findIndex((c) => c.id === colId);
      if (idx < 0) return res.status(404).json({ error: "Collection not found" });
      cols.splice(idx, 1);
      return res.json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to delete collection" });
    }
  });

  app.post("/api/video/collections/:id/templates", (req: Request, res: Response) => {
    try {
      const { workspaceId, templateId } = req.body;
      const colId = req.params.id;
      if (!workspaceId || !templateId) return res.status(400).json({ error: "workspaceId and templateId required" });
      const cols = collections[workspaceId];
      if (!cols) return res.status(404).json({ error: "Collection not found" });
      const col = cols.find((c) => c.id === colId);
      if (!col) return res.status(404).json({ error: "Collection not found" });
      if (!col.templateIds.includes(templateId)) {
        col.templateIds.push(templateId);
      }
      col.updatedAt = new Date().toISOString();
      return res.json({ collection: col });
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to add template to collection" });
    }
  });

  app.delete("/api/video/collections/:id/templates/:templateId", (req: Request, res: Response) => {
    try {
      const { workspaceId } = req.body;
      const { id: colId, templateId } = req.params;
      if (!workspaceId) return res.status(400).json({ error: "workspaceId required" });
      const cols = collections[workspaceId];
      if (!cols) return res.status(404).json({ error: "Collection not found" });
      const col = cols.find((c) => c.id === colId);
      if (!col) return res.status(404).json({ error: "Collection not found" });
      col.templateIds = col.templateIds.filter((tid) => tid !== templateId);
      col.updatedAt = new Date().toISOString();
      return res.json({ collection: col });
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to remove template from collection" });
    }
  });

  // ─── TEMPLATE ANALYTICS ───────────────────────────────────────

  app.post("/api/video/templates/:id/analytics/render", (req: Request, res: Response) => {
    try {
      const { status, provider, duration } = req.body;
      const tid = req.params.id;
      if (!analytics[tid]) {
        analytics[tid] = { totalRenders: 0, completedRenders: 0, failedRenders: 0, totalRating: 0, totalRatings: 0, providerUsage: {}, totalDuration: 0 };
      }
      analytics[tid].totalRenders++;
      if (status === "completed") analytics[tid].completedRenders++;
      if (status === "failed") analytics[tid].failedRenders++;
      if (provider) {
        analytics[tid].providerUsage[provider] = (analytics[tid].providerUsage[provider] || 0) + 1;
      }
      if (duration) analytics[tid].totalDuration += duration;
      return res.json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to record analytics" });
    }
  });

  app.get("/api/video/templates/:id/analytics", (req: Request, res: Response) => {
    try {
      const tid = req.params.id;
      const template = templatesLoader.getTemplate(tid);
      if (!template) return res.status(404).json({ error: "Template not found" });
      const a = analytics[tid] || { totalRenders: 0, completedRenders: 0, failedRenders: 0, totalRating: 0, totalRatings: 0, providerUsage: {}, totalDuration: 0 };
      return res.json({
        templateId: tid,
        totalRenders: a.totalRenders,
        completedRenders: a.completedRenders,
        failedRenders: a.failedRenders,
        averageRating: getAverageRating(tid),
        totalRatings: (ratings[tid] || []).length,
        popularityScore: a.completedRenders > 0 ? Math.min(100, Math.round((a.completedRenders / Math.max(1, a.totalRenders)) * 50 + getAverageRating(tid) * 10)) : 0,
        topProviders: Object.entries(a.providerUsage).sort(([, a], [, b]) => b - a).map(([provider, count]) => ({ provider, count })),
        averageDuration: a.totalRenders > 0 ? Math.round(a.totalDuration / a.totalRenders) : 0,
      });
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // ─── WORKSPACE ANALYTICS ──────────────────────────────────────

  app.get("/api/video/analytics/workspace", (req: Request, res: Response) => {
    try {
      const workspaceId = req.query.workspaceId as string;
      if (!workspaceId) return res.status(400).json({ error: "workspaceId required" });
      const totalAnalytics = Object.values(analytics).reduce(
        (acc, a) => {
          acc.totalRenders += a.totalRenders;
          acc.completedRenders += a.completedRenders;
          acc.failedRenders += a.failedRenders;
          return acc;
        },
        { totalRenders: 0, completedRenders: 0, failedRenders: 0 }
      );
      return res.json({
        totalTemplates: templatesLoader.getTemplateCount(),
        totalCategories: templatesLoader.getCategoryCount(),
        totalIndustries: templatesLoader.getIndustries().length,
        analytics: totalAnalytics,
      });
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to fetch workspace analytics" });
    }
  });

  // ─── CLONE TEMPLATE ───────────────────────────────────────────

  app.post("/api/video/templates/:id/clone", (req: Request, res: Response) => {
    try {
      const template = templatesLoader.getTemplate(req.params.id);
      if (!template) return res.status(404).json({ error: "Template not found" });
      const cloneId = `${template.id}_clone_${Date.now()}`;
      const cloned: VideoTemplate = {
        ...template,
        id: cloneId,
        title: `${template.title} (Clone)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return res.json({ template: cloned });
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to clone template" });
    }
  });

  logger.info("Template API routes initialized successfully");
}

function getAverageRating(templateId: string): number {
  const templateRatings = ratings[templateId];
  if (!templateRatings || templateRatings.length === 0) return 0;
  const sum = templateRatings.reduce((s, r) => s + r.rating, 0);
  return Math.round((sum / templateRatings.length) * 10) / 10;
}
