// Mocks must be registered before importing the app to avoid loading ESM-only deps.
jest.mock("jsonwebtoken", () => ({ verify: jest.fn() }));
jest.mock("../database", () => ({
  prisma: {
    member: { findUnique: jest.fn() },
    subscription: { findUnique: jest.fn() },
  },
}));
jest.mock("../modules/members/members.service", () => ({
  MembersService: jest
    .fn()
    .mockImplementation(() => ({ list: jest.fn().mockResolvedValue([]) })),
}));
// Mock notifications service (uses expo-server-sdk which is ESM; avoid loading it)
jest.mock("../modules/notifications/notifications.service", () => ({
  NotificationsService: jest
    .fn()
    .mockImplementation(() => ({ send: jest.fn() })),
}));

// Ensure JWT secret exists during tests
process.env.JWT_SECRET = "test-jwt-secret";

import request from "supertest";
import { app } from "../app";
import jwt from "jsonwebtoken";
import { prisma } from "../database";

describe("ensureAuthenticated middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (prisma.subscription.findUnique as jest.Mock).mockResolvedValue({
      status: "ACTIVE",
      trialEndsAt: null,
    });
  });

  it("returns 401 when no token provided", async () => {
    const res = await request(app).get("/members");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Token nao informado.");
  });

  it("returns 401 when token is invalid", async () => {
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("invalid");
    });

    const res = await request(app)
      .get("/members")
      .set("Authorization", "Bearer invalid-token");

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Token invalido ou expirado.");
  });

  it("returns 401 when user not found", async () => {
    (jwt.verify as jest.Mock).mockReturnValue({ sub: "user-1" });
    (prisma.member.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .get("/members")
      .set("Authorization", "Bearer valid-token");

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty(
      "message",
      "Usuario inativo ou nao encontrado.",
    );
  });

  it("allows request when token and user are valid", async () => {
    (jwt.verify as jest.Mock).mockReturnValue({ sub: "user-1" });
    (prisma.member.findUnique as jest.Mock).mockResolvedValue({
      id: "user-1",
      role: "MEMBRO",
      isSuperAdmin: false,
      isActive: true,
      churchId: "ch-1",
    });

    const res = await request(app)
      .get("/members")
      .set("Authorization", "Bearer valid-token");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success", true);
  });

  it("blocks a tenant when its trial has expired", async () => {
    (jwt.verify as jest.Mock).mockReturnValue({ sub: "user-1" });
    (prisma.member.findUnique as jest.Mock).mockResolvedValue({
      id: "user-1",
      role: "ADMIN",
      isSuperAdmin: false,
      isActive: true,
      churchId: "ch-1",
    });
    (prisma.subscription.findUnique as jest.Mock).mockResolvedValue({
      status: "TRIALING",
      trialEndsAt: new Date(Date.now() - 1000),
    });

    const res = await request(app)
      .get("/members")
      .set("Authorization", "Bearer valid-token");

    expect(res.status).toBe(402);
  });
});
