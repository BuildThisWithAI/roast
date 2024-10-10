import { env } from "@/env.mjs";
import { Ratelimit } from "@unkey/ratelimit";

export const unkey = new Ratelimit({
  rootKey: env.UNKEY_ROOT_KEY,
  namespace: "roast.lm",
  limit: 10,
  duration: "30s",
});
