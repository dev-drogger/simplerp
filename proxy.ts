import { PUBLIC_ROUTES, AUTH_ROUTES, API_ROUTES } from "@/lib";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const generateNonce = (length: number = 32): string => {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
      "",
    );
  };
  const nonce = generateNonce();
  const strictCsp = [
    "default-src 'self'",

    `script-src 'self' *.vercel-scripts.com *.vercel-insights.com 'nonce-${nonce}'`,

    `connect-src 'self' http://34.55.185.233 *.vercel-insights.com vitals.vercel-insights.com https://www.google-analytics.com https://analytics.google.com https://www.google.com  *.sentry.io`,

    `frame-src 'self'`,
    "frame-ancestors 'none'",

    `img-src 'self' http://34.55.185.233 https://ik.imagekit.io https://img.youtube.com https://www.google-analytics.com data:`,

    `style-src 'self' 'unsafe-inline'`,

    "object-src 'none'",
    "base-uri 'self'",
    "upgrade-insecure-requests",
  ].join("; ");

  const withNonceRequest = () =>
    NextResponse.next({
      request: {
        headers: (() => {
          const h = new Headers(req.headers);
          h.set("x-nonce", nonce);
          return h;
        })(),
      },
    });

  const applyHeaders = (res: NextResponse) => {
    res.headers.set("Content-Security-Policy", strictCsp);
    res.headers.set("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    res.headers.set("X-Content-Type-Options", "nosniff");
    res.headers.set("X-Frame-Options", "SAMEORIGIN");
    res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    res.headers.set("X-DNS-Prefetch-Control", "on");
    res.headers.set("X-XSS-Protection", "1; mode=block");
    res.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );
    res.headers.set(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=()",
    );
    // res.headers.set("Cache-Control", "no-store");
    return res;
  };

  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  const isApiRoute = nextUrl.pathname.startsWith(API_ROUTES);
  const isPublicRoute = PUBLIC_ROUTES.some((route) => {
    if (route === "/") {
      return nextUrl.pathname === "/";
    }

    return (
      nextUrl.pathname === route || nextUrl.pathname.startsWith(`${route}/`)
    );
  });
  const isAuthRoute = nextUrl.pathname === AUTH_ROUTES;

  if (isApiRoute) {
    if (!isLoggedIn) {
      return NextResponse.json(
        { error: "Unauthorized" },
        {
          status: 401,
        },
      );
    }
    return applyHeaders(withNonceRequest());
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return applyHeaders(NextResponse.redirect(new URL("/", nextUrl)));
    }
    return applyHeaders(withNonceRequest());
  }

  if (!isLoggedIn && !isPublicRoute) {
    return applyHeaders(NextResponse.redirect(new URL("/sign-in", nextUrl)));
  }

  return applyHeaders(withNonceRequest());
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
