"use client";

import { Reddit, XOutlined } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Platform, platforms } from "@/constants";
import { env } from "@/env.mjs";
import {
  generateFacebookShareUrl,
  generateLinkedinShareUrl,
  generateRedditShareUrl,
  generateTwitterShareUrl,
} from "@/lib/utils";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { readStreamableValue } from "ai/rsc";
import { Copy, CopyCheck, FacebookIcon, Flame, Laugh, LinkedinIcon, Share2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { roastAction } from "../actions";

export default function Page() {
  const [platform, setPlatform] = useState<Platform>("github");
  const [username, setUsername] = useState<string | undefined>();
  const [roast, setRoast] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const startRoast = () => {
    startTransition(async () => {
      const { output } = await roastAction({ username: username ?? "", platform });
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
                value={username ?? undefined}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              disabled={isPending}
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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Share2 className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Share roast</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href={generateTwitterShareUrl(env.NEXT_PUBLIC_APP_URL)}
            className="flex items-center gap-2"
            target="_blank"
          >
            <XOutlined className="stroke-2" />
            <span>Twitter</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={generateLinkedinShareUrl(env.NEXT_PUBLIC_APP_URL)}
            className="flex items-center gap-2"
            target="_blank"
          >
            <LinkedinIcon className="size-4 stroke-2" />
            <span>LinkedIn</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={generateFacebookShareUrl(env.NEXT_PUBLIC_APP_URL)}
            className="flex items-center gap-2"
            target="_blank"
          >
            <FacebookIcon className="size-4" />
            <span>Facebook</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link
            href={generateRedditShareUrl(env.NEXT_PUBLIC_APP_URL)}
            className="flex items-center gap-2"
            target="_blank"
          >
            <Reddit />
            <span>Reddit</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            navigator.clipboard.writeText(env.NEXT_PUBLIC_APP_URL);
            toast.success("Link copied to clipboard!");
          }}
          className="flex items-center gap-2"
        >
          <Copy className="size-4" /> Copy link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
        toast.success("Roast copied to clipboard!");
        setTimeout(() => setIsCopied(false), 2000);
      }}
    >
      {isCopied ? <CopyCheck className="size-4" /> : <Copy className="size-4" />}
    </button>
  );
}
