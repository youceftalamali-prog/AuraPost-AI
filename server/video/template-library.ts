export interface VideoTemplate {
  id: string;
  title: string;
  description: string;
  industry: string;
  category: string;
  tags: string[];
  duration: number;
  aspectRatio: "9:16" | "16:9" | "1:1";
  recommendedProvider: "google_veo" | "runwayml" | "kling_ai" | "pika_labs";
  providers: ("google_veo" | "runwayml" | "kling_ai" | "pika_labs")[];
  thumbnail: string;
  cover: string;
  preview?: string;
  previewVideo?: string;
  quality: "standard" | "premium" | "ultra";
  scenes: Array<{
    title: string;
    visual: string;
    narration: string;
    durationSeconds: number;
    transition?: string;
    cameraAngle?: string;
    cameraMovement?: string;
    lighting?: string;
  }>;
  storyboard: string;
  camera: {
    angles: string[];
    movement: string[];
    lighting: string;
    environment: string;
  };
  audio: {
    musicStyle: string;
    voiceStyle: string;
    tempo: "slow" | "moderate" | "fast";
  };
  transitions: string[];
  textOverlay: Array<{
    text: string;
    position: string;
    timing: string;
  }>;
  cta: string;
  negativePrompt: string;
  promptFragments: string[];
  providerSettings: Record<string, any>;
  renderingSettings: {
    seed?: number;
    fps: number;
    codec: string;
  };
  optimizationRules: string[];
  creditCost: number;
  createdAt: string;
  updatedAt: string;
}

const now = new Date().toISOString();

interface TemplateSpec {
  id: string;
  title: string;
  description: string;
  industry: string;
  category: string;
  tags: string[];
  duration: number;
  aspectRatio: "9:16" | "16:9" | "1:1";
  quality: "standard" | "premium" | "ultra";
  creditCost: number;
  scenes: string[];
  cameraAngles: string[];
  cameraMovement: string[];
  lighting: string;
  environment: string;
  musicStyle: string;
  voiceStyle: string;
  tempo: "slow" | "moderate" | "fast";
  transitions: string[];
  cta: string;
  negativePrompt: string;
  promptFragments: string[];
  recommendedProvider: "google_veo" | "runwayml" | "kling_ai" | "pika_labs";
  providers: ("google_veo" | "runwayml" | "kling_ai" | "pika_labs")[];
  fps: number;
  textOverlays?: Array<{ text: string; position: string; timing: string }>;
  seed?: number;
}

const CATEGORIES: Record<string, { name: string; industry: string; description: string }> = {
  "Product Showcase": { name: "Product Showcase", industry: "Cross-Industry", description: "Highlight product features with professional rotating shots" },
  "Luxury Brand Ad": { name: "Luxury Brand Ad", industry: "Luxury", description: "High-end brand positioning with premium aesthetic" },
  "UGC Testimonial": { name: "UGC Testimonial", industry: "Cross-Industry", description: "Authentic user-generated style testimonial content" },
  "Before / After": { name: "Before / After", industry: "Cross-Industry", description: "Transformation storytelling with comparison format" },
  "Problem / Solution": { name: "Problem / Solution", industry: "Cross-Industry", description: "Pain point driven problem-solution narrative" },
  "Cinematic Teaser": { name: "Cinematic Teaser", industry: "Entertainment", description: "Moody cinematic reveal with dramatic pacing" },
  "Minimalist Storytelling": { name: "Minimalist Storytelling", industry: "Lifestyle", description: "Clean minimalist aesthetic with elegant pacing" },
  "TikTok Ads": { name: "TikTok Ads", industry: "Social Media", description: "Fast-paced viral optimized TikTok format" },
  "Instagram Reels": { name: "Instagram Reels", industry: "Social Media", description: "Aesthetic Instagram Reels with trending format" },
  "YouTube Shorts": { name: "YouTube Shorts", industry: "Social Media", description: "Vertical shorts optimized for YouTube" },
  "Social Ad Hook": { name: "Social Ad Hook", industry: "Social Media", description: "High-converting social ad with fast cuts" },
  "Unboxing": { name: "Unboxing", industry: "Cross-Industry", description: "Satisfying unboxing experience with detail shots" },
  "Behind the Scenes": { name: "Behind the Scenes", industry: "Lifestyle", description: "Authentic behind-the-scenes content" },
  "How It Works": { name: "How It Works", industry: "Tech", description: "Step-by-step product demonstration format" },
  "Customer Story": { name: "Customer Story", industry: "SaaS", description: "Customer journey and success story narrative" },
  "Comparison": { name: "Comparison", industry: "Tech", description: "Side-by-side product comparison format" },
  "Seasonal Promotion": { name: "Seasonal Promotion", industry: "Retail", description: "Seasonal and holiday themed promotional content" },
  "Event Highlight": { name: "Event Highlight", industry: "Events", description: "Event recap and highlight reel format" },
  "Tutorial": { name: "Tutorial", industry: "Education", description: "Educational tutorial with step-by-step guide" },
  "Review": { name: "Review", industry: "Media", description: "Product review with honest critique format" },
  "Lookbook": { name: "Lookbook", industry: "Fashion", description: "Fashion lookbook with model showcase" },
  "Recipe": { name: "Recipe", industry: "Food & Beverage", description: "Cooking recipe with ingredient preparation" },
  "Travel Guide": { name: "Travel Guide", industry: "Travel", description: "Travel destination highlight and guide" },
  "Fitness Transformation": { name: "Fitness Transformation", industry: "Fitness & Sports", description: "Fitness journey with before/after results" },
  "Property Tour": { name: "Property Tour", industry: "Real Estate", description: "Virtual property walkthrough tour" },
  "Tech Review": { name: "Tech Review", industry: "Electronics", description: "Detailed tech product review and analysis" },
  "Gaming Montage": { name: "Gaming Montage", industry: "Gaming", description: "High-energy gaming highlight montage" },
  "Educational Explainer": { name: "Educational Explainer", industry: "Education", description: "Educational content with visual explanations" },
  "Brand Story": { name: "Brand Story", industry: "SaaS", description: "Brand origin and mission storytelling" },
  "Announcement": { name: "Announcement", industry: "Cross-Industry", description: "Product launch and announcement format" },
};

const INDUSTRIES = [
  "Cross-Industry",
  "Luxury Jewelry",
  "Fashion",
  "Beauty",
  "Electronics",
  "Food & Beverage",
  "Fitness & Sports",
  "Social Media",
  "Real Estate",
  "SaaS",
  "Entertainment",
  "Lifestyle",
  "Tech",
  "Retail",
  "Events",
  "Education",
  "Media",
  "Travel",
  "Gaming",
  "Healthcare",
  "Automotive",
  "Home & Garden",
  "Pet Supplies",
  "Baby & Kids",
  "Office Supplies",
  "Sports Equipment",
  "Musical Instruments",
  "Art & Crafts",
  "Books & Publishing",
  "Sustainability",
];

const qualityOptions: Array<"standard" | "premium" | "ultra"> = ["standard", "premium", "ultra"];
const aspectRatioOptions: Array<"9:16" | "16:9" | "1:1"> = ["9:16", "16:9", "1:1"];
const providers: Array<"google_veo" | "runwayml" | "kling_ai" | "pika_labs"> = ["google_veo", "runwayml", "kling_ai", "pika_labs"];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function makeScenes(
  titles: string[],
  visuals: string[],
  narrations: string[],
  durations: number[],
  transitions?: string[],
  cameraAngles?: string[],
  cameraMovements?: string[],
  lightings?: string[]
): Array<{
  title: string;
  visual: string;
  narration: string;
  durationSeconds: number;
  transition?: string;
  cameraAngle?: string;
  cameraMovement?: string;
  lighting?: string;
}> {
  return titles.map((title, i) => ({
    title,
    visual: visuals[i] || visuals[visuals.length - 1],
    narration: narrations[i] || narrations[narrations.length - 1],
    durationSeconds: durations[i] || durations[durations.length - 1],
    ...(transitions ? { transition: transitions[i] || transitions[0] } : {}),
    ...(cameraAngles ? { cameraAngle: cameraAngles[i] || cameraAngles[0] } : {}),
    ...(cameraMovements ? { cameraMovement: cameraMovements[i] || cameraMovements[0] } : {}),
    ...(lightings ? { lighting: lightings[i] || lightings[0] } : {}),
  }));
}

function buildTemplate(spec: TemplateSpec, idx: number): VideoTemplate {
  const sceneTitles = spec.scenes;
  const sceneVisuals = sceneTitles.map(() => `${spec.environment} with ${spec.lighting} lighting`);
  const sceneNarrations = sceneTitles.map(() => pick(spec.promptFragments));
  const sceneDurations = sceneTitles.map((_, i) => i === 0 ? 4 : i === sceneTitles.length - 1 ? 3 : 5);
  const totalDuration = sceneDurations.reduce((a, b) => a + b, 0);

  return {
    id: spec.id,
    title: spec.title,
    description: spec.description,
    industry: spec.industry,
    category: spec.category,
    tags: spec.tags,
    duration: spec.duration || totalDuration,
    aspectRatio: spec.aspectRatio,
    recommendedProvider: spec.recommendedProvider,
    providers: spec.providers.length > 0 ? spec.providers : [spec.recommendedProvider],
    thumbnail: `https://picsum.photos/seed/${spec.id}/400/300`,
    cover: `https://picsum.photos/seed/${spec.id}-cover/1200/800`,
    quality: spec.quality,
    scenes: makeScenes(
      sceneTitles,
      sceneVisuals,
      sceneNarrations,
      sceneDurations,
      spec.transitions,
      spec.cameraAngles,
      spec.cameraMovement,
      [spec.lighting]
    ),
    storyboard: `${spec.id}_storyboard`,
    camera: {
      angles: spec.cameraAngles,
      movement: spec.cameraMovement,
      lighting: spec.lighting,
      environment: spec.environment,
    },
    audio: {
      musicStyle: spec.musicStyle,
      voiceStyle: spec.voiceStyle,
      tempo: spec.tempo,
    },
    transitions: spec.transitions,
    textOverlay: spec.textOverlays || [
      {
        text: spec.cta.toUpperCase(),
        position: "bottom-center",
        timing: "end",
      },
    ],
    cta: spec.cta,
    negativePrompt: spec.negativePrompt,
    promptFragments: spec.promptFragments,
    providerSettings: {},
    renderingSettings: { fps: spec.fps, codec: "h264", ...(spec.seed ? { seed: spec.seed } : {}) },
    optimizationRules: [
      "Maintain consistent visual quality",
      "Smooth transitions between scenes",
      "Professional audio mixing",
      "Color grade for brand consistency",
    ],
    creditCost: spec.creditCost || 15 + Math.floor(totalDuration / 10),
    createdAt: new Date(Date.now() - idx * 3600000).toISOString(),
    updatedAt: now,
  };
}

export function generateTemplateLibrary(): VideoTemplate[] {
  const templates: VideoTemplate[] = [];
  let idx = 0;

  // Helper to add templates for each industry + category combo
  function addTemplatesForIndustry(
    industry: string,
    baseCategory: string,
    count: number,
    makeSpec: (i: number) => TemplateSpec
  ) {
    for (let i = 0; i < count; i++) {
      try {
        const spec = makeSpec(i);
        templates.push(buildTemplate(spec, idx++));
      } catch (e) {
        // skip invalid specs
      }
    }
  }

  // === LUXURY JEWELRY (15 templates) ===
  const luxuryCategories = ["Product Showcase", "Luxury Brand Ad", "Cinematic Teaser", "Minimalist Storytelling", "Social Ad Hook"];
  for (const cat of luxuryCategories) {
    addTemplatesForIndustry("Luxury Jewelry", cat, 3, (i) => ({
      id: `luxury_jewelry_${cat.toLowerCase().replace(/\s+/g, "_")}_${i}`,
      title: `${cat === "Product Showcase" ? ["Diamond Ring", "Gold Necklace", "Pearl Earrings"][i] : 
             cat === "Luxury Brand Ad" ? ["Premium Watch", "Designer Bracelet", "Crystal Pendant"][i] :
             cat === "Cinematic Teaser" ? ["Hidden Gem", "Royal Collection", "Midnight Sapphire"][i] :
             cat === "Minimalist Storytelling" ? ["Silver Lining", "Golden Thread", "Pure Elegance"][i] :
             ["Sparkle Reel", "Luxury Flash", "Diamond Rush"][i]} — ${cat}`,
      description: `Professional ${cat.toLowerCase()} for luxury jewelry products with premium production quality`,
      industry: "Luxury Jewelry",
      category: cat,
      tags: ["luxury", "jewelry", cat.toLowerCase().replace(/\s+/g, "-"), "premium", "high-end", "cinematic", "4k"],
      duration: [15, 20, 30][i % 3],
      aspectRatio: pick(aspectRatioOptions),
      quality: pick(qualityOptions),
      creditCost: 20 + i * 2,
      scenes: ["Opening Reveal", "Detail Close-up", "Lifestyle Moment", "Brand Close"],
      cameraAngles: ["macro", "close-up", "wide", "detail"],
      cameraMovement: ["smooth-pan", "slow-zoom", "rotation", "tracking"],
      lighting: "warm-luxury-golden",
      environment: "premium-studio-white-backdrop",
      musicStyle: "classical-piano-elegant",
      voiceStyle: "luxury-female-narrator",
      tempo: "slow",
      transitions: ["fade", "dissolve", "elegant-wipe"],
      cta: "Shop Exclusive Collection",
      negativePrompt: "no low quality, no harsh shadows, no scratches, no poor lighting",
      promptFragments: ["luxurious jewelry showcase", "premium 4K quality", "soft golden lighting", "rotating product display", "elegant sophisticated atmosphere"],
      recommendedProvider: pick(providers.slice(0, 3)),
      providers: providers.slice(0, 3),
      fps: [24, 30, 60][i % 3],
      textOverlays: [
        { text: "CERTIFIED AUTHENTIC", position: "bottom-right", timing: "3s-8s" },
        { text: "LIFETIME GUARANTEE", position: "bottom-left", timing: "15s-25s" },
      ],
    }));
  }

  // === FASHION (20 templates) ===
  const fashionCategories = ["Product Showcase", "Lookbook", "Luxury Brand Ad", "Social Ad Hook", "Behind the Scenes", "Instagram Reels"];
  for (const cat of fashionCategories) {
    addTemplatesForIndustry("Fashion", cat, 3, (i) => ({
      id: `fashion_${cat.toLowerCase().replace(/\s+/g, "_")}_${i}`,
      title: `${["Premium Sneakers", "Designer Handbag", "Streetwear Collection", "Summer Dress", "Winter Coat", "Accessory Line"][(i % 6)]} — ${cat}`,
      description: `Fashion ${cat.toLowerCase()} showcasing clothing and accessories with trend-forward styling`,
      industry: "Fashion",
      category: cat,
      tags: ["fashion", "style", cat.toLowerCase().replace(/\s+/g, "-"), "trending", "lifestyle", "designer"],
      duration: [15, 20, 25][i % 3],
      aspectRatio: pick(aspectRatioOptions),
      quality: pick(qualityOptions),
      creditCost: 15 + i * 2,
      scenes: ["Style Hook", "Product Detail", "Lifestyle Shot", "Collection Close"],
      cameraAngles: ["full-body", "close-up", "detail", "lifestyle"],
      cameraMovement: ["smooth-pan", "tracking", "slow-motion", "reveal"],
      lighting: "bright-studio-natural",
      environment: "modern-fashion-studio",
      musicStyle: "trending-urban-beats",
      voiceStyle: "young-fashion-voice",
      tempo: pick(["moderate", "fast"] as const),
      transitions: ["cut", "quick-fade", "dynamic-wipe"],
      cta: "Shop the Look",
      negativePrompt: "no wrinkled clothing, no poor fit, no unflattering angles",
      promptFragments: ["fashion showcase", "trending style", "designer collection", "lifestyle fashion"],
      recommendedProvider: pick(providers.slice(0, 2)),
      providers: providers.slice(0, 2),
      fps: 30,
    }));
  }

  // === BEAUTY & COSMETICS (15 templates) ===
  const beautyCategories = ["Product Showcase", "UGC Testimonial", "Tutorial", "Before / After", "Instagram Reels"];
  for (const cat of beautyCategories) {
    addTemplatesForIndustry("Beauty", cat, 3, (i) => ({
      id: `beauty_${cat.toLowerCase().replace(/\s+/g, "_")}_${i}`,
      title: `${["Skincare Serum", "Lipstick Collection", "Foundation Routine", "Eye Shadow Palette", "Moisturizer", "Hair Care"][(i % 6)]} — ${cat}`,
      description: `Beauty ${cat.toLowerCase()} for cosmetics and skincare products with authentic presentation`,
      industry: "Beauty",
      category: cat,
      tags: ["beauty", "cosmetics", "skincare", cat.toLowerCase().replace(/\s+/g, "-"), "makeup", "tutorial"],
      duration: [20, 25, 30][i % 3],
      aspectRatio: pick(aspectRatioOptions),
      quality: pick(qualityOptions),
      creditCost: 15 + i * 3,
      scenes: ["Intro", "Application", "Results", "Recommendation"],
      cameraAngles: ["close-up", "macro", "selfie", "detail"],
      cameraMovement: ["minimal", "gentle-zoom", "natural"],
      lighting: "natural-window-bright",
      environment: "clean-beauty-studio",
      musicStyle: "soft-ambient-calm",
      voiceStyle: "authentic-beauty-voice",
      tempo: "moderate",
      transitions: ["natural-cut", "fade", "soft-dissolve"],
      cta: "Get Glowing Skin",
      negativePrompt: "no filter overuse, no fake results, no unnatural skin tones",
      promptFragments: ["beauty tutorial", "skincare routine", "natural makeup", "glowing skin results"],
      recommendedProvider: pick(providers.slice(1, 3)),
      providers: providers.slice(1, 3),
      fps: 24,
    }));
  }

  // === ELECTRONICS (20 templates) ===
  const electronicsCategories = ["Product Showcase", "Tech Review", "Cinematic Teaser", "How It Works", "Comparison", "Unboxing"];
  for (const cat of electronicsCategories) {
    addTemplatesForIndustry("Electronics", cat, 3, (i) => ({
      id: `electronics_${cat.toLowerCase().replace(/\s+/g, "_")}_${i}`,
      title: `${["Smartphone Pro", "Wireless Earbuds", "Smart Watch", "Laptop Ultra", "Gaming Console", "Drone Camera"][(i % 6)]} — ${cat}`,
      description: `Electronics ${cat.toLowerCase()} highlighting cutting-edge technology and premium design`,
      industry: "Electronics",
      category: cat,
      tags: ["electronics", "tech", "gadget", cat.toLowerCase().replace(/\s+/g, "-"), "innovation", "digital"],
      duration: [20, 30, 45][i % 3],
      aspectRatio: pick(aspectRatioOptions),
      quality: pick(qualityOptions),
      creditCost: 18 + i * 3,
      scenes: ["Hero Reveal", "Feature Highlight", "User Experience", "Tech Specs Close"],
      cameraAngles: ["cinematic", "macro", "wide", "detail", "close-up"],
      cameraMovement: ["smooth-push", "subtle-rotation", "dramatic-reveal", "tracking"],
      lighting: "dramatic-professional-studio",
      environment: "dark-tech-studio",
      musicStyle: "modern-electronic-ambient",
      voiceStyle: "tech-narrator-clear",
      tempo: pick(["moderate", "fast"] as const),
      transitions: ["fade", "dissolve", "dynamic-wipe", "glitch"],
      cta: "Learn More / Buy Now",
      negativePrompt: "no blurry images, no dated tech, no poor lighting, no low resolution",
      promptFragments: ["tech innovation showcase", "cutting-edge design", "professional lighting", "4K cinematic quality"],
      recommendedProvider: pick(providers.slice(0, 3)),
      providers: providers.slice(0, 3),
      fps: [30, 60][i % 2],
      seed: 12345 + i,
    }));
  }

  // === FOOD & BEVERAGE (20 templates) ===
  const foodCategories = ["Product Showcase", "Recipe", "Minimalist Storytelling", "UGC Testimonial", "Instagram Reels", "Behind the Scenes"];
  for (const cat of foodCategories) {
    addTemplatesForIndustry("Food & Beverage", cat, 3, (i) => ({
      id: `food_${cat.toLowerCase().replace(/\s+/g, "_")}_${i}`,
      title: `${["Premium Coffee Blend", "Artisan Chocolate", "Craft Beer", "Organic Tea", "Gourmet Burger", "Farm Fresh Produce"][(i % 6)]} — ${cat}`,
      description: `Food & beverage ${cat.toLowerCase()} with mouth-watering visuals and appetizing presentation`,
      industry: "Food & Beverage",
      category: cat,
      tags: ["food", "beverage", cat.toLowerCase().replace(/\s+/g, "-"), "gourmet", "artisan", "culinary"],
      duration: [15, 20, 30][i % 3],
      aspectRatio: pick(aspectRatioOptions),
      quality: pick(qualityOptions),
      creditCost: 15 + i * 2,
      scenes: ["Ingredient Intro", "Preparation", "Final Plating", "Enjoyment Moment"],
      cameraAngles: ["macro", "overhead", "side-profile", "close-up"],
      cameraMovement: ["slow-pan", "gentle-zoom", "subtle-rotation", "tracking"],
      lighting: "warm-natural-food",
      environment: "clean-professional-kitchen",
      musicStyle: "warm-acoustic-instrumental",
      voiceStyle: "warm-culinary-host",
      tempo: "moderate",
      transitions: ["fade", "dissolve", "crossfade"],
      cta: "Try This Recipe",
      negativePrompt: "no unappetizing presentation, no cold food, no poor lighting",
      promptFragments: ["food presentation", "culinary artistry", "fresh ingredients", "appetizing visuals"],
      recommendedProvider: pick(providers.slice(1, 3)),
      providers: providers.slice(1, 3),
      fps: 24,
    }));
  }

  // === FITNESS & SPORTS (20 templates) ===
  const fitnessCategories = ["Product Showcase", "Fitness Transformation", "Before / After", "UGC Testimonial", "Tutorial", "Social Ad Hook"];
  for (const cat of fitnessCategories) {
    addTemplatesForIndustry("Fitness & Sports", cat, 3, (i) => ({
      id: `fitness_${cat.toLowerCase().replace(/\s+/g, "_")}_${i}`,
      title: `${["Home Gym Equipment", "Yoga Mat Premium", "Resistance Bands Set", "Protein Supplement", "Running Shoes", "Smart Fitness Tracker"][(i % 6)]} — ${cat}`,
      description: `Fitness ${cat.toLowerCase()} showcasing athletic gear and transformation results`,
      industry: "Fitness & Sports",
      category: cat,
      tags: ["fitness", "sports", "workout", cat.toLowerCase().replace(/\s+/g, "-"), "health", "motivation"],
      duration: [20, 25, 30][i % 3],
      aspectRatio: pick(aspectRatioOptions),
      quality: pick(qualityOptions),
      creditCost: 18 + i * 2,
      scenes: ["Start State", "Workout Montage", "Progress Show", "Result Reveal"],
      cameraAngles: ["full-body", "action", "close-up", "motivational"],
      cameraMovement: ["dynamic", "energetic", "tracking", "quick-cuts"],
      lighting: "bright-gym-studio",
      environment: "modern-fitness-studio",
      musicStyle: "upbeat-motivational-electronic",
      voiceStyle: "energetic-coach-voice",
      tempo: "fast",
      transitions: ["dynamic-cut", "fast-fade", "energetic-wipe"],
      cta: "Start Your Journey",
      negativePrompt: "no fake results, no unmotivated energy, no poor form",
      promptFragments: ["fitness journey", "workout motivation", "transformation results", "active lifestyle"],
      recommendedProvider: pick(providers),
      providers: providers,
      fps: 30,
    }));
  }

  // === SOCIAL MEDIA (25 templates) ===
  for (const cat of ["TikTok Ads", "Instagram Reels", "YouTube Shorts", "Social Ad Hook", "UGC Testimonial"]) {
    addTemplatesForIndustry("Social Media", cat, 5, (i) => ({
      id: `social_${cat.toLowerCase().replace(/\s+/g, "_")}_${i}`,
      title: `${["Viral Product Hook", "Trending Challenge", "Behind the Brand", "Quick Tip", "Day in the Life"][i % 5]} — ${cat}`,
      description: `${cat} optimized for maximum engagement and viral potential on social platforms`,
      industry: "Social Media",
      category: cat,
      tags: ["social-media", cat.toLowerCase().replace(/\s+/g, "-"), "viral", "trending", "engagement", "content"],
      duration: [10, 15, 20, 25, 30][i % 5],
      aspectRatio: "9:16",
      quality: pick(qualityOptions),
      creditCost: 12 + i * 2,
      scenes: ["Hook (0-2s)", "Build Up", "Payoff", "CTA"],
      cameraAngles: ["close-up", "fast-cut", "selfie", "reaction"],
      cameraMovement: ["quick-pan", "energetic", "dynamic", "handheld"],
      lighting: "bright-trend-aware",
      environment: "dynamic-varied-locations",
      musicStyle: "trending-platform-sounds",
      voiceStyle: "young-authentic-creator",
      tempo: "fast",
      transitions: ["quick-cut", "zoom", "flash", "match-cut"],
      cta: "Link in Bio / Follow",
      negativePrompt: "no slow pacing, no boring content, no low energy, no outdated trends",
      promptFragments: ["viral content", "trending format", "quick-cut editing", "high-energy engagement"],
      recommendedProvider: pick(providers),
      providers: providers,
      fps: [24, 30][i % 2],
    }));
  }

  // === REAL ESTATE (15 templates) ===
  for (const cat of ["Property Tour", "Cinematic Teaser", "Product Showcase", "Minimalist Storytelling", "Event Highlight"]) {
    addTemplatesForIndustry("Real Estate", cat, 3, (i) => ({
      id: `realestate_${cat.toLowerCase().replace(/\s+/g, "_")}_${i}`,
      title: `${["Luxury Villa", "Modern Apartment", "Commercial Space", "Beachfront Property", "Mountain Retreat"][i % 5]} — ${cat}`,
      description: `Real estate ${cat.toLowerCase()} with sweeping cinematic property showcases`,
      industry: "Real Estate",
      category: cat,
      tags: ["real-estate", "property", cat.toLowerCase().replace(/\s+/g, "-"), "luxury", "architecture", "home"],
      duration: [30, 45, 60][i % 3],
      aspectRatio: pick(aspectRatioOptions),
      quality: "ultra",
      creditCost: 25 + i * 5,
      scenes: ["Exterior Sweep", "Grand Entrance", "Living Spaces", "Bedrooms", "Amenities", "Closing Shot"],
      cameraAngles: ["wide", "sweeping", "detail", "lifestyle", "aerial"],
      cameraMovement: ["smooth-tracking", "virtual-walkthrough", "crane-shot", "slow-pan"],
      lighting: "natural-optimal",
      environment: "luxury-property-setting",
      musicStyle: "elegant-ambient-strings",
      voiceStyle: "premium-real-estate-agent",
      tempo: "slow",
      transitions: ["smooth-fade", "dissolve", "elegant-wipe"],
      cta: "Schedule a Viewing",
      negativePrompt: "no cluttered spaces, no poor lighting, no dated design, no low resolution",
      promptFragments: ["luxury property tour", "cinematic real estate", "premium showcase", "architectural beauty"],
      recommendedProvider: pick(providers.slice(0, 2)),
      providers: providers.slice(0, 2),
      fps: 30,
    }));
  }

  // === SaaS / BUSINESS (20 templates) ===
  for (const cat of ["Problem / Solution", "Customer Story", "Brand Story", "How It Works", "Educational Explainer", "Product Showcase", "Announcement"]) {
    addTemplatesForIndustry("SaaS", cat, 2, (i) => ({
      id: `saas_${cat.toLowerCase().replace(/\s+/g, "_")}_${i}`,
      title: `${["Analytics Dashboard", "Project Management", "CRM Platform", "Marketing Automation", "HR Software", "E-commerce Platform", "Cloud Storage"][i % 7]} — ${cat}`,
      description: `SaaS ${cat.toLowerCase()} demonstrating software value proposition and business impact`,
      industry: "SaaS",
      category: cat,
      tags: ["saas", "software", "business", cat.toLowerCase().replace(/\s+/g, "-"), "productivity", "technology"],
      duration: [20, 30, 45][i % 3],
      aspectRatio: pick(["16:9", "1:1"] as const),
      quality: pick(qualityOptions),
      creditCost: 20 + i * 3,
      scenes: ["Pain Point", "Solution Intro", "Key Features", "Results / ROI", "Call to Action"],
      cameraAngles: ["screen-capture", "talking-head", "b-roll", "animation"],
      cameraMovement: ["smooth-reveals", "cursor-movement", "subtle-zoom"],
      lighting: "professional-office-clean",
      environment: "modern-workspace-digital",
      musicStyle: "professional-corporate-ambient",
      voiceStyle: "professional-narrator-clear",
      tempo: "moderate",
      transitions: ["fade", "cut", "smooth-wipe"],
      cta: "Start Free Trial",
      negativePrompt: "no confusing UI, no unpolished demo, no poor audio quality",
      promptFragments: ["SaaS product demo", "business solution", "professional presentation", "efficiency gains"],
      recommendedProvider: pick(providers.slice(1, 3)),
      providers: providers.slice(1, 3),
      fps: 30,
    }));
  }

  // === ENTERTAINMENT (15 templates) ===
  for (const cat of ["Cinematic Teaser", "Event Highlight", "Announcement", "Behind the Scenes", "Gaming Montage"]) {
    addTemplatesForIndustry("Entertainment", cat, 3, (i) => ({
      id: `entertainment_${cat.toLowerCase().replace(/\s+/g, "_")}_${i}`,
      title: `${["Movie Trailer", "Music Video", "Concert Highlight", "Podcast Teaser", "Streaming Showcase"][i % 5]} — ${cat}`,
      description: `Entertainment ${cat.toLowerCase()} with dramatic cinematic production quality`,
      industry: "Entertainment",
      category: cat,
      tags: ["entertainment", "cinematic", cat.toLowerCase().replace(/\s+/g, "-"), "drama", "production", "creative"],
      duration: [20, 30, 45, 60][i % 4],
      aspectRatio: pick(aspectRatioOptions),
      quality: pick(["premium", "ultra"] as const),
      creditCost: 22 + i * 4,
      scenes: ["Mysterious Open", "Building Tension", "Climax Reveal", "Resolution"],
      cameraAngles: ["dramatic", "cinematic", "wide", "close-up", "aerial"],
      cameraMovement: ["slow-push", "dolly-zoom", "crane", "steady-cam"],
      lighting: "dramatic-mood-lighting",
      environment: "cinematic-staged-set",
      musicStyle: "epic-orchestral-dramatic",
      voiceStyle: "deep-cinematic-narrator",
      tempo: "slow",
      transitions: ["fade-to-black", "dissolve", "dramatic-wipe", "iris"],
      cta: "Get Tickets / Watch Now",
      negativePrompt: "no flat lighting, no low energy, no amateur production, no poor audio",
      promptFragments: ["cinematic experience", "dramatic storytelling", "professional production", "emotional impact"],
      recommendedProvider: pick(providers.slice(0, 2)),
      providers: providers.slice(0, 2),
      fps: [24, 60][i % 2],
    }));
  }

  // === LIFESTYLE (15 templates) ===
  for (const cat of ["Minimalist Storytelling", "Behind the Scenes", "Travel Guide", "Instagram Reels", "Brand Story"]) {
    addTemplatesForIndustry("Lifestyle", cat, 3, (i) => ({
      id: `lifestyle_${cat.toLowerCase().replace(/\s+/g, "_")}_${i}`,
      title: `${["Morning Routine", "Home Decor", "Sustainable Living", "Digital Nomad", "Self Care"][i % 5]} — ${cat}`,
      description: `Lifestyle ${cat.toLowerCase()} showcasing aspirational everyday living content`,
      industry: "Lifestyle",
      category: cat,
      tags: ["lifestyle", "inspiration", cat.toLowerCase().replace(/\s+/g, "-"), "aspirational", "everyday"],
      duration: [20, 30, 40][i % 3],
      aspectRatio: pick(aspectRatioOptions),
      quality: pick(qualityOptions),
      creditCost: 15 + i * 3,
      scenes: ["Scene Setting", "Activity", "Moment", "Reflection"],
      cameraAngles: ["wide", "lifestyle", "detail", "overhead"],
      cameraMovement: ["smooth-pan", "gentle-tracking", "slow-motion"],
      lighting: "warm-natural-soft",
      environment: "beautiful-home-setting",
      musicStyle: "calm-acoustic-inspirational",
      voiceStyle: "warm-inspirational-voice",
      tempo: "slow",
      transitions: ["fade", "dissolve", "soft-wipe"],
      cta: "Follow for Daily Inspiration",
      negativePrompt: "no cluttered scenes, no artificial feeling, no poor composition",
      promptFragments: ["aspirational lifestyle", "daily inspiration", "beautiful moments", "mindful living"],
      recommendedProvider: pick(providers.slice(1, 3)),
      providers: providers.slice(1, 3),
      fps: 24,
    }));
  }

  // === TECH (15 templates) ===
  for (const cat of ["Tech Review", "Comparison", "How It Works", "Unboxing", "Product Showcase"]) {
    addTemplatesForIndustry("Tech", cat, 3, (i) => ({
      id: `tech_${cat.toLowerCase().replace(/\s+/g, "_")}_${i}`,
      title: `${["AI Gadget", "Smart Home Hub", "Wireless Charger", "VR Headset", "Portable Speaker"][i % 5]} — ${cat}`,
      description: `Tech ${cat.toLowerCase()} with in-depth analysis and professional production`,
      industry: "Tech",
      category: cat,
      tags: ["tech", "gadgets", cat.toLowerCase().replace(/\s+/g, "-"), "review", "innovation", "digital"],
      duration: [20, 30, 45][i % 3],
      aspectRatio: pick(aspectRatioOptions),
      quality: pick(qualityOptions),
      creditCost: 18 + i * 3,
      scenes: ["Introduction", "Setup", "Testing", "Verdict"],
      cameraAngles: ["close-up", "wide", "macro", "b-roll"],
      cameraMovement: ["smooth-pan", "reveal", "zoom", "tracking"],
      lighting: "clean-professional-studio",
      environment: "modern-tech-workspace",
      musicStyle: "modern-electronic-uptempo",
      voiceStyle: "tech-reviewer-enthusiast",
      tempo: pick(["moderate", "fast"] as const),
      transitions: ["cut", "fade", "dynamic-wipe"],
      cta: "Read Full Review",
      negativePrompt: "no bias, no low quality footage, no poor audio",
      promptFragments: ["tech review", "honest opinion", "product testing", "detailed analysis"],
      recommendedProvider: pick(providers.slice(0, 3)),
      providers: providers.slice(0, 3),
      fps: 30,
    }));
  }

  // === RETAIL (15 templates) ===
  for (const cat of ["Product Showcase", "Seasonal Promotion", "Announcement", "Social Ad Hook", "Instagram Reels"]) {
    addTemplatesForIndustry("Retail", cat, 3, (i) => ({
      id: `retail_${cat.toLowerCase().replace(/\s+/g, "_")}_${i}`,
      title: `${["Summer Sale", "New Collection Drop", "Flash Deal", "Loyalty Program", "Gift Guide"][i % 5]} — ${cat}`,
      description: `Retail ${cat.toLowerCase()} driving sales with compelling promotional content`,
      industry: "Retail",
      category: cat,
      tags: ["retail", "shopping", cat.toLowerCase().replace(/\s+/g, "-"), "sale", "promotion", "deals"],
      duration: [15, 20, 30][i % 3],
      aspectRatio: pick(aspectRatioOptions),
      quality: pick(qualityOptions),
      creditCost: 12 + i * 2,
      scenes: ["Attention Grabber", "Product Display", "Offer Details", "Urgency Close"],
      cameraAngles: ["wide", "product", "lifestyle", "urgency"],
      cameraMovement: ["quick-cuts", "dynamic", "energy"],
      lighting: "bright-retail-studio",
      environment: "retail-store-setting",
      musicStyle: "upbeat-commercial-energetic",
      voiceStyle: "energetic-sales-voice",
      tempo: "fast",
      transitions: ["cut", "quick-fade", "dynamic-wipe"],
      cta: "Shop the Sale",
      negativePrompt: "no boring presentation, no low energy, no unclear messaging",
      promptFragments: ["retail promotion", "sale announcement", "product offer", "limited time"],
      recommendedProvider: pick(providers),
      providers: providers,
      fps: 30,
    }));
  }

  // === EDUCATION (12 templates) ===
  for (const cat of ["Tutorial", "Educational Explainer", "How It Works", "Review"]) {
    addTemplatesForIndustry("Education", cat, 3, (i) => ({
      id: `education_${cat.toLowerCase().replace(/\s+/g, "_")}_${i}`,
      title: `${["Online Course Promo", "Study Tips", "Skill Tutorial", "Educational Tool"][i % 4]} — ${cat}`,
      description: `Educational ${cat.toLowerCase()} making complex topics accessible and engaging`,
      industry: "Education",
      category: cat,
      tags: ["education", "learning", cat.toLowerCase().replace(/\s+/g, "-"), "tutorial", "knowledge", "skills"],
      duration: [20, 30, 45][i % 3],
      aspectRatio: pick(["16:9", "1:1"] as const),
      quality: pick(qualityOptions),
      creditCost: 15 + i * 3,
      scenes: ["Topic Intro", "Key Concept", "Example", "Summary"],
      cameraAngles: ["talking-head", "screen-share", "b-roll", "animation"],
      cameraMovement: ["minimal", "smooth-reveals", "subtle-zoom"],
      lighting: "clean-professional",
      environment: "classroom-or-studio",
      musicStyle: "focused-learning-ambient",
      voiceStyle: "calm-teacher-voice",
      tempo: "moderate",
      transitions: ["fade", "cut", "wipe"],
      cta: "Enroll Now / Learn More",
      negativePrompt: "no confusing explanations, no low production value, no distracting elements",
      promptFragments: ["educational content", "learning journey", "skill development", "knowledge sharing"],
      recommendedProvider: pick(providers.slice(1, 3)),
      providers: providers.slice(1, 3),
      fps: 24,
    }));
  }

  // === HEALTHCARE (10 templates) ===
  for (const cat of ["Product Showcase", "Educational Explainer", "Brand Story", "UGC Testimonial"]) {
    addTemplatesForIndustry("Healthcare", cat, 2, (i) => ({
      id: `healthcare_${cat.toLowerCase().replace(/\s+/g, "_")}_${i}`,
      title: `${["Wellness Supplement", "Fitness Tracker Pro", "Meditation App", "Health Monitoring Device"][(i % 4)]} — ${cat}`,
      description: `Healthcare ${cat.toLowerCase()} with professional and trustworthy presentation`,
      industry: "Healthcare",
      category: cat,
      tags: ["healthcare", "wellness", cat.toLowerCase().replace(/\s+/g, "-"), "health", "medical", "wellbeing"],
      duration: [20, 30][i % 2],
      aspectRatio: pick(aspectRatioOptions),
      quality: "premium",
      creditCost: 18 + i * 4,
      scenes: ["Problem Intro", "Solution Presentation", "Benefits", "Trust Building"],
      cameraAngles: ["professional", "close-up", "lifestyle", "detail"],
      cameraMovement: ["gentle", "smooth", "controlled"],
      lighting: "clean-sterile-professional",
      environment: "modern-clinic-setting",
      musicStyle: "calm-wellness-ambient",
      voiceStyle: "trusted-professional-voice",
      tempo: "slow",
      transitions: ["fade", "dissolve", "soft-wipe"],
      cta: "Learn About Wellness",
      negativePrompt: "no unprofessional content, no misleading claims, no poor production",
      promptFragments: ["healthcare innovation", "wellness journey", "professional medical", "trusted solutions"],
      recommendedProvider: pick(providers.slice(1, 2)),
      providers: providers.slice(1, 2),
      fps: 24,
    }));
  }

  // === AUTOMOTIVE (12 templates) ===
  for (const cat of ["Product Showcase", "Cinematic Teaser", "Behind the Scenes", "Event Highlight"]) {
    addTemplatesForIndustry("Automotive", cat, 3, (i) => ({
      id: `automotive_${cat.toLowerCase().replace(/\s+/g, "_")}_${i}`,
      title: `${["Electric SUV", "Sports Coupe", "Luxury Sedan", "Off-Road Adventure"][i % 4]} — ${cat}`,
      description: `Automotive ${cat.toLowerCase()} showcasing vehicles with cinematic driving footage`,
      industry: "Automotive",
      category: cat,
      tags: ["automotive", "cars", cat.toLowerCase().replace(/\s+/g, "-"), "luxury", "driving", "vehicles"],
      duration: [30, 45, 60][i % 3],
      aspectRatio: pick(["16:9", "9:16"] as const),
      quality: pick(["premium", "ultra"] as const),
      creditCost: 25 + i * 5,
      scenes: ["Teaser Intro", "Exterior Reveal", "Interior Detail", "Driving Dynamics", "Lifestyle Integration"],
      cameraAngles: ["wide", "close-up", "tracking", "aerial", "interior"],
      cameraMovement: ["tracking", "sweeping", "slow-motion", "drone"],
      lighting: "golden-hour-dramatic",
      environment: "scenic-road-studio",
      musicStyle: "epic-energetic-rock",
      voiceStyle: "deep-automotive-narrator",
      tempo: "moderate",
      transitions: ["fade", "dissolve", "dynamic-wipe", "speed-cut"],
      cta: "Book Test Drive",
      negativePrompt: "no dirty vehicles, no poor locations, no flat lighting, no low resolution",
      promptFragments: ["automotive showcase", "driving experience", "luxury vehicles", "cinematic car footage"],
      recommendedProvider: pick(providers.slice(0, 3)),
      providers: providers.slice(0, 3),
      fps: [30, 60][i % 2],
    }));
  }

  // === HOME & GARDEN (12 templates) ===
  for (const cat of ["Product Showcase", "Tutorial", "Before / After", "Minimalist Storytelling"]) {
    addTemplatesForIndustry("Home & Garden", cat, 3, (i) => ({
      id: `home_garden_${cat.toLowerCase().replace(/\s+/g, "_")}_${i}`,
      title: `${["Smart Home Device", "Garden Tool Set", "Furniture Collection", "Outdoor Lighting"][i % 4]} — ${cat}`,
      description: `Home & garden ${cat.toLowerCase()} showcasing home improvement and decor products`,
      industry: "Home & Garden",
      category: cat,
      tags: ["home", "garden", cat.toLowerCase().replace(/\s+/g, "-"), "decor", "improvement", "lifestyle"],
      duration: [20, 30, 40][i % 3],
      aspectRatio: pick(aspectRatioOptions),
      quality: pick(qualityOptions),
      creditCost: 15 + i * 3,
      scenes: ["Before State", "Transformation", "Final Result", "Enjoyment"],
      cameraAngles: ["wide", "detail", "lifestyle", "macro"],
      cameraMovement: ["smooth-pan", "reveal", "gentle-tracking"],
      lighting: "warm-soft-natural",
      environment: "beautiful-home-setting",
      musicStyle: "warm-acoustic-comfort",
      voiceStyle: "warm-home-host",
      tempo: "slow",
      transitions: ["fade", "dissolve", "crossfade"],
      cta: "Transform Your Space",
      negativePrompt: "no messy spaces, no poor staging, no unflattering angles",
      promptFragments: ["home transformation", "garden beauty", "interior design", "home improvement"],
      recommendedProvider: pick(providers.slice(1, 3)),
      providers: providers.slice(1, 3),
      fps: 24,
    }));
  }

  // === PET SUPPLIES (10 templates) ===
  for (const cat of ["Product Showcase", "UGC Testimonial", "Instagram Reels", "Tutorial"]) {
    addTemplatesForIndustry("Pet Supplies", cat, 2, (i) => ({
      id: `pets_${cat.toLowerCase().replace(/\s+/g, "_")}_${i}`,
      title: `${["Premium Pet Food", "Interactive Toy", "Comfort Bed", "Grooming Kit"][(i % 4)]} — ${cat}`,
      description: `Pet supplies ${cat.toLowerCase()} featuring adorable animals and happy pet moments`,
      industry: "Pet Supplies",
      category: cat,
      tags: ["pets", "animals", cat.toLowerCase().replace(/\s+/g, "-"), "dogs", "cats", "pet-care"],
      duration: [15, 20][i % 2],
      aspectRatio: pick(aspectRatioOptions),
      quality: pick(qualityOptions),
      creditCost: 12 + i * 3,
      scenes: ["Pet Intro", "Product Interaction", "Happy Moment", "Owner Love"],
      cameraAngles: ["eye-level", "close-up", "action", "lifestyle"],
      cameraMovement: ["gentle-tracking", "slow-motion", "stable"],
      lighting: "bright-warm-natural",
      environment: "home-comfortable-setting",
      musicStyle: "playful-cheerful-whimsical",
      voiceStyle: "warm-pet-lover-voice",
      tempo: "fast",
      transitions: ["cut", "fade", "playful-wipe"],
      cta: "Shop for Your Pet",
      negativePrompt: "no sad animals, no poor conditions, no low quality footage",
      promptFragments: ["pet happiness", "animal care", "pet products", "joyful moments"],
      recommendedProvider: pick(providers),
      providers: providers,
      fps: 24,
    }));
  }

  // === BABY & KIDS (10 templates) ===
  for (const cat of ["Product Showcase", "UGC Testimonial", "Brand Story", "Instagram Reels"]) {
    addTemplatesForIndustry("Baby & Kids", cat, 2, (i) => ({
      id: `baby_kids_${cat.toLowerCase().replace(/\s+/g, "_")}_${i}`,
      title: `${["Baby Care Set", "Educational Toy", "Kids Furniture", "Safety Products"][(i % 4)]} — ${cat}`,
      description: `Baby & kids ${cat.toLowerCase()} focusing on safety, development, and family happiness`,
      industry: "Baby & Kids",
      category: cat,
      tags: ["baby", "kids", cat.toLowerCase().replace(/\s+/g, "-"), "family", "parenting", "children"],
      duration: [15, 20][i % 2],
      aspectRatio: pick(aspectRatioOptions),
      quality: pick(qualityOptions),
      creditCost: 12 + i * 3,
      scenes: ["Family Moment", "Product in Use", "Development Benefit", "Happy Close"],
      cameraAngles: ["eye-level", "lifestyle", "close-up", "warm"],
      cameraMovement: ["gentle", "stable", "slow"],
      lighting: "warm-soft-family",
      environment: "family-home-setting",
      musicStyle: "gentle-lullaby-warm",
      voiceStyle: "warm-parent-voice",
      tempo: "slow",
      transitions: ["fade", "dissolve", "soft-wipe"],
      cta: "Shop for Your Family",
      negativePrompt: "no unsafe situations, no poor quality, no inappropriate content",
      promptFragments: ["family moments", "kids development", "parenting solutions", "baby care"],
      recommendedProvider: pick(providers.slice(1, 3)),
      providers: providers.slice(1, 3),
      fps: 24,
    }));
  }

  // === TRAVEL (12 templates) ===
  for (const cat of ["Travel Guide", "Cinematic Teaser", "Event Highlight", "Instagram Reels"]) {
    addTemplatesForIndustry("Travel", cat, 3, (i) => ({
      id: `travel_${cat.toLowerCase().replace(/\s+/g, "_")}_${i}`,
      title: `${["Beach Paradise", "Mountain Adventure", "City Explorer", "Cultural Journey"][i % 4]} — ${cat}`,
      description: `Travel ${cat.toLowerCase()} showcasing destinations with wanderlust-inspiring visuals`,
      industry: "Travel",
      category: cat,
      tags: ["travel", "destinations", cat.toLowerCase().replace(/\s+/g, "-"), "adventure", "wanderlust", "explore"],
      duration: [20, 30, 45][i % 3],
      aspectRatio: pick(aspectRatioOptions),
      quality: pick(["premium", "ultra"] as const),
      creditCost: 18 + i * 4,
      scenes: ["Destination Reveal", "Activities", "Local Culture", "Memories Close"],
      cameraAngles: ["wide", "aerial", "lifestyle", "detail", "panoramic"],
      cameraMovement: ["sweeping", "drone", "tracking", "slow-pan"],
      lighting: "golden-hour-natural",
      environment: "exotic-destination",
      musicStyle: "world-ambient-inspirational",
      voiceStyle: "warm-travel-host",
      tempo: "slow",
      transitions: ["fade", "dissolve", "crossfade"],
      cta: "Book Your Trip",
      negativePrompt: "no tourist crowds, no poor weather, no low resolution",
      promptFragments: ["travel inspiration", "destination beauty", "wanderlust", "adventure awaits"],
      recommendedProvider: pick(providers.slice(0, 3)),
      providers: providers.slice(0, 3),
      fps: [24, 30][i % 2],
    }));
  }

  // === GAMING (12 templates) ===
  for (const cat of ["Gaming Montage", "Cinematic Teaser", "Announcement", "Event Highlight"]) {
    addTemplatesForIndustry("Gaming", cat, 3, (i) => ({
      id: `gaming_${cat.toLowerCase().replace(/\s+/g, "_")}_${i}`,
      title: `${["Epic Battle", "Speed Run", "Boss Fight", "World Exploration"][i % 4]} — ${cat}`,
      description: `Gaming ${cat.toLowerCase()} with high-energy gameplay and dramatic gaming moments`,
      industry: "Gaming",
      category: cat,
      tags: ["gaming", "esports", cat.toLowerCase().replace(/\s+/g, "-"), "gameplay", "highlights", "entertainment"],
      duration: [20, 30, 45][i % 3],
      aspectRatio: pick(["16:9", "9:16"] as const),
      quality: pick(qualityOptions),
      creditCost: 18 + i * 3,
      scenes: ["Intense Open", "Action Sequence", "Highlight Moment", "Victory Close"],
      cameraAngles: ["first-person", "third-person", "cinematic", "replay"],
      cameraMovement: ["dynamic", "quick-cut", "tracking", "dramatic"],
      lighting: "game-world-lighting",
      environment: "virtual-game-world",
      musicStyle: "epic-game-soundtrack",
      voiceStyle: "energetic-game-host",
      tempo: "fast",
      transitions: ["quick-cut", "glitch", "fade", "dynamic-wipe"],
      cta: "Watch Full Stream",
      negativePrompt: "no laggy footage, no low graphics, no boring gameplay",
      promptFragments: ["gaming highlights", "epic gameplay", "competitive action", "gaming moments"],
      recommendedProvider: pick(providers),
      providers: providers,
      fps: 60,
    }));
  }

  // === MUSICAL INSTRUMENTS (8 templates) ===
  for (const cat of ["Product Showcase", "Tutorial", "Review", "UGC Testimonial"]) {
    addTemplatesForIndustry("Musical Instruments", cat, 2, (i) => ({
      id: `music_${cat.toLowerCase().replace(/\s+/g, "_")}_${i}`,
      title: `${["Premium Guitar", "Digital Piano", "Studio Headphones", "DJ Controller"][(i % 4)]} — ${cat}`,
      description: `Musical instrument ${cat.toLowerCase()} featuring professional audio and instrument demos`,
      industry: "Musical Instruments",
      category: cat,
      tags: ["music", "instruments", cat.toLowerCase().replace(/\s+/g, "-"), "audio", "professional", "studio"],
      duration: [20, 30][i % 2],
      aspectRatio: pick(["16:9", "1:1"] as const),
      quality: pick(qualityOptions),
      creditCost: 15 + i * 4,
      scenes: ["Instrument Reveal", "Sound Demo", "Feature Close-up", "Performance"],
      cameraAngles: ["close-up", "wide", "detail", "performance"],
      cameraMovement: ["smooth-pan", "gentle-zoom", "tracking"],
      lighting: "studio-professional-warm",
      environment: "recording-studio",
      musicStyle: "genre-demo-specific",
      voiceStyle: "musician-creator-voice",
      tempo: "moderate",
      transitions: ["fade", "dissolve", "crossfade"],
      cta: "Hear the Difference",
      negativePrompt: "no poor audio quality, no damaged instruments, no unprofessional demo",
      promptFragments: ["musical instrument demo", "professional audio", "musician showcase", "sound quality"],
      recommendedProvider: pick(providers.slice(1, 2)),
      providers: providers.slice(1, 2),
      fps: 24,
    }));
  }

  // === SUSTAINABILITY (8 templates) ===
  for (const cat of ["Brand Story", "Minimalist Storytelling", "Product Showcase", "Behind the Scenes"]) {
    addTemplatesForIndustry("Sustainability", cat, 2, (i) => ({
      id: `eco_${cat.toLowerCase().replace(/\s+/g, "_")}_${i}`,
      title: `${["Eco-Friendly Product", "Solar Innovation", "Zero Waste Kit", "Sustainable Fashion"][(i % 4)]} — ${cat}`,
      description: `Sustainability ${cat.toLowerCase()} highlighting eco-friendly products and green initiatives`,
      industry: "Sustainability",
      category: cat,
      tags: ["sustainability", "eco-friendly", cat.toLowerCase().replace(/\s+/g, "-"), "green", "environment", "ethical"],
      duration: [20, 30][i % 2],
      aspectRatio: pick(aspectRatioOptions),
      quality: pick(qualityOptions),
      creditCost: 14 + i * 4,
      scenes: ["Nature Intro", "Product Story", "Impact", "Future Vision"],
      cameraAngles: ["wide", "macro", "lifestyle", "detail"],
      cameraMovement: ["gentle", "smooth", "slow-paced"],
      lighting: "natural-daylight-clean",
      environment: "nature-outdoor-setting",
      musicStyle: "peaceful-nature-ambient",
      voiceStyle: "calm-eco-advocate",
      tempo: "slow",
      transitions: ["fade", "dissolve", "nature-wipe"],
      cta: "Make Green Choice",
      negativePrompt: "no plastic waste imagery, no pollution, no unethical content",
      promptFragments: ["sustainable living", "eco-friendly products", "green future", "ethical choices"],
      recommendedProvider: pick(providers.slice(1, 3)),
      providers: providers.slice(1, 3),
      fps: 24,
    }));
  }

  // === OFFICE SUPPLIES (8 templates) ===
  for (const cat of ["Product Showcase", "How It Works", "Tutorial", "Social Ad Hook"]) {
    addTemplatesForIndustry("Office Supplies", cat, 2, (i) => ({
      id: `office_${cat.toLowerCase().replace(/\s+/g, "_")}_${i}`,
      title: `${["Ergonomic Chair", "Smart Notebook", "Desk Organizer", "Productivity App"][(i % 4)]} — ${cat}`,
      description: `Office supplies ${cat.toLowerCase()} boosting workplace productivity and organization`,
      industry: "Office Supplies",
      category: cat,
      tags: ["office", "productivity", cat.toLowerCase().replace(/\s+/g, "-"), "workplace", "organization", "business"],
      duration: [15, 25][i % 2],
      aspectRatio: pick(aspectRatioOptions),
      quality: pick(qualityOptions),
      creditCost: 12 + i * 3,
      scenes: ["Problem", "Solution Introduced", "In Action", "Productivity Boost"],
      cameraAngles: ["overhead", "close-up", "lifestyle", "detail"],
      cameraMovement: ["smooth", "reveal", "gentle-zoom"],
      lighting: "bright-clean-office",
      environment: "modern-office-workspace",
      musicStyle: "professional-calm-focus",
      voiceStyle: "professional-productivity-host",
      tempo: "moderate",
      transitions: ["cut", "fade", "wipe"],
      cta: "Boost Your Workspace",
      negativePrompt: "no cluttered desks, no messy offices, no unprofessional setting",
      promptFragments: ["office productivity", "workspace organization", "professional tools", "efficiency boost"],
      recommendedProvider: pick(providers.slice(1, 3)),
      providers: providers.slice(1, 3),
      fps: 24,
    }));
  }

  // === SPORTS EQUIPMENT (10 templates) ===
  for (const cat of ["Product Showcase", "Fitness Transformation", "Tutorial", "UGC Testimonial", "Social Ad Hook"]) {
    addTemplatesForIndustry("Sports Equipment", cat, 2, (i) => ({
      id: `sports_equip_${cat.toLowerCase().replace(/\s+/g, "_")}_${i}`,
      title: `${["Pro Basketball", "Tennis Racket", "Cycling Gear", "Swimming Tech", "Camping Tent"][(i % 5)]} — ${cat}`,
      description: `Sports equipment ${cat.toLowerCase()} highlighting performance gear in action`,
      industry: "Sports Equipment",
      category: cat,
      tags: ["sports", "equipment", cat.toLowerCase().replace(/\s+/g, "-"), "performance", "athletic", "outdoor"],
      duration: [15, 20, 30][i % 3],
      aspectRatio: pick(aspectRatioOptions),
      quality: pick(qualityOptions),
      creditCost: 15 + i * 3,
      scenes: ["Action Intro", "Equipment Detail", "Performance Demo", "Athlete Close"],
      cameraAngles: ["action", "close-up", "wide", "slow-motion"],
      cameraMovement: ["tracking", "dynamic", "slow-motion", "action"],
      lighting: "outdoor-bright-natural",
      environment: "sports-field-arena",
      musicStyle: "energetic-sports-anthem",
      voiceStyle: "energetic-sports-host",
      tempo: "fast",
      transitions: ["dynamic-cut", "fast-fade", "action-wipe"],
      cta: "Upgrade Your Game",
      negativePrompt: "no poor performance, no low energy, no damaged equipment",
      promptFragments: ["sports performance", "athletic gear", "game ready", "pro equipment"],
      recommendedProvider: pick(providers),
      providers: providers,
      fps: [30, 60][i % 2],
    }));
  }

  // === BOOKS & PUBLISHING (8 templates) ===
  for (const cat of ["Product Showcase", "Brand Story", "Educational Explainer", "Review"]) {
    addTemplatesForIndustry("Books & Publishing", cat, 2, (i) => ({
      id: `books_${cat.toLowerCase().replace(/\s+/g, "_")}_${i}`,
      title: `${["Bestseller Novel", "Self-Help Guide", "Cookbook", "Children's Book"][(i % 4)]} — ${cat}`,
      description: `Book ${cat.toLowerCase()} showcasing published works and reading culture`,
      industry: "Books & Publishing",
      category: cat,
      tags: ["books", "publishing", cat.toLowerCase().replace(/\s+/g, "-"), "reading", "literature", "author"],
      duration: [15, 25][i % 2],
      aspectRatio: pick(aspectRatioOptions),
      quality: pick(qualityOptions),
      creditCost: 12 + i * 3,
      scenes: ["Book Reveal", "Content Preview", "Reader Experience", "Recommendation"],
      cameraAngles: ["close-up", "overhead", "lifestyle", "detail"],
      cameraMovement: ["gentle-pan", "slow-zoom", "page-turn"],
      lighting: "warm-library-soft",
      environment: "cozy-library-study",
      musicStyle: "soft-literary-ambient",
      voiceStyle: "warm-narrator-storyteller",
      tempo: "slow",
      transitions: ["fade", "dissolve", "page-turn-effect"],
      cta: "Get Your Copy",
      negativePrompt: "no damaged books, no poor lighting, no distracting backgrounds",
      promptFragments: ["book showcase", "reading experience", "literary journey", "author story"],
      recommendedProvider: pick(providers.slice(1, 3)),
      providers: providers.slice(1, 3),
      fps: 24,
    }));
  }

  // === ART & CRAFTS (8 templates) ===
  for (const cat of ["Product Showcase", "Tutorial", "Behind the Scenes", "Instagram Reels"]) {
    addTemplatesForIndustry("Art & Crafts", cat, 2, (i) => ({
      id: `art_${cat.toLowerCase().replace(/\s+/g, "_")}_${i}`,
      title: `${["Art Supply Kit", "DIY Craft Set", "Painting Collection", "Sculpture Tools"][(i % 4)]} — ${cat}`,
      description: `Art & crafts ${cat.toLowerCase()} inspiring creativity and showcasing artistic products`,
      industry: "Art & Crafts",
      category: cat,
      tags: ["art", "crafts", cat.toLowerCase().replace(/\s+/g, "-"), "creative", "diy", "artistic"],
      duration: [20, 30][i % 2],
      aspectRatio: pick(aspectRatioOptions),
      quality: pick(qualityOptions),
      creditCost: 12 + i * 3,
      scenes: ["Creative Intro", "Process", "Creation", "Final Piece"],
      cameraAngles: ["overhead", "close-up", "macro", "wide"],
      cameraMovement: ["gentle-zoom", "tracking", "slow-pan"],
      lighting: "bright-studio-artificial",
      environment: "artist-studio-workshop",
      musicStyle: "creative-inspirational-ambient",
      voiceStyle: "creative-artist-host",
      tempo: "moderate",
      transitions: ["fade", "crossfade", "creative-wipe"],
      cta: "Create Something Beautiful",
      negativePrompt: "no messy workspaces, no incomplete projects, no poor quality materials",
      promptFragments: ["artistic creation", "creative process", "diy inspiration", "craftsmanship"],
      recommendedProvider: pick(providers.slice(1, 3)),
      providers: providers.slice(1, 3),
      fps: 24,
    }));
  }

  // === MEDIA (8 templates) ===
  for (const cat of ["Review", "Brand Story", "Behind the Scenes", "Announcement"]) {
    addTemplatesForIndustry("Media", cat, 2, (i) => ({
      id: `media_${cat.toLowerCase().replace(/\s+/g, "_")}_${i}`,
      title: `${["Podcast Channel", "News Update", "Documentary Teaser", "Media Kit"][(i % 4)]} — ${cat}`,
      description: `Media ${cat.toLowerCase()} with professional broadcast-quality production`,
      industry: "Media",
      category: cat,
      tags: ["media", "broadcast", cat.toLowerCase().replace(/\s+/g, "-"), "news", "content", "production"],
      duration: [20, 30, 45][i % 3],
      aspectRatio: pick(["16:9", "1:1"] as const),
      quality: pick(["premium", "ultra"] as const),
      creditCost: 18 + i * 4,
      scenes: ["Headline Open", "Story Development", "Expert Insight", "Closing Statement"],
      cameraAngles: ["professional", "talking-head", "b-roll", "wide"],
      cameraMovement: ["stable", "smooth-pan", "controlled"],
      lighting: "professional-studio-broadcast",
      environment: "news-studio-professional",
      musicStyle: "professional-news-ambient",
      voiceStyle: "professional-journalist",
      tempo: "moderate",
      transitions: ["cut", "fade", "professional-wipe"],
      cta: "Subscribe for Updates",
      negativePrompt: "no unprofessional content, no poor audio, no biased reporting",
      promptFragments: ["media production", "broadcast quality", "professional journalism", "storytelling"],
      recommendedProvider: pick(providers.slice(1, 3)),
      providers: providers.slice(1, 3),
      fps: 30,
    }));
  }

  // === EVENTS (8 templates) ===
  for (const cat of ["Event Highlight", "Behind the Scenes", "Announcement", "Social Ad Hook"]) {
    addTemplatesForIndustry("Events", cat, 2, (i) => ({
      id: `events_${cat.toLowerCase().replace(/\s+/g, "_")}_${i}`,
      title: `${["Conference Recap", "Product Launch Event", "Wedding Highlight", "Festival Moments"][(i % 4)]} — ${cat}`,
      description: `Event ${cat.toLowerCase()} capturing memorable moments with dynamic coverage`,
      industry: "Events",
      category: cat,
      tags: ["events", "celebration", cat.toLowerCase().replace(/\s+/g, "-"), "highlights", "memories", "occasion"],
      duration: [30, 45, 60][i % 3],
      aspectRatio: pick(aspectRatioOptions),
      quality: pick(qualityOptions),
      creditCost: 20 + i * 5,
      scenes: ["Venue Wide", "Key Moments", "Guest Reactions", "Closing Memories"],
      cameraAngles: ["wide", "crowd", "close-up", "detail", "aerial"],
      cameraMovement: ["tracking", "sweeping", "stable", "handheld-emotive"],
      lighting: "event-ambient-mixed",
      environment: "event-venue-setting",
      musicStyle: "emotional-uplifting-orchestral",
      voiceStyle: "warm-event-host",
      tempo: "moderate",
      transitions: ["fade", "dissolve", "crossfade"],
      cta: "Relive the Moments",
      negativePrompt: "no blurry footage, no poor audio, no empty spaces",
      promptFragments: ["event coverage", "memorable moments", "celebration highlights", "special occasions"],
      recommendedProvider: pick(providers.slice(0, 3)),
      providers: providers.slice(0, 3),
      fps: 30,
    }));
  }

  // === CROSS-INDUSTRY (20 templates) ===
  for (const cat of ["Product Showcase", "Social Ad Hook", "Announcement", "Instagram Reels", "Brand Story"]) {
    addTemplatesForIndustry("Cross-Industry", cat, 4, (i) => ({
      id: `general_${cat.toLowerCase().replace(/\s+/g, "_")}_${i}`,
      title: `${["Versatile Product", "Universal Ad", "Multi-Purpose Tool", "Smart Solution"][i % 4]} — ${cat}`,
      description: `Versatile ${cat.toLowerCase()} adaptable for any product or industry with proven formats`,
      industry: "Cross-Industry",
      category: cat,
      tags: ["general", "versatile", cat.toLowerCase().replace(/\s+/g, "-"), "professional", "adaptable"],
      duration: [15, 20, 25, 30][i % 4],
      aspectRatio: pick(aspectRatioOptions),
      quality: pick(qualityOptions),
      creditCost: 12 + i * 2,
      scenes: ["Opening Hook", "Key Feature", "Benefit Showcase", "Call to Action"],
      cameraAngles: ["product", "lifestyle", "detail", "close-up"],
      cameraMovement: ["smooth", "dynamic", "professional"],
      lighting: "bright-clean-versatile",
      environment: "clean-professional-versatile",
      musicStyle: pick(["corporate-professional", "upbeat-modern", "calm-ambient", "inspiring-uplifting"]),
      voiceStyle: pick(["professional-narrator", "friendly-host", "authoritative-voice", "warm-storyteller"]),
      tempo: pick(["moderate", "fast"] as const),
      transitions: ["cut", "fade", "dissolve"],
      cta: "Learn More / Shop Now",
      negativePrompt: "no poor production, no inconsistent style, no low effort content",
      promptFragments: ["professional showcase", "versatile content", "polished production", "engaging presentation"],
      recommendedProvider: pick(providers),
      providers: providers,
      fps: 30,
    }));
  }

  return templates;
}

export function getCategoryTree(): Record<string, { name: string; count: number; industries: string[]; subcategories?: Record<string, { name: string; count: number; industries: string[] }> }> {
  return {};
}
