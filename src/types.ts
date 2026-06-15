export interface Plant {
  id: string;
  speciesName: string;
  commonName: string;
  intro: string;
  nickname: string;
  location: string;
  wateringIntervalDays: number;
  lastWateredDate: string; // YYYY-MM-DD
  nextWateringDate: string; // YYYY-MM-DD
  healthStatus: "건강함" | "물 부족" | "과습" | "병해충" | "햇빛 부족";
  healthScore: number;
  imageUrl: string;
  actions: string[];
  wateringHistory: string[]; // List of YYYY-MM-DD dates watered
  lightScore: number;
  lightDesc: string;
  humidityScore: number;
  humidityDesc: string;
  tempMin: number;
  tempMax: number;
  tempDesc: string;
  createdDate: string;
}

export interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
  likedByUser: boolean;
  plantName?: string;
  plantStatus?: string;
  imageUrl?: string;
  comments: Comment[];
  tags: string[];
}
