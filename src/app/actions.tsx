"use server";

import type { Platform } from "@/constants";
import { Roaster } from "@/lib/roaster";
import { unkey } from "@/lib/unkey.ratelimit";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";

export async function roastAction({
  username,
  platform,
}: { username: string; platform: Platform }) {
  try {
    const ratelimit = await unkey.limit(JSON.stringify({ username, platform }));
    if (!ratelimit.success) {
      throw new Error("Ratelimit exceeded");
    }
    let data = "";
    const roaster = new Roaster(username);

    if (platform === "github") {
      const user = await roaster.github();
      data = JSON.stringify(user);
    } else if (platform === "youtube") {
      const user = await roaster.youtube();
      data = JSON.stringify(user);
    } else if (platform === "reddit") {
      const user = await roaster.reddit();
      data = JSON.stringify(user);
    } else if (platform === "linkedin") {
      data = await roaster.linkedin();
    } else if (platform === "twitter") {
      data = await roaster.twitter();
    } else if (platform === "instagram") {
      data = await roaster.instagram();
    }
    const stream = createStreamableValue("");

    (async () => {
      const prompt =
        platform === "linkedin" || platform === "twitter"
          ? `give a short and harsh roasting from this text: ${data}`
          : `give a short and harsh roasting for the following ${platform} profile: ${username}. Here are the details: ${JSON.stringify(data)}, mention counts and metrics if possible.`;
      const { textStream } = await streamText({
        model: openai("gpt-4o-mini"),
        prompt,
      });

      for await (const delta of textStream) {
        stream.update(delta);
      }

      stream.done();
    })();

    return { output: stream.value };
  } catch (error) {
    console.error(error);
    const stream = createStreamableValue("Oops! Looks like your username is too bad to roast.");
    stream.done();
    return { output: stream.value };
  }
}
