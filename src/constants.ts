import { Reddit } from "@/components/icons";
import { GithubIcon, YoutubeIcon } from "lucide-react";

export const platforms = [
  {
    name: "github",
    label: "GitHub",
    icon: GithubIcon,
  },
  {
    name: "youtube",
    label: "YouTube",
    icon: YoutubeIcon,
  },
  {
    name: "reddit",
    label: "Reddit",
    icon: Reddit,
  },
] as const;

export type Platform = (typeof platforms)[number]["name"];

export const siteConfig = {
  name: "RoastLM",
  description:
    "Prepare to get roasted with AI! Enter your username and watch the AI burn.",
  url: "https://roastlm.vercel.app",
} as const;
