// middleware.ts (at the root of your project)
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip sign-in, sign-up, and static files
    "/((?!signin|signup|_next|.*\\.).*)",
    "/(api|trpc)(.*)",
  ],
};