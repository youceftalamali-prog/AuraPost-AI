import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Video, Sparkles, Play, Download, Trash2, Layers, Film, Monitor, Smartphone, Tv,
  RefreshCw, CheckCircle2, XCircle, Clock, Gauge, Sliders, Search, Filter, Grid3X3,
  List, Heart, FolderPlus, Star, ChevronDown, ChevronUp, Plus, Copy, Camera,
  Music, Mic, Type, Image, Palette, Crop, Move3D, Layout, PanelRight, PanelLeft,
  Share2, Bookmark, Clock3, ArrowLeft, ArrowRight, Upload, Settings, MoreHorizontal,
  Globe, Tag, Hash, Info, AlertCircle, Loader2, Maximize2, Minimize2, Scissors,
  Volume2, Subtitles, Eye, EyeOff, Lock, Unlock, Layers3, Repeat, Shuffle,
  Sun, Moon, Zap, Target, Pen, Wand2, Frame, PictureInPicture2, ListOrdered,
  HeartOff, BookmarkPlus, BookmarkCheck, DownloadCloud, RotateCcw, ChevronLeft,
  CircleDot, Circle, Square, SplitSquareHorizontal, AlignLeft, AlignCenter, AlignRight,
} from "lucide-react";
import { NormalizedProduct, VideoGenerationRecord, VideoProviderName, VideoTemplateName, VideoAspectRatio, VideoOutputType, VideoInputMode, StoryboardFrame, TimelineTrack, SubtitleCue, BrandAsset, ColorGradingPreset, CameraConfig, LogoOverlay, WatermarkConfig, VideoCollection, VideoScene } from "../types.ts";

interface VideoStudioProps {
  workspaceId: string;
  onAddAuditLog: (action: string, details: string) => void;
  selectedProductIdFromCatalog?: string;
  testMode?: boolean;
}

interface VideoTemplate {
  id: string;
  title: string;
  description: string;
  industry: string;
  category: string;
  tags: string[];
  duration: number;
  aspectRatio: VideoAspectRatio;
  recommendedProvider: VideoProviderName;
  providers: VideoProviderName[];
  thumbnail: string;
  cover: string;
  quality: string;
  scenes: VideoScene[];
  camera: { angles: string[]; movement: string[]; lighting: string; environment: string };
  audio: { musicStyle: string; voiceStyle: string; tempo: string };
  transitions: string[];
  textOverlay: Array<{ text: string; position: string; timing: string }>;
  cta: string;
  negativePrompt: string;
  promptFragments: string[];
  creditCost: number;
  createdAt: string;
}

type TabType = "marketplace" | "editor" | "storyboard" | "timeline" | "audio" | "subtitles" | "camera" | "color" | "motion" | "assets" | "queue" | "history" | "collections";

export default function VideoStudio({ workspaceId, onAddAuditLog, selectedProductIdFromCatalog, testMode = false }: VideoStudioProps) {
  const [activeTab, setActiveTab] = useState<TabType>("marketplace");
  const [products, setProducts] = useState<NormalizedProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [generating, setGenerating] = useState(false);
  const [history, setHistory] = useState<VideoGenerationRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [activeVideo, setActiveVideo] = useState<VideoGenerationRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<VideoAspectRatio | "">("");
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedTemplate, setSelectedTemplate] = useState<VideoTemplate | null>(null);
  const [templateSearchOpen, setTemplateSearchOpen] = useState(false);
  const [categories, setCategories] = useState<Record<string, { name: string; count: number; industries: string[]; coverUrl?: string }>>({});
  const [industries, setIndustries] = useState<string[]>([]);
  const [favoriteTemplates, setFavoriteTemplates] = useState<string[]>([]);
  const [collections, setCollections] = useState<VideoCollection[]>([]);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [selectedCollection, setSelectedCollection] = useState<string>("");
  const [previewTemplate, setPreviewTemplate] = useState<VideoTemplate | null>(null);
  const [colorGrade, setColorGrade] = useState<string>("");
  const [cameraPreset, setCameraPreset] = useState<string>("");
  const [motionPreset, setMotionPreset] = useState<string>("");
  const [transitionPreset, setTransitionPreset] = useState<string>("");
  const [musicTrack, setMusicTrack] = useState("");
  const [voiceStyle, setVoiceStyle] = useState("");
  const [brandAssets, setBrandAssets] = useState<BrandAsset[]>([]);
  const [showAssetManager, setShowAssetManager] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [renderQueue, setRenderQueue] = useState<VideoGenerationRecord[]>([]);
  const [templateRatings, setTemplateRatings] = useState<Record<string, { average: number; total: number }>>({});
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [provider, setProvider] = useState<VideoProviderName>("google_veo");
  const [aspectRatio, setAspectRatio] = useState<VideoAspectRatio>("9:16");
  const [outputType, setOutputType] = useState<VideoOutputType>("short_form_vertical");
  const [duration, setDuration] = useState(15);
  const [prompt, setPrompt] = useState("");
  const [providers, setProviders] = useState<any[]>([]);
  const [availableTemplates, setAvailableTemplates] = useState<VideoTemplate[]>([]);
  const [totalTemplates, setTotalTemplates] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [presets, setPresets] = useState<any>({});
  const [logoEnabled, setLogoEnabled] = useState(false);
  const [logoPosition, setLogoPosition] = useState<string>("bottom-right");
  const [watermarkEnabled, setWatermarkEnabled] = useState(false);
  const [subtitleStyle, setSubtitleStyle] = useState({ fontFamily: "Inter", fontSize: 16, color: "#ffffff", position: "bottom" as const, background: "rgba(0,0,0,0.6)" });
  const [templateFilterOpen, setTemplateFilterOpen] = useState(false);

  const activeProduct = products.find(p => p.id === selectedProductId);

  const loadProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const response = await fetch(`/api/products?workspaceId=${workspaceId}`);
      if (response.ok) {
        const data = await response.json();
        const list = Array.isArray(data) ? data : [];
        setProducts(list);
        if (list.length > 0 && !selectedProductId) {
          setSelectedProductId(selectedProductIdFromCatalog || list[0].id || "");
        }
      }
    } catch (err) {
      console.error("[VideoStudio] Failed to load products:", err);
    } finally {
      setLoadingProducts(false);
    }
  }, [workspaceId, selectedProductIdFromCatalog]);

  const loadProviders = useCallback(async () => {
    try {
      const response = await fetch("/api/video/providers");
      if (response.ok) {
        const data = await response.json();
        setProviders(data.providers || []);
      }
      const presetsRes = await fetch("/api/video/presets");
      if (presetsRes.ok) {
        setPresets(await presetsRes.json());
      }
    } catch (err) {
      console.error("[VideoStudio] Failed to load config:", err);
    }
  }, []);

  const loadTemplates = useCallback(async (page = 1, append = false) => {
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "24");
      params.set("sort", sortBy);
      if (selectedCategory) params.set("category", selectedCategory);
      if (selectedIndustry) params.set("industry", selectedIndustry);
      if (selectedAspectRatio) params.set("aspectRatio", selectedAspectRatio);
      if (searchQuery) params.set("search", searchQuery);
      const response = await fetch(`/api/video/templates?${params}`);
      if (response.ok) {
        const data = await response.json();
        setAvailableTemplates(append ? [...availableTemplates, ...data.templates] : data.templates);
        setTotalTemplates(data.total);
        setHasMore(data.hasMore);
        setCurrentPage(data.page);
      }
    } catch (err) {
      console.error("[VideoStudio] Failed to load templates:", err);
    }
  }, [sortBy, selectedCategory, selectedIndustry, selectedAspectRatio, searchQuery]);

  const loadCategories = useCallback(async () => {
    try {
      const response = await fetch("/api/video/templates/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || {});
        setIndustries(data.industries || []);
      }
    } catch (err) {
      console.error("[VideoStudio] Failed to load categories:", err);
    }
  }, []);

  const loadHistory = useCallback(async (prodId: string) => {
    if (!prodId) return;
    setLoadingHistory(true);
    try {
      const response = await fetch(`/api/video/history/${prodId}?workspaceId=${workspaceId}`);
      if (response.ok) {
        const data = await response.json();
        const items = data.history || [];
        setHistory(items);
        if (items.length > 0 && !activeVideo) {
          setActiveVideo(items[0]);
        }
      }
      const queueRes = await fetch(`/api/video/queue/workspace?workspaceId=${workspaceId}`);
      if (queueRes.ok) {
        const queueData = await queueRes.json();
        setRenderQueue(queueData.queue || []);
      }
    } catch (err) {
      console.error("[VideoStudio] Failed to load history:", err);
    } finally {
      setLoadingHistory(false);
    }
  }, [workspaceId]);

  const loadFavorites = useCallback(async () => {
    try {
      const response = await fetch(`/api/video/favorites?workspaceId=${workspaceId}`);
      if (response.ok) {
        const data = await response.json();
        setFavoriteTemplates(data.ids || []);
      }
    } catch (err) { /* ignore */ }
  }, [workspaceId]);

  const loadCollections = useCallback(async () => {
    try {
      const response = await fetch(`/api/video/collections?workspaceId=${workspaceId}`);
      if (response.ok) {
        const data = await response.json();
        setCollections(data.collections || []);
      }
    } catch (err) { /* ignore */ }
  }, [workspaceId]);

  const loadBrandAssets = useCallback(async () => {
    try {
      const response = await fetch(`/api/video/brand-assets?workspaceId=${workspaceId}`);
      if (response.ok) {
        const data = await response.json();
        setBrandAssets(data.assets || []);
      }
    } catch (err) { /* ignore */ }
  }, [workspaceId]);

  useEffect(() => {
    loadProducts();
    loadProviders();
    loadCategories();
    loadFavorites();
    loadCollections();
    loadBrandAssets();
  }, [workspaceId]);

  useEffect(() => {
    loadTemplates(1);
  }, [sortBy, selectedCategory, selectedIndustry, selectedAspectRatio, searchQuery]);

  useEffect(() => {
    if (selectedProductId) {
      loadHistory(selectedProductId);
    } else {
      setHistory([]);
      setActiveVideo(null);
    }
  }, [selectedProductId]);

  const creditCost = useMemo(() => {
    const base = outputType === "long_form_promotional" ? 20 : 10;
    return base + Math.max(0, Math.round(duration / 15));
  }, [outputType, duration]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !selectedTemplate) return;
    setGenerating(true);
    try {
      const response = await fetch("/api/video/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          productId: selectedProductId,
          template: selectedTemplate.id.replace(/_.*$/, "") as VideoTemplateName,
          outputType,
          inputMode: "product_data",
          prompt: prompt || selectedTemplate.promptFragments.join(". "),
          durationSeconds: duration,
          aspectRatio,
          provider,
          sourceImageUrls: [],
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to trigger video generation.");
      onAddAuditLog("video.generate_start", `Initiated AI Video using ${selectedTemplate.title} with ${provider}`);
      fetch(`/api/video/templates/${selectedTemplate.id}/analytics/render`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "started", provider }),
      });
      setTimeout(() => { loadHistory(selectedProductId); setGenerating(false); }, 2000);
    } catch (err: any) {
      alert(err.message || "Error during video generation.");
      setGenerating(false);
    }
  };

  const handleDelete = async (videoId: string) => {
    if (!window.confirm("Delete this generated video?")) return;
    try {
      const response = await fetch(`/api/video/${videoId}?workspaceId=${workspaceId}`, { method: "DELETE" });
      if (response.ok) {
        if (activeVideo?.id === videoId) setActiveVideo(null);
        loadHistory(selectedProductId);
      }
    } catch (err) {
      console.error("[VideoStudio] Failed to delete video:", err);
    }
  };

  const handleRegenerate = async (video: VideoGenerationRecord) => {
    try {
      const response = await fetch("/api/video/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId, videoId: video.id }),
      });
      if (response.ok) {
        onAddAuditLog("video.regenerate", `Regenerated video ${video.id}`);
        setTimeout(() => loadHistory(selectedProductId), 1000);
      }
    } catch (err) {
      console.error("[VideoStudio] Failed to regenerate:", err);
    }
  };

  const handleDuplicate = async (video: VideoGenerationRecord) => {
    try {
      const response = await fetch("/api/video/duplicate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId, videoId: video.id }),
      });
      if (response.ok) {
        await loadHistory(selectedProductId);
      }
    } catch (err) {
      console.error("[VideoStudio] Failed to duplicate:", err);
    }
  };

  const handleToggleFavorite = async (templateId: string) => {
    try {
      const response = await fetch("/api/video/favorites/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId, templateId }),
      });
      if (response.ok) {
        const data = await response.json();
        setFavoriteTemplates(data.ids || []);
      }
    } catch (err) { /* ignore */ }
  };

  const handleRateTemplate = async (templateId: string, rating: number) => {
    try {
      const response = await fetch(`/api/video/templates/${templateId}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId, rating }),
      });
      if (response.ok) {
        const data = await response.json();
        setTemplateRatings(prev => ({ ...prev, [templateId]: { average: data.averageRating, total: data.totalRatings } }));
      }
    } catch (err) { /* ignore */ }
  };

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) return;
    try {
      const response = await fetch("/api/video/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId, name: newCollectionName.trim() }),
      });
      if (response.ok) {
        setNewCollectionName("");
        setShowCollectionModal(false);
        loadCollections();
      }
    } catch (err) { /* ignore */ }
  };

  const handleAddToCollection = async (collectionId: string, templateId: string) => {
    try {
      await fetch(`/api/video/collections/${collectionId}/templates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId, templateId }),
      });
      loadCollections();
    } catch (err) { /* ignore */ }
  };

  const filteredTemplates = useMemo(() => {
    return availableTemplates;
  }, [availableTemplates]);

  const renderTabNav = () => (
    <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-thin border-b border-gray-800 mb-4">
      {[
        { id: "marketplace" as TabType, label: "Marketplace", icon: Grid3X3 },
        { id: "editor" as TabType, label: "Editor", icon: Sliders },
        { id: "storyboard" as TabType, label: "Storyboard", icon: Layout },
        { id: "timeline" as TabType, label: "Timeline", icon: ListOrdered },
        { id: "audio" as TabType, label: "Audio", icon: Music },
        { id: "subtitles" as TabType, label: "Subtitles", icon: Subtitles },
        { id: "camera" as TabType, label: "Camera", icon: Camera },
        { id: "color" as TabType, label: "Color", icon: Palette },
        { id: "motion" as TabType, label: "Motion", icon: Move3D },
        { id: "assets" as TabType, label: "Assets", icon: Image },
        { id: "queue" as TabType, label: "Queue", icon: Clock },
        { id: "history" as TabType, label: "History", icon: Layers },
        { id: "collections" as TabType, label: "Collections", icon: FolderPlus },
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            activeTab === tab.id
              ? "bg-indigo-600/20 text-indigo-400 border border-indigo-800/50"
              : "text-gray-500 hover:text-gray-300 hover:bg-gray-900 border border-transparent"
          }`}
        >
          <tab.icon className="w-3 h-3" />
          {tab.label}
        </button>
      ))}
    </div>
  );

  const renderMarketplace = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 300+ templates..."
            className="w-full h-9 bg-[#0c0d12] border border-gray-850 rounded-lg pl-9 pr-3 text-xs text-white placeholder-gray-600 focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="text-[10px] text-gray-500 font-mono">{totalTemplates} templates</div>
          <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded ${viewMode === "grid" ? "bg-indigo-600/20 text-indigo-400" : "text-gray-600 hover:text-gray-400"} cursor-pointer`}>
            <Grid3X3 className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setViewMode("list")} className={`p-1.5 rounded ${viewMode === "list" ? "bg-indigo-600/20 text-indigo-400" : "text-gray-600 hover:text-gray-400"} cursor-pointer`}>
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <select
          value={selectedCategory}
          onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
          className="h-7 bg-[#0c0d12] border border-gray-850 rounded-lg px-2 text-[10px] text-gray-400 focus:border-indigo-500 focus:outline-none"
        >
          <option value="">All Categories</option>
          {Object.values(categories).map((cat) => (
            <option key={cat.name} value={cat.name}>{cat.name} ({cat.count})</option>
          ))}
        </select>
        <select
          value={selectedIndustry}
          onChange={(e) => { setSelectedIndustry(e.target.value); setCurrentPage(1); }}
          className="h-7 bg-[#0c0d12] border border-gray-850 rounded-lg px-2 text-[10px] text-gray-400 focus:border-indigo-500 focus:outline-none"
        >
          <option value="">All Industries</option>
          {industries.map((ind) => (
            <option key={ind} value={ind}>{ind}</option>
          ))}
        </select>
        <select
          value={selectedAspectRatio}
          onChange={(e) => { setSelectedAspectRatio(e.target.value as VideoAspectRatio | ""); setCurrentPage(1); }}
          className="h-7 bg-[#0c0d12] border border-gray-850 rounded-lg px-2 text-[10px] text-gray-400 focus:border-indigo-500 focus:outline-none"
        >
          <option value="">All Ratios</option>
          <option value="9:16">Portrait 9:16</option>
          <option value="16:9">Landscape 16:9</option>
          <option value="1:1">Square 1:1</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="h-7 bg-[#0c0d12] border border-gray-850 rounded-lg px-2 text-[10px] text-gray-400 focus:border-indigo-500 focus:outline-none"
        >
          <option value="popular">Most Popular</option>
          <option value="newest">Newest</option>
          <option value="cheapest">Lowest Credits</option>
          <option value="most_expensive">Highest Credits</option>
        </select>
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} className="h-7 px-2 rounded-lg bg-gray-900 border border-gray-800 text-[10px] text-gray-400 hover:text-white cursor-pointer">
            Clear ×
          </button>
        )}
      </div>

      {filteredTemplates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Film className="w-12 h-12 text-gray-700 mb-3" />
          <p className="text-sm font-semibold text-gray-400">No templates found</p>
          <p className="text-xs text-gray-600 mt-1">Try adjusting your filters or search</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => setSelectedTemplate(template)}
              className={`group relative rounded-xl border overflow-hidden transition-all cursor-pointer ${
                selectedTemplate?.id === template.id
                  ? "border-indigo-500 ring-1 ring-indigo-500/50"
                  : "border-gray-850 hover:border-gray-700"
              }`}
            >
              <div className="aspect-[4/3] bg-[#0c0d12] relative overflow-hidden">
                <img
                  src={template.thumbnail}
                  alt={template.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(template.title)}&background=1e1b4b&color=fff&size=400`; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute top-2 left-2 flex gap-1">
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase font-mono ${
                    template.quality === "ultra" ? "bg-purple-600/80 text-purple-200" :
                    template.quality === "premium" ? "bg-indigo-600/80 text-indigo-200" :
                    "bg-gray-600/80 text-gray-200"
                  }`}>{template.quality}</span>
                  <span className="px-1.5 py-0.5 rounded bg-black/60 text-[8px] font-mono text-gray-300">{template.duration}s</span>
                </div>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleToggleFavorite(template.id); }}
                    className="p-1 rounded bg-black/60 hover:bg-black/80 text-gray-300 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    {favoriteTemplates.includes(template.id) ? <Heart className="w-3 h-3 fill-red-400 text-red-400" /> : <Heart className="w-3 h-3" />}
                  </button>
                </div>
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-[10px] font-semibold text-white leading-tight line-clamp-2">{template.title}</p>
                </div>
              </div>
              <div className="p-2 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] text-gray-500 uppercase font-mono">{template.category}</span>
                  <span className="text-[8px] font-mono text-indigo-400">{template.creditCost} cr</span>
                </div>
                <p className="text-[9px] text-gray-400 line-clamp-1">{template.industry}</p>
                <p className="text-[8px] text-gray-600 line-clamp-1">{template.recommendedProvider.replace("_", " ")}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-1">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => setSelectedTemplate(template)}
              className={`flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-all ${
                selectedTemplate?.id === template.id ? "border-indigo-500 bg-indigo-950/20" : "border-gray-850 hover:border-gray-700 bg-[#0c0d12]/60"
              }`}
            >
              <img src={template.thumbnail} alt={template.title} className="w-10 h-8 rounded object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{template.title}</p>
                <p className="text-[9px] text-gray-500 truncate">{template.category} · {template.industry} · {template.duration}s</p>
              </div>
              <span className="text-[10px] font-mono text-indigo-400">{template.creditCost} cr</span>
            </div>
          ))}
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => loadTemplates(currentPage + 1, true)}
            className="px-6 h-9 bg-[#0c0d12] border border-gray-850 rounded-lg text-xs text-gray-400 hover:text-white hover:border-gray-700 transition-all cursor-pointer"
          >
            Load More ({totalTemplates - availableTemplates.length} remaining)
          </button>
        </div>
      )}
    </div>
  );

  const renderEditor = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold tracking-wider block">Target Product</label>
          {loadingProducts ? (
            <div className="h-9 bg-[#12131a] rounded-lg animate-pulse" />
          ) : (
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full h-9 bg-[#12131a] border border-gray-850 rounded-lg px-3 text-xs text-white focus:border-indigo-500 focus:outline-none"
            >
              <option value="">-- Select Product --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold tracking-wider block">Selected Template</label>
          {selectedTemplate ? (
            <div className="p-3 bg-[#0c0d12] rounded-lg border border-indigo-900/50 space-y-2">
              <div className="flex items-start gap-3">
                <img src={selectedTemplate.thumbnail} alt="" className="w-16 h-12 rounded object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white">{selectedTemplate.title}</p>
                  <p className="text-[9px] text-gray-500 mt-0.5">{selectedTemplate.category} · {selectedTemplate.industry}</p>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {selectedTemplate.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-1 py-0.5 rounded bg-gray-900 text-[8px] text-gray-400 font-mono">#{tag}</span>
                    ))}
                  </div>
                </div>
                <button onClick={() => setSelectedTemplate(null)} className="text-gray-500 hover:text-white cursor-pointer">
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[9px]">
                <div className="bg-[#12131a] rounded p-1.5 text-center">
                  <p className="text-gray-500 font-mono">Duration</p>
                  <p className="text-white font-semibold">{selectedTemplate.duration}s</p>
                </div>
                <div className="bg-[#12131a] rounded p-1.5 text-center">
                  <p className="text-gray-500 font-mono">Credits</p>
                  <p className="text-indigo-400 font-semibold">{selectedTemplate.creditCost}</p>
                </div>
                <div className="bg-[#12131a] rounded p-1.5 text-center">
                  <p className="text-gray-500 font-mono">Scenes</p>
                  <p className="text-white font-semibold">{selectedTemplate.scenes.length}</p>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setActiveTab("marketplace")}
              className="w-full h-12 bg-[#0c0d12] border border-dashed border-gray-800 rounded-lg text-xs text-gray-500 hover:text-gray-300 hover:border-gray-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Grid3X3 className="w-4 h-4" />
              Browse Template Marketplace
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-gray-400 uppercase font-bold tracking-wider block">Aspect Ratio</label>
            <select
              value={aspectRatio}
              onChange={(e) => { const ar = e.target.value as VideoAspectRatio; setAspectRatio(ar); if (ar === "9:16") setOutputType("short_form_vertical"); else if (ar === "16:9") setOutputType("long_form_promotional"); else setOutputType("slideshow"); }}
              className="w-full h-9 bg-[#12131a] border border-gray-850 rounded-lg px-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
            >
              <option value="9:16">Portrait 9:16 (Shorts)</option>
              <option value="16:9">Widescreen 16:9</option>
              <option value="1:1">Square 1:1</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-gray-400 uppercase font-bold tracking-wider block">Provider</label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value as VideoProviderName)}
              className="w-full h-9 bg-[#12131a] border border-gray-850 rounded-lg px-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
            >
              {providers.length > 0 ? providers.map((p) => (
                <option key={p.name} value={p.name}>{p.label}</option>
              )) : (
                <>
                  <option value="google_veo">Google Veo</option>
                  <option value="runwayml">RunwayML</option>
                  <option value="kling_ai">Kling AI</option>
                </>
              )}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-gray-400 uppercase font-bold tracking-wider block">Duration</label>
            <select value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full h-9 bg-[#12131a] border border-gray-850 rounded-lg px-2 text-xs text-white focus:border-indigo-500 focus:outline-none">
              <option value="15">15s Hook</option>
              <option value="30">30s Promo</option>
              <option value="45">45s Feature</option>
              <option value="60">60s Full</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-gray-400 uppercase font-bold tracking-wider block">Est. Credits</label>
            <div className="h-9 bg-[#12131a] border border-gray-850 rounded-lg px-3 flex items-center justify-between text-xs font-semibold text-indigo-400">
              <span className="font-mono">{testMode ? "0" : creditCost}</span>
              <Gauge className="w-3.5 h-3.5 opacity-60" />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold tracking-wider block">Creative Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={selectedTemplate ? `Based on: ${selectedTemplate.promptFragments.join(", ")}` : "Describe your video vision..."}
            rows={3}
            className="w-full bg-[#12131a] border border-gray-850 rounded-lg p-2.5 text-xs text-white placeholder-gray-600 focus:border-indigo-500 focus:outline-none resize-none"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating || !selectedProductId || !selectedTemplate}
          className="w-full h-10 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-500 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          {generating ? (
            <><RefreshCw className="w-4 h-4 animate-spin" /> Rendering...</>
          ) : (
            <><Sparkles className="w-4 h-4 text-emerald-400" /> Generate AI Video</>
          )}
        </button>

        {selectedTemplate && (
          <div className="p-3 bg-[#0c0d12] rounded-lg border border-gray-850">
            <p className="text-[9px] font-mono text-gray-500 uppercase font-bold mb-2">Auto-Generated Prompt</p>
            <p className="text-[10px] text-gray-300 leading-relaxed">
              {selectedTemplate.promptFragments.join(". ")}. Style: {selectedTemplate.audio.musicStyle}. 
              Camera: {selectedTemplate.camera.movement.join(", ")}. Lighting: {selectedTemplate.camera.lighting}.
            </p>
          </div>
        )}
      </div>

      <div className="lg:col-span-7 space-y-4">
        {activeVideo ? (
          <div className="bg-[#0c0d12] p-4 rounded-xl border border-gray-850 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-gray-900">
              <div>
                <h4 className="text-xs font-bold text-white font-mono uppercase">{activeVideo.template.replace(/_/g, " ")}</h4>
                <p className="text-[10px] text-gray-500">via <span className="text-indigo-400 font-semibold">{activeVideo.provider}</span></p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono uppercase flex items-center gap-1 ${
                  activeVideo.status === "completed" ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/40" :
                  activeVideo.status === "failed" ? "bg-rose-950/40 text-rose-400 border border-rose-900/40" :
                  "bg-indigo-950/40 text-indigo-400 border border-indigo-900/40 animate-pulse"
                }`}>
                  {activeVideo.status === "completed" && <CheckCircle2 className="w-2.5 h-2.5" />}
                  {activeVideo.status === "failed" && <XCircle className="w-2.5 h-2.5" />}
                  {activeVideo.status === "rendering" && <RefreshCw className="w-2.5 h-2.5 animate-spin" />}
                  {activeVideo.status}
                </span>
                <div className="flex gap-1">
                  <button onClick={() => handleRegenerate(activeVideo)} className="p-1 rounded hover:bg-gray-800 text-gray-500 hover:text-indigo-400 transition-all cursor-pointer" title="Regenerate">
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDuplicate(activeVideo)} className="p-1 rounded hover:bg-gray-800 text-gray-500 hover:text-emerald-400 transition-all cursor-pointer" title="Duplicate">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(activeVideo.id)} className="p-1 rounded hover:bg-gray-800 text-gray-500 hover:text-rose-400 transition-all cursor-pointer" title="Delete">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="relative aspect-video rounded-lg overflow-hidden bg-black/60 border border-gray-900 flex items-center justify-center">
              {activeVideo.status === "completed" && activeVideo.videoUrl ? (
                <video src={activeVideo.videoUrl} controls className="w-full h-full object-contain" poster={activeVideo.thumbnailUrl} />
              ) : activeVideo.status === "failed" ? (
                <div className="text-center p-6 space-y-2">
                  <XCircle className="w-10 h-10 text-rose-500 mx-auto" />
                  <p className="text-xs font-semibold text-white">Render Failed</p>
                  <p className="text-[10px] text-gray-500">{activeVideo.errorMessage || "GPU timeout"}</p>
                </div>
              ) : (
                <div className="text-center p-6 space-y-3">
                  <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
                  <p className="text-xs font-semibold text-white">AI Video Rendering in Progress</p>
                  <div className="w-48 bg-gray-900 h-1.5 rounded-full overflow-hidden mx-auto">
                    <div className="bg-indigo-500 h-full" style={{ width: `${activeVideo.progress}%` }} />
                  </div>
                  <p className="text-[10px] text-gray-500 font-mono">Job: {activeVideo.id.slice(0, 12)}...</p>
                </div>
              )}
            </div>

            {activeVideo.status === "completed" && (
              <div className="flex gap-2">
                <a href={activeVideo.downloadUrl || activeVideo.videoUrl} download
                  className="flex-1 h-9 bg-gray-900 hover:bg-gray-850 border border-gray-800 hover:border-gray-700 text-white font-medium rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer">
                  <Download className="w-3.5 h-3.5 text-indigo-400" /> Download MP4
                </a>
              </div>
            )}

            {activeVideo.scenes && activeVideo.scenes.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-gray-500 uppercase font-bold">Scenes ({activeVideo.scenes.length})</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {activeVideo.scenes.map((scene, idx) => (
                    <div key={idx} className="p-2 bg-[#12131a] rounded-lg border border-gray-850">
                      <span className="text-[8px] font-mono text-indigo-400 block">Scene {idx + 1}</span>
                      <p className="text-[9px] text-gray-300 line-clamp-2 mt-1">{scene.narration || scene.visual}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-[280px] rounded-xl border border-dashed border-gray-800 flex flex-col items-center justify-center text-center p-6 bg-[#0c0d12]/40">
            <Film className="w-10 h-10 text-gray-600 mb-3" />
            <p className="text-xs font-semibold text-gray-400">No Render Active</p>
            <p className="text-[10px] text-gray-500 max-w-xs mt-1">Select a product and template, then generate your video.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderStoryboard = () => {
    const template = selectedTemplate;
    const scenes = activeVideo?.scenes || template?.scenes || [];
    if (scenes.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Layout className="w-12 h-12 text-gray-700 mb-3" />
          <p className="text-sm font-semibold text-gray-400">No Storyboard Available</p>
          <p className="text-xs text-gray-600 mt-1">Select a template to view its storyboard.</p>
        </div>
      );
    }
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-gray-400 uppercase font-bold">{scenes.length} Scenes · {template?.duration || 0}s Total</span>
          <div className="flex gap-1">
            {template?.camera.angles.map((angle) => (
              <span key={angle} className="px-1.5 py-0.5 rounded bg-[#0c0d12] border border-gray-850 text-[8px] text-gray-400 font-mono">{angle}</span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {scenes.map((scene, idx) => (
            <div key={idx} className="bg-[#0c0d12] rounded-xl border border-gray-850 overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-indigo-950/30 to-gray-900 flex items-center justify-center relative">
                <span className="text-3xl font-bold text-gray-700">{idx + 1}</span>
                <div className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/60 text-[8px] font-mono text-gray-400">{scene.durationSeconds}s</div>
              </div>
              <div className="p-2 space-y-1">
                <p className="text-[10px] font-semibold text-white truncate">{scene.title || `Scene ${idx + 1}`}</p>
                <p className="text-[8px] text-gray-500 line-clamp-2">{scene.narration}</p>
                <div className="flex gap-1 mt-1">
                  {scene.transition && <span className="px-1 py-0.5 rounded bg-[#12131a] text-[7px] text-gray-500 font-mono">{scene.transition}</span>}
                  {scene.cameraAngle && <span className="px-1 py-0.5 rounded bg-[#12131a] text-[7px] text-gray-500 font-mono">{scene.cameraAngle}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
        {template && (
          <div className="p-4 bg-[#0c0d12] rounded-xl border border-gray-850 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <span className="text-[8px] font-mono text-gray-500 uppercase">Camera</span>
              <p className="text-xs text-white mt-1">{template.camera.movement.join(", ")}</p>
            </div>
            <div>
              <span className="text-[8px] font-mono text-gray-500 uppercase">Lighting</span>
              <p className="text-xs text-white mt-1 capitalize">{template.camera.lighting.replace(/-/g, " ")}</p>
            </div>
            <div>
              <span className="text-[8px] font-mono text-gray-500 uppercase">Audio</span>
              <p className="text-xs text-white mt-1">{template.audio.musicStyle}</p>
            </div>
            <div>
              <span className="text-[8px] font-mono text-gray-500 uppercase">Voice</span>
              <p className="text-xs text-white mt-1">{template.audio.voiceStyle}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTimeline = () => {
    const scenes = activeVideo?.scenes || selectedTemplate?.scenes || [];
    if (scenes.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ListOrdered className="w-12 h-12 text-gray-700 mb-3" />
          <p className="text-sm font-semibold text-gray-400">No Timeline Data</p>
          <p className="text-xs text-gray-600 mt-1">Generate a video or select a template to see the timeline.</p>
        </div>
      );
    }
    const totalDuration = selectedTemplate?.duration || scenes.reduce((sum, s) => sum + s.durationSeconds, 0);
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-gray-400 uppercase font-bold">Timeline · {totalDuration}s</span>
          <div className="flex gap-1">
            <span className="px-2 py-0.5 rounded bg-indigo-950/30 text-[9px] text-indigo-400 border border-indigo-900/40 font-mono">{selectedTemplate?.transitions?.join(", ") || "cut"}</span>
          </div>
        </div>

        <div className="bg-[#0c0d12] rounded-xl border border-gray-850 p-4 overflow-x-auto">
          <div className="relative" style={{ height: "120px" }}>
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#12131a] rounded-lg" />
            {scenes.map((scene, idx) => {
              const width = (scene.durationSeconds / totalDuration) * 100;
              const left = scenes.slice(0, idx).reduce((sum, s) => sum + (s.durationSeconds / totalDuration) * 100, 0);
              return (
                <div
                  key={idx}
                  className="absolute bottom-0 h-20 rounded-lg border border-gray-800 flex flex-col items-center justify-center text-center p-1"
                  style={{ left: `${left}%`, width: `${width}%`, background: `linear-gradient(180deg, rgba(99,102,241,${0.1 + idx * 0.05}) 0%, rgba(99,102,241,0.05) 100%)` }}
                >
                  <span className="text-[9px] font-bold text-indigo-400">S{idx + 1}</span>
                  <span className="text-[7px] text-gray-500 mt-0.5">{scene.durationSeconds}s</span>
                  {width > 8 && <span className="text-[6px] text-gray-600 mt-0.5 truncate w-full">{scene.title}</span>}
                </div>
              );
            })}
            {scenes.map((scene, idx) => {
              const left = scenes.slice(0, idx).reduce((sum, s) => sum + (s.durationSeconds / totalDuration) * 100, 0);
              return (
                <div key={`marker-${idx}`} className="absolute top-0 flex flex-col items-center" style={{ left: `${left}%` }}>
                  <div className="w-px h-3 bg-gray-700" />
                  <span className="text-[7px] text-gray-600 font-mono mt-0.5">
                    {scenes.slice(0, idx).reduce((sum, s) => sum + s.durationSeconds, 0)}s
                  </span>
                </div>
              );
            })}
            <div className="absolute top-0 flex flex-col items-center" style={{ left: "100%" }}>
              <div className="w-px h-3 bg-gray-700" />
              <span className="text-[7px] text-gray-600 font-mono mt-0.5">{totalDuration}s</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-mono text-gray-500 uppercase font-bold">Scene Details</span>
          <div className="space-y-1">
            {scenes.map((scene, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-[#0c0d12] border border-gray-850">
                <span className="w-6 h-6 rounded bg-indigo-600/20 text-indigo-400 text-[9px] font-bold flex items-center justify-center font-mono">{idx + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-white">{scene.title || `Scene ${idx + 1}`}</p>
                  <p className="text-[9px] text-gray-500 truncate">{scene.narration}</p>
                </div>
                <span className="text-[10px] font-mono text-gray-500">{scene.durationSeconds}s</span>
                {scene.transition && <span className="text-[8px] text-gray-600 font-mono px-1 py-0.5 rounded bg-[#12131a]">{scene.transition}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderAudio = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Music Track</label>
          <select value={musicTrack} onChange={(e) => setMusicTrack(e.target.value)} className="w-full h-9 bg-[#12131a] border border-gray-850 rounded-lg px-3 text-xs text-white focus:border-indigo-500 focus:outline-none">
            <option value="">Select Music Style</option>
            {(presets.musicGenres || []).map((g: string) => (
              <option key={g} value={g.toLowerCase().replace(/\s+/g, "_")}>{g}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Voice Style</label>
          <select value={voiceStyle} onChange={(e) => setVoiceStyle(e.target.value)} className="w-full h-9 bg-[#12131a] border border-gray-850 rounded-lg px-3 text-xs text-white focus:border-indigo-500 focus:outline-none">
            <option value="">Select Voice Style</option>
            {(presets.voiceStyles || []).map((v: string) => (
              <option key={v} value={v.toLowerCase().replace(/\s+/g, "_")}>{v}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex gap-3">
        <div className="flex-1 space-y-2">
          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Volume</label>
          <input type="range" min="0" max="100" defaultValue={80} className="w-full accent-indigo-500" />
        </div>
        <div className="flex-1 space-y-2">
          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Voice Volume</label>
          <input type="range" min="0" max="100" defaultValue={100} className="w-full accent-indigo-500" />
        </div>
      </div>
    </div>
  );

  const renderSubtitles = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-gray-400 uppercase font-bold">Subtitle Controls</span>
        <button className="px-3 h-8 bg-indigo-600/20 border border-indigo-800/40 rounded-lg text-[10px] text-indigo-400 hover:bg-indigo-600/30 transition-all cursor-pointer flex items-center gap-1.5">
          <Wand2 className="w-3 h-3" /> Auto-Generate
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="space-y-1.5">
          <label className="text-[9px] font-mono text-gray-500 uppercase">Font</label>
          <select className="w-full h-8 bg-[#12131a] border border-gray-850 rounded px-2 text-[10px] text-white">
            <option>Inter</option><option>Roboto</option><option>Montserrat</option><option>Playfair Display</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-[9px] font-mono text-gray-500 uppercase">Size</label>
          <select className="w-full h-8 bg-[#12131a] border border-gray-850 rounded px-2 text-[10px] text-white">
            <option>12</option><option>14</option><option selected>16</option><option>18</option><option>20</option><option>24</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-[9px] font-mono text-gray-500 uppercase">Color</label>
          <input type="color" defaultValue="#ffffff" className="w-full h-8 bg-[#12131a] border border-gray-850 rounded cursor-pointer" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[9px] font-mono text-gray-500 uppercase">Position</label>
          <select className="w-full h-8 bg-[#12131a] border border-gray-850 rounded px-2 text-[10px] text-white">
            <option>Bottom</option><option>Top</option><option>Center</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderCamera = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Camera Presets</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(presets.cameraPresets || []).map((p: any) => (
            <button
              key={p.name}
              onClick={() => setCameraPreset(p.name)}
              className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${cameraPreset === p.name ? "border-indigo-500 bg-indigo-950/20" : "border-gray-850 bg-[#0c0d12] hover:border-gray-700"}`}
            >
              <p className="text-[10px] font-semibold text-white">{p.name}</p>
              <p className="text-[8px] text-gray-500 mt-0.5 font-mono">{p.angle} · {p.movement}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderColorGrading = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Color Presets</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(presets.colorGrading || []).map((p: any) => (
            <button
              key={p.name}
              onClick={() => setColorGrade(p.name)}
              className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${colorGrade === p.name ? "border-indigo-500 bg-indigo-950/20" : "border-gray-850 bg-[#0c0d12] hover:border-gray-700"}`}
            >
              <div className="h-6 rounded mb-1" style={{ background: `linear-gradient(90deg, rgba(${p.brightness > 0 ? "255,255,255" : "0,0,0"},${Math.abs(p.brightness) / 100}), rgba(99,102,241,${p.saturation / 100}))` }} />
              <p className="text-[10px] font-semibold text-white">{p.name}</p>
              <p className="text-[8px] text-gray-500 font-mono">B:{p.brightness} C:{p.contrast} S:{p.saturation}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMotion = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Animation Presets</label>
          <div className="space-y-1">
            {(presets.motionPresets || []).map((p: any) => (
              <button
                key={p.id}
                onClick={() => setMotionPreset(p.id)}
                className={`w-full p-2 rounded-lg border text-left transition-all cursor-pointer ${motionPreset === p.id ? "border-indigo-500 bg-indigo-950/20" : "border-gray-850 bg-[#0c0d12] hover:border-gray-700"}`}
              >
                <p className="text-[10px] font-semibold text-white">{p.name}</p>
                <p className="text-[8px] text-gray-500 font-mono">{p.type} · {p.duration}s · {p.easing}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Transitions</label>
          <div className="space-y-1">
            {(presets.transitionPresets || []).map((p: any) => (
              <button
                key={p.id}
                onClick={() => setTransitionPreset(p.id)}
                className={`w-full p-2 rounded-lg border text-left transition-all cursor-pointer ${transitionPreset === p.id ? "border-indigo-500 bg-indigo-950/20" : "border-gray-850 bg-[#0c0d12] hover:border-gray-700"}`}
              >
                <p className="text-[10px] font-semibold text-white">{p.name}</p>
                <p className="text-[8px] text-gray-500 font-mono">{p.type} · {p.duration}s{p.direction ? ` · ${p.direction}` : ""}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 p-3 bg-[#0c0d12] rounded-lg border border-gray-850">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={logoEnabled} onChange={(e) => setLogoEnabled(e.target.checked)} className="accent-indigo-500" />
          <span className="text-[10px] text-gray-300 font-mono">Logo Overlay</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={watermarkEnabled} onChange={(e) => setWatermarkEnabled(e.target.checked)} className="accent-indigo-500" />
          <span className="text-[10px] text-gray-300 font-mono">Watermark</span>
        </label>
        {logoEnabled && (
          <select value={logoPosition} onChange={(e) => setLogoPosition(e.target.value)} className="h-7 bg-[#12131a] border border-gray-850 rounded px-2 text-[10px] text-white">
            <option value="top-left">Top Left</option><option value="top-right">Top Right</option>
            <option value="bottom-left">Bottom Left</option><option value="bottom-right">Bottom Right</option>
            <option value="center">Center</option>
          </select>
        )}
      </div>
    </div>
  );

  const renderAssets = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-gray-400 uppercase font-bold">Brand Assets ({brandAssets.length})</span>
        <button onClick={() => setShowAssetManager(true)} className="px-3 h-8 bg-indigo-600/20 border border-indigo-800/40 rounded-lg text-[10px] text-indigo-400 hover:bg-indigo-600/30 transition-all cursor-pointer flex items-center gap-1.5">
          <Plus className="w-3 h-3" /> Add Asset
        </button>
      </div>
      {brandAssets.length === 0 ? (
        <div className="p-8 bg-[#0c0d12] rounded-xl border border-dashed border-gray-800 text-center">
          <Image className="w-8 h-8 text-gray-700 mx-auto mb-2" />
          <p className="text-xs text-gray-500">No brand assets yet. Add logos, fonts, and colors.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {brandAssets.map((asset) => (
            <div key={asset.id} className="p-3 bg-[#0c0d12] rounded-lg border border-gray-850">
              <p className="text-[10px] font-semibold text-white">{asset.name}</p>
              <p className="text-[8px] text-gray-500 font-mono mt-0.5">{asset.type}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderQueuePanel = () => {
    const queueItems = renderQueue;
    return (
      <div className="space-y-3">
        <span className="text-[10px] font-mono text-gray-400 uppercase font-bold">Render Queue ({queueItems.length})</span>
        {queueItems.length === 0 ? (
          <div className="p-8 bg-[#0c0d12] rounded-xl border border-dashed border-gray-800 text-center">
            <Clock className="w-8 h-8 text-gray-700 mx-auto mb-2" />
            <p className="text-xs text-gray-500">Queue is empty. Generate a video to see it here.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {queueItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-[#0c0d12] rounded-lg border border-gray-850">
                <div className={`w-2 h-2 rounded-full ${item.status === "rendering" ? "bg-indigo-400 animate-pulse" : item.status === "queued" ? "bg-yellow-500" : "bg-rose-500"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-white truncate">{item.title}</p>
                  <p className="text-[9px] text-gray-500">{item.provider} · {item.status}</p>
                </div>
                <div className="w-20 bg-gray-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full transition-all" style={{ width: `${item.progress}%` }} />
                </div>
                <span className="text-[10px] font-mono text-gray-500">{item.progress}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderHistory = () => {
    const items = history;
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-gray-400 uppercase font-bold">Render History ({items.length})</span>
          <button onClick={() => selectedProductId && loadHistory(selectedProductId)} className="p-1.5 rounded bg-gray-900 border border-gray-800 text-gray-400 hover:text-white transition-all cursor-pointer">
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
        {loadingHistory ? (
          <div className="space-y-2">
            <div className="h-12 bg-[#0c0d12] rounded-lg animate-pulse" />
            <div className="h-12 bg-[#0c0d12] rounded-lg animate-pulse" />
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[400px] overflow-y-auto pr-1">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveVideo(item)}
                className={`p-3 rounded-xl border text-left flex items-start justify-between gap-3 transition-all cursor-pointer ${
                  activeVideo?.id === item.id ? "bg-indigo-950/15 border-indigo-900/60" : "bg-[#0c0d12] border-gray-850 hover:border-gray-800"
                }`}
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-white block truncate">{item.template.replace(/_/g, " ")}</span>
                  <span className="text-[9px] text-gray-500 block font-mono">{item.provider} · {item.durationSeconds}s</span>
                  {item.errorMessage && <span className="text-[8px] text-rose-500 block truncate">{item.errorMessage}</span>}
                </div>
                <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase font-mono ${
                  item.status === "completed" ? "bg-emerald-950/40 text-emerald-400" :
                  item.status === "failed" ? "bg-rose-950/40 text-rose-400" : "bg-indigo-950/40 text-indigo-400 animate-pulse"
                }`}>{item.status}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-[#0c0d12] rounded-xl border border-gray-850 text-center">
            <span className="text-[10px] text-gray-500 font-mono">No renders for this product yet.</span>
          </div>
        )}
      </div>
    );
  };

  const renderCollections = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-gray-400 uppercase font-bold">Collections ({collections.length})</span>
        <button onClick={() => setShowCollectionModal(true)} className="px-3 h-8 bg-indigo-600/20 border border-indigo-800/40 rounded-lg text-[10px] text-indigo-400 hover:bg-indigo-600/30 transition-all cursor-pointer flex items-center gap-1.5">
          <FolderPlus className="w-3 h-3" /> New Collection
        </button>
      </div>
      {collections.length === 0 ? (
        <div className="p-8 bg-[#0c0d12] rounded-xl border border-dashed border-gray-800 text-center">
          <FolderPlus className="w-8 h-8 text-gray-700 mx-auto mb-2" />
          <p className="text-xs text-gray-500">No collections yet. Create one to organize templates.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {collections.map((col) => (
            <div key={col.id} className="p-4 bg-[#0c0d12] rounded-xl border border-gray-850">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-white">{col.name}</h4>
                <span className="text-[9px] text-gray-500 font-mono">{col.templateIds.length}</span>
              </div>
              {col.description && <p className="text-[9px] text-gray-500 mb-2">{col.description}</p>}
              {col.templateIds.length > 0 && (
                <div className="flex -space-x-1">
                  {col.templateIds.slice(0, 4).map((tid) => (
                    <div key={tid} className="w-6 h-6 rounded-full bg-indigo-600/30 border border-gray-900 flex items-center justify-center text-[8px] text-indigo-400 font-bold">
                      {tid.charAt(0).toUpperCase()}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showCollectionModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={() => setShowCollectionModal(false)}>
          <div className="bg-[#12131a] rounded-2xl border border-gray-850 p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-bold text-white mb-4">New Collection</h3>
            <input
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              placeholder="Collection name..."
              className="w-full h-9 bg-[#0c0d12] border border-gray-850 rounded-lg px-3 text-xs text-white placeholder-gray-600 focus:border-indigo-500 focus:outline-none mb-4"
              onKeyDown={(e) => e.key === "Enter" && handleCreateCollection()}
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowCollectionModal(false)} className="px-4 h-9 bg-gray-900 border border-gray-800 rounded-lg text-xs text-gray-400 hover:text-white cursor-pointer">Cancel</button>
              <button onClick={handleCreateCollection} className="px-4 h-9 bg-indigo-600 rounded-lg text-xs text-white font-semibold hover:bg-indigo-500 cursor-pointer">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-[#12131a] rounded-2xl border border-gray-850 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Video className="w-5 h-5 text-indigo-400" />
            AI Video Studio
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Professional AI video platform with {totalTemplates}+ templates · {Object.keys(categories).length} categories · {industries.length} industries
          </p>
        </div>
        <div className="flex items-center gap-2">
          {testMode && (
            <span className="px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 text-[9px] font-mono border border-emerald-900/60 font-bold">TEST MODE</span>
          )}
          <div className="flex items-center gap-1">
            <button onClick={() => setShowPreview(!showPreview)} className={`p-2 rounded-lg border transition-all cursor-pointer ${showPreview ? "bg-indigo-600/20 border-indigo-800/50 text-indigo-400" : "bg-gray-900 border-gray-800 text-gray-400 hover:text-white"}`} title="Toggle Preview">
              {showPreview ? <PanelRight className="w-3.5 h-3.5" /> : <PanelLeft className="w-3.5 h-3.5" />}
            </button>
            <button onClick={() => selectedProductId && loadHistory(selectedProductId)} className="p-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 hover:text-white transition-all cursor-pointer" title="Refresh">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      {renderTabNav()}

      {/* Tab Content */}
      {activeTab === "marketplace" && renderMarketplace()}
      {activeTab === "editor" && renderEditor()}
      {activeTab === "storyboard" && renderStoryboard()}
      {activeTab === "timeline" && renderTimeline()}
      {activeTab === "audio" && renderAudio()}
      {activeTab === "subtitles" && renderSubtitles()}
      {activeTab === "camera" && renderCamera()}
      {activeTab === "color" && renderColorGrading()}
      {activeTab === "motion" && renderMotion()}
      {activeTab === "assets" && renderAssets()}
      {activeTab === "queue" && renderQueuePanel()}
      {activeTab === "history" && renderHistory()}
      {activeTab === "collections" && renderCollections()}
    </div>
  );
}
