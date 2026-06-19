import { NextFunction, Request, Response } from "express";

import { AppError } from "../errors/AppError";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

function extractCookie(request: Request, key: string) {
  const cookieHeader = request.headers.cookie;
  if (!cookieHeader) return null;

  const match = cookieHeader.match(new RegExp(`(?:^|; )${key}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function csrfProtection(
  request: Request,
  _response: Response,
  next: NextFunction,
) {
  const useCookieAuth = (process.env.USE_COOKIE_AUTH ?? "false") === "true";

  if (!useCookieAuth) {
    return next();
  }

  if (SAFE_METHODS.has(request.method.toUpperCase())) {
    return next();
  }

  // Login and csrf bootstrap are exempt because token might not exist yet.
  if (
    request.path === "/auth/login" ||
    request.path === "/auth/csrf-token" ||
    request.path === "/webhooks/asaas"
  ) {
    return next();
  }

  const csrfCookie = extractCookie(request, "igreja_csrf");
  const csrfHeader = request.headers["x-csrf-token"];

  if (
    !csrfCookie ||
    typeof csrfHeader !== "string" ||
    csrfHeader !== csrfCookie
  ) {
    return next(new AppError("CSRF token invalido ou ausente.", 403));
  }

  return next();
}
