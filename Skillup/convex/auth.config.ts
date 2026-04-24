import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      domain: "https://dashing-teal-90.clerk.accounts.dev",
      applicationID: "convex",
    },
  ]
} satisfies AuthConfig;