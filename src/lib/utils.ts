import { siteConfig } from "@/constants";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateLinkedinShareUrl(shareUrl: string) {
  const url = new URL("/feed", "https://www.linkedin.com");
  url.searchParams.append("shareActive", "true");
  url.searchParams.append("shareUrl", shareUrl);
  url.searchParams.append("title", siteConfig.name);
  return url.toString();
}

export function generateRedditShareUrl(shareUrl: string) {
  const url = new URL("/submit", "https://www.reddit.com");
  url.searchParams.append("url", shareUrl);
  url.searchParams.append("title", siteConfig.name);
  url.searchParams.append("type", "LINK");
  return url.toString();
}

export function generateTwitterShareUrl(shareUrl: string) {
  const url = new URL("/intent/tweet", "https://twitter.com");
  url.searchParams.append("url", shareUrl);
  url.searchParams.append(
    "text",
    "🔥 This tool absolutely roasted me! Dare to try it yourself? Check it out: ",
  );
  url.searchParams.append("hashtags", "roastlm");
  return url.toString();
}

export function generateFacebookShareUrl(shareUrl: string) {
  const url = new URL("/sharer/sharer.php", "https://www.facebook.com");
  url.searchParams.append("u", shareUrl);
  return url.toString();
}
