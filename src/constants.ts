export const platforms = ["github", "youtube", "reddit"] as const;

export type Platform = (typeof platforms)[number];

export const siteConfig = {
  name: "RoastLM",
  description:
    "Prepare to get roasted with AI! Enter your username and watch the AI burn.",
} as const;
