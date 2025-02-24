import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|public|.*\\..*|signin|signup).*)",
    "/(api|trpc)(.*)",
  ],
};