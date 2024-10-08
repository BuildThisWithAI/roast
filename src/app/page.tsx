"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { type Platform, platforms } from "@/constants";
import { readStreamableValue } from "ai/rsc";
import { Flame, Laugh } from "lucide-react";
import { useState, useTransition } from "react";
import { roastAction } from "./actions";

export default function Page() {
	const [platform, setPlatform] = useState<Platform>("github");
	const [username, setUsername] = useState("");
	const [roast, setRoast] = useState("");
	const [isPending, startTransition] = useTransition();

	const handleRoast = (e: React.FormEvent) => {
		e.preventDefault();
		setRoast("");
		startTransition(async () => {
			const { output } = await roastAction({ username, platform });
			for await (const delta of readStreamableValue(output)) {
				setRoast((currentGeneration) => `${currentGeneration}${delta}`);
			}
		});
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
						<Flame className="h-6 w-6 text-red-500" />
						RoastLM
					</CardTitle>
					<CardDescription className="text-center">
						Prepare to get roasted! Enter your username and watch the AI burn.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleRoast} className="space-y-4">
						<div className="space-y-2">
							<label
								htmlFor="platform"
								className="text-sm font-medium text-gray-700"
							>
								Select Platform
							</label>
							<Select
								onValueChange={(v: Platform) => setPlatform(v)}
								value={platform}
							>
								<SelectTrigger id="platform" className="capitalize">
									<SelectValue placeholder="Choose a platform" />
								</SelectTrigger>
								<SelectContent>
									{platforms.map((platform) => (
										<SelectItem
											key={platform}
											value={platform}
											className="capitalize"
										>
											{platform}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<label
								htmlFor="username"
								className="text-sm font-medium text-gray-700"
							>
								Username
							</label>
							<Input
								id="username"
								placeholder="Enter the username to roast"
								value={username}
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
							<h3 className="font-semibold text-red-600 flex items-center gap-2 mb-2">
								<Laugh className="h-5 w-5" />
								AI Roast:
							</h3>
							<p className="text-gray-800 italic">{roast}</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
