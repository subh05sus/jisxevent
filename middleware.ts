import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
    // Only log in development
    if (process.env.NODE_ENV === "development") {
      console.log("Middleware executing for:", req.nextUrl.pathname);
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Admin routes
        if (pathname.startsWith("/admin")) {
          return token?.role === "ADMIN";
        }

        // Dashboard routes
        if (pathname.startsWith("/dashboard")) {
          return !!token;
        }

        // API routes that require authentication
        if (pathname.startsWith("/api/events") && req.method !== "GET") {
          return token?.role === "ADMIN";
        }

        if (pathname.startsWith("/api/registrations")) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/api/events/:path*",
    "/api/registrations/:path*",
  ],
};
