import { describe, it, expect, beforeEach, vi } from "vitest";
import Token, { UserPayload } from "../token";

describe("Token Service", () => {
  const mockPayload: UserPayload = {
    sub: "testuser",
    id: 123,
    role: "admin",
    exp: Math.floor(Date.now() / 1000) + 3600,
    iat: Math.floor(Date.now() / 1000),
  };

  beforeEach(() => {
    Token.clearToken();
    vi.clearAllMocks();
  });

  describe("Token storage and retrieval", () => {
    it("should start with no user info", () => {
      expect(Token.getUserInfo()).toBeNull();
      expect(Token.isUserConnected()).toBe(false);
    });

    it("should save and retrieve user info", () => {
      Token.saveUserInfo(mockPayload);
      expect(Token.getUserInfo()).toEqual(mockPayload);
      expect(Token.isUserConnected()).toBe(true);
    });

    it("should get specific fields from token", () => {
      Token.saveUserInfo(mockPayload);
      expect(Token.getUsernameFromToken()).toBe("testuser");
      expect(Token.getUserIdFromToken()).toBe(123);
      expect(Token.getUserRoleFromToken()).toBe("admin");
    });

    it("should return null for fields if no token is saved", () => {
      expect(Token.getUsernameFromToken()).toBeNull();
      expect(Token.getUserIdFromToken()).toBeNull();
      expect(Token.getUserRoleFromToken()).toBeNull();
    });

    it("should clear token", () => {
      Token.saveUserInfo(mockPayload);
      expect(Token.isUserConnected()).toBe(true);
      Token.clearToken();
      expect(Token.getUserInfo()).toBeNull();
      expect(Token.isUserConnected()).toBe(false);
    });
  });

  describe("decodeToken", () => {
    it("should decode a valid JWT token", () => {
      // Create a valid base64 token
      const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
      const payload = btoa(JSON.stringify(mockPayload));
      const signature = "signature";
      const validToken = `${header}.${payload}.${signature}`;

      const decoded = Token.decodeToken(validToken);
      expect(decoded).toEqual(mockPayload);
    });

    it("should return null and catch error for an invalid token", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const invalidToken = "not.a.valid.token";

      const decoded = Token.decodeToken(invalidToken);
      expect(decoded).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Erreur lors du décodage du token :",
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });

    it("should return null for malformed strings", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const decoded = Token.decodeToken("justastring");
      expect(decoded).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
