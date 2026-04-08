import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      domain: "https://wise-starfish-47.clerk.accounts.dev",
      applicationID: "convex",
    },
  ]
} satisfies AuthConfig;