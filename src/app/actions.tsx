"use server";

import type { Platform } from "@/constants";
import { Roaster } from "@/lib/roaster";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";

export async function roastAction({
	username,
	platform,
}: { username: string; platform: Platform }) {
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
		console.log({ user });
		data = JSON.stringify(user);
	}
	const stream = createStreamableValue("");

	(async () => {
		const { textStream } = await streamText({
			model: openai("gpt-4o-mini"),
			prompt: `give a short and harsh roasting for the following profile: ${username}. Here are the details: ${data}`,
		});

		for await (const delta of textStream) {
			stream.update(delta);
		}

		stream.done();
	})();

	return { output: stream.value };
}
