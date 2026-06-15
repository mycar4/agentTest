// src/types.ts
export interface Stop {
  period: string;
  time: string;
  tag: string;
  title: string;
  description: string;
  image?: string;
  completed?: boolean;
}

export interface Itinerary {
  id: string;
  city: string;
  title: string;
  bestTime: string;
  weatherTip: string;
  temperature: string;
  mainImage: string;
  stops: Stop[];
}

export interface UserProfile {
  name: string;
  avatarUrl: string;
  travelStyle: string;
  email: string;
}

export interface CompanionApp {
  id: string;
  name: string;
  url: string;
  desc: string;
  category: string;
}


export interface Stop {
  period: string;       // "오전", "점심", "오후", "저녁"
  time: string;         // e.g. "08:00 - 11:00"
  tag: string;          // e.g. "커피 & 전망"
  title: string;        // e.g. "필라투스 산의 일출"
  description: string;  // e.g. "세계에서 가장 경사가 급한..."
  image?: string;       // Optional image url
  completed?: boolean;  // Task check state
}

export interface Itinerary {
  id: string;
  city: string;
  title: string;
  bestTime: string;
  weatherTip: string;
  temperature: string;
  mainImage: string;
  stops: Stop[];
}

export interface UserProfile {
  name: string;
  avatarUrl: string;
  travelStyle: string;
  email: string;
}
