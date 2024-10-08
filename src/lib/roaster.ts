export class Roaster {
  constructor(private readonly username: string) {}

  async github() {
    const data = await fetch(
      `https://api.github.com/users/${this.username}`,
    ).then((res) => res.json());
    return data;
  }
  async youtube() {
    const data = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&forHandle=@${this.username}&key=${process.env.YOUTUBE_API_KEY}`,
    ).then((res) => res.json());
    return data;
  }
  async reddit() {
    const about = await fetch(
      `https://www.reddit.com/user/${this.username}/about.json`,
    ).then((res) => res.json());
    const comments = await fetch(
      `https://www.reddit.com/user/${this.username}/comments.json`,
    ).then((res) => res.json());
    const data = {
      about,
      comments,
    };
    return data;
  }
}
