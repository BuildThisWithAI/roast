"use client";

import { Reddit, XOutlined } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Platform, platforms, siteConfig } from "@/constants";
import { readStreamableValue } from "ai/rsc";
import {
  Copy,
  CopyCheck,
  Facebook,
  Flame,
  Laugh,
  Linkedin,
  LinkedinIcon,
  LucideFacebook,
  Share,
  Share2,
  XIcon,
} from "lucide-react";
import { parseAsString, parseAsStringLiteral, useQueryState } from "nuqs";
import { useState, useTransition } from "react";
import {
  FacebookIcon,
  FacebookMessengerIcon,
  FacebookMessengerShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  RedditShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { toast } from "sonner";
import { roastAction } from "./actions";

export default function Page() {
  const [platform, setPlatform] = useQueryState(
    "platform",
    parseAsStringLiteral(platforms.map(({ name }) => name)).withDefault("github"),
  );
  const [username, setUsername] = useQueryState("username", parseAsString.withDefault(""));
  const [roast, setRoast] = useState("");
  const [isPending, startTransition] = useTransition();

  const startRoast = () => {
    startTransition(async () => {
      const { output } = await roastAction({ username, platform });
      for await (const delta of readStreamableValue(output)) {
        setRoast((currentGeneration) => `${currentGeneration}${delta}`);
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRoast("");
    startRoast();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/70 to-primary flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Flame className="h-6 w-6 text-primary" />
            RoastLM
          </CardTitle>
          <CardDescription className="text-center">
            Prepare to get roasted! <br />
            Enter your username and watch the AI burn.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platform" className="text-foreground/80">
                Select Platform
              </Label>
              <Select onValueChange={(v: Platform) => setPlatform(v)} value={platform}>
                <SelectTrigger id="platform" className="capitalize">
                  <SelectValue placeholder="Choose a platform" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map(({ name, label, icon: Icon }) => (
                    <SelectItem key={name} value={name}>
                      <div className="flex items-center">
                        <Icon className="h-5 w-5" />
                        <span className="ml-2">{label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="platform" className="text-foreground/80">
                Username
              </Label>
              <Input
                id="username"
                placeholder="Enter the username to roast"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              disabled={isPending || username === ""}
              className="w-full bg-red-500 hover:bg-red-600 transition-colors duration-200"
            >
              {isPending ? "Roasting..." : "Roast Me!"}
            </Button>
          </form>
          {roast && (
            <div className="mt-6 p-4 bg-orange-100 rounded-lg">
              <div className="flex justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Laugh className="h-5 w-5" />
                  <h3 className="font-semibold text-red-600 ">AI Roast:</h3>
                </div>
                <div className="flex items-center gap-2">
                  <CopyButton text={roast} />
                  <ShareButton />
                </div>
              </div>
              <p className="text-gray-800 italic">{roast}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ShareButton() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Share2 className="mr-2 h-4 w-4" />
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <h3 className="font-medium leading-none">Share this website</h3>
          <p className="text-sm text-muted-foreground">Choose a social media platform.</p>
          <div className="grid grid-cols-2 gap-2">
            <TwitterShareButton
              url={siteConfig.url}
              title={siteConfig.name}
              className="group"
              hashtags={["roastlm", "ai"]}
            >
              <span className="flex items-center gap-2 group-hover:bg-muted p-2 rounded-md border">
                <XOutlined className="size-5" /> Twitter
              </span>
            </TwitterShareButton>
            <LinkedinShareButton
              url={siteConfig.url}
              title={siteConfig.name}
              summary={siteConfig.description}
              className="group"
            >
              <span className="flex items-center gap-2 group-hover:bg-muted p-2 rounded-md border">
                <LinkedinIcon className="size-5" /> Linkedin
              </span>
            </LinkedinShareButton>
            <FacebookShareButton url={siteConfig.url} hashtag="#roastlm" className="group">
              <span className="flex items-center gap-2 group-hover:bg-muted p-2 rounded-md border">
                <LucideFacebook className="size-5" /> Facebook
              </span>
            </FacebookShareButton>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function CopyButton({ text }: { text: string }) {
  const [isCopied, setIsCopied] = useState(false);
  return (
    <button
      type="button"
      title="Copy text"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setIsCopied(true);
        toast.success("Copied to clipboard!");
        setTimeout(() => setIsCopied(false), 2000);
      }}
    >
      {isCopied ? <CopyCheck className="size-4" /> : <Copy className="size-4" />}
    </button>
  );
}
