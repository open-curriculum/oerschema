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
  
  // In production (GitHub Pages), add the repo name as base
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return `/oerschema-v7/${cleanPath}`;
  }
  
  // In development, just use the regular path
  return `/${cleanPath}`;
}