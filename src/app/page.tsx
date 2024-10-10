"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Platform, platforms, siteConfig } from "@/constants";
import { env } from "@/env.mjs";
import { readStreamableValue } from "ai/rsc";
import { Copy, CopyCheck, Flame, Laugh } from "lucide-react";
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "next-share";
import { parseAsString, parseAsStringLiteral, useQueryState } from "nuqs";
import { useState, useTransition } from "react";
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
                <CopyButton text={roast} />
              </div>
              <p className="text-gray-800 italic">{roast}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <ShareButton />
        </CardFooter>
      </Card>
    </div>
  );
}

function ShareButton() {
  return (
    <div className="flex gap-2 items-center">
      <TwitterShareButton
        url={env.NEXT_PUBLIC_APP_URL}
        title={siteConfig.name}
        hashtags={["roastlm", "ai"]}
        className="bg-black"
      >
        <TwitterIcon size={32} round />
      </TwitterShareButton>
      <LinkedinShareButton
        url={env.NEXT_PUBLIC_APP_URL}
        title={siteConfig.name}
        summary={siteConfig.description}
      >
        <LinkedinIcon size={32} round />
      </LinkedinShareButton>
      <FacebookShareButton
        url={env.NEXT_PUBLIC_APP_URL}
        hashtag="#roastlm"
        quote={siteConfig.description}
      >
        <FacebookIcon size={32} round />
      </FacebookShareButton>
      <RedditShareButton url={env.NEXT_PUBLIC_APP_URL} title={siteConfig.name}>
        <RedditIcon size={32} round />
      </RedditShareButton>
    </div>
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
