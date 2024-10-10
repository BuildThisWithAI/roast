import { env } from "@/env.mjs";

export class Roaster {
  constructor(private readonly username: string) {}

  async github() {
    const overview = await fetch(`https://api.github.com/users/${this.username}`).then((res) =>
      res.json(),
    );
    const repos = await fetch(
      `https://api.github.com/users/${this.username}/repos?sort=updated`,
    ).then((res) => res.json());

    const data = {
      name: overview.name,
      bio: overview.bio,
      company: overview.company,
      location: overview.location,
      followers: overview.followers,
      following: overview.following,
      public_repos: overview.public_repos,
      last_15_repositories: repos
        .map((repo: any) => ({
          name: repo.name,
          description: repo.description,
          language: repo.language,
          stargazers_count: repo.stargazers_count,
          open_issues_count: repo.open_issues_count,
          license: repo.license,
          fork: repo.fork,
        }))
        .slice(0, 15),
    };
    return data;
  }
  async youtube() {
    const data = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&forHandle=@${this.username}&key=${process.env.YOUTUBE_API_KEY}`,
    ).then((res) => res.json());
    return data;
  }
  async reddit() {
    const about = await fetch(`https://www.reddit.com/user/${this.username}/about.json`).then(
      (res) => res.json(),
    );
    const comments = await fetch(`https://www.reddit.com/user/${this.username}/comments.json`).then(
      (res) => res.json(),
    );

    return {
      about,
      comments,
    };
  }
  async linkedin() {
    const username = this.username.startsWith("https://www.linkedin.com/in/")
      ? this.username.replace("https://www.linkedin.com/in/", "")
      : this.username;
    const url = new URL("/linkedin", env.ROAST_LINKEDIN_API);
    url.searchParams.append("username", username);
    const res = await fetch(url);
    const data = await res.json();
    return data.roast;
  }
}
