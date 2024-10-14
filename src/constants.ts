import { Reddit, XOutlined } from "@/components/icons";
import { GithubIcon, InstagramIcon, LinkedinIcon, YoutubeIcon } from "lucide-react";

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
  {
    name: "linkedin",
    label: "LinkedIn",
    icon: LinkedinIcon,
  },
  {
    name: "twitter",
    label: "Twitter",
    icon: XOutlined,
  },
  {
    name: "instagram",
    label: "Instagram",
    icon: InstagramIcon,
  },
] as const;

export type Platform = (typeof platforms)[number]["name"];

export const siteConfig = {
  name: "RoastLM",
  description: "Prepare to get roasted with AI! Enter your username and watch the AI burn.",
} as const;
