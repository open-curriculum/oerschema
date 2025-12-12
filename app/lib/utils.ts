import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Prefixes a path with the base URL if in production (GitHub Pages)
 * @param path The path to the asset
 * @returns The path with the correct base URL
 */
export function withBase(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // In production (any non-localhost environment)
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    // Check if we're on Vercel or GitHub Pages
    // URLs with "vercel.app" indicate Vercel deployment
    if (window.location.hostname.includes('vercel.app')) {
      return `/${cleanPath}`;  // No prefix needed for Vercel
    } else {
      // Assume GitHub Pages for other non-localhost environments
      return `/oerschema-v7/${cleanPath}`;
    }
  }
  
  // In development, just use the regular path
  return `/${cleanPath}`;
}