import { SignalCategory } from './types';

export const SCULPTURE_KEYWORDS = [
    "sculpture", "3D printing", "fabrication", "bronze casting",
    "clay", "ceramic", "foundry", "digital sculpting",
    "robotic arm", "CNC", "marble", "stone carving",
    "material science", "installation art", "public sculpture",
    "additive manufacturing", "metal sintering"
];

export const CATEGORY_LABELS: Record<SignalCategory, string> = {
    [SignalCategory.BreakthroughMaterial]: "Material Science",
    [SignalCategory.NewFabricationMethod]: "Fabrication Tech",
    [SignalCategory.MuseumAcquisition]: "Museum & Curatorial",
    [SignalCategory.ArtistInnovation]: "Artist Innovation",
    [SignalCategory.AiToolRelease]: "AI & Generative 3D",
    [SignalCategory.MarketTrend]: "Market Dynamics",
    [SignalCategory.ResearchPaper]: "Academic Research",
    [SignalCategory.EventOrBiennale]: "Events & Biennales",
};

export const CATEGORY_COLORS: Record<SignalCategory, string> = {
    [SignalCategory.BreakthroughMaterial]: "#10b981", // Emerald
    [SignalCategory.NewFabricationMethod]: "#3b82f6", // Blue
    [SignalCategory.MuseumAcquisition]: "#8b5cf6", // Violet
    [SignalCategory.ArtistInnovation]: "#f59e0b", // Amber
    [SignalCategory.AiToolRelease]: "#ec4899", // Pink
    [SignalCategory.MarketTrend]: "#14b8a6", // Teal
    [SignalCategory.ResearchPaper]: "#6366f1", // Indigo
    [SignalCategory.EventOrBiennale]: "#f43f5e", // Rose
};

// Based on Python script weights
export const WEIGHTS: Record<SignalCategory, number> = {
    [SignalCategory.BreakthroughMaterial]: 3.0,
    [SignalCategory.NewFabricationMethod]: 2.5,
    [SignalCategory.MuseumAcquisition]: 2.0,
    [SignalCategory.ArtistInnovation]: 1.5,
    [SignalCategory.AiToolRelease]: 2.5,
    [SignalCategory.MarketTrend]: 1.2,
    [SignalCategory.ResearchPaper]: 2.0,
    [SignalCategory.EventOrBiennale]: 1.8,
};