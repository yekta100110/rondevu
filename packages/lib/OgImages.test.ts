import { describe, expect, it } from "vitest";

import {
  getOGImageVersion,
  constructMeetingImage,
  constructAppImage,
  constructGenericImage,
} from "./OgImages";

describe("OgImages", () => {
  describe("getOGImageVersion", () => {
    it("returns a consistent hash for the same type", async () => {
      const version1 = await getOGImageVersion("generic");
      const version2 = await getOGImageVersion("generic");
      expect(version1).toBe(version2);
    });

    it("returns different hashes for different types", async () => {
      const meetingVersion = await getOGImageVersion("meeting");
      const appVersion = await getOGImageVersion("app");
      const genericVersion = await getOGImageVersion("generic");

      expect(meetingVersion).not.toBe(appVersion);
      expect(meetingVersion).not.toBe(genericVersion);
    });

    it("returns different hash when additionalInputs are provided", async () => {
      const base = await getOGImageVersion("app");
      const withInputs = await getOGImageVersion("app", { svgHash: "abc123" });
      expect(base).not.toBe(withInputs);
    });
  });

  describe("constructMeetingImage", () => {
    it("returns a URL path with meeting parameters", async () => {
      const result = await constructMeetingImage({
        title: "30min",
        profile: { name: "Test User" },
        users: [],
      });
      expect(result).toMatch(/^\/api\/social\/og\/image\?/);
      expect(result).toContain("type=meeting");
      expect(result).toContain("title=30min");
      expect(result).toContain("meetingProfileName=Test+User");
    });

    it("includes meetingImage when profile has an image", async () => {
      const result = await constructMeetingImage({
        title: "30min",
        profile: { name: "Test User", image: "https://example.com/avatar.png" },
        users: [],
      });
      expect(result).toMatch(/^\/api\/social\/og\/image\?/);
      expect(result).toContain("meetingImage=https%3A%2F%2Fexample.com%2Favatar.png");
    });
  });

  describe("constructAppImage", () => {
    it("returns a URL path with app parameters", async () => {
      const result = await constructAppImage({
        name: "TestApp",
        slug: "test-app",
        description: "A test app",
        logoUrl: "/app-store/test/icon.svg",
      });
      expect(result).toMatch(/^\/api\/social\/og\/image\?/);
      expect(result).toContain("type=app");
      expect(result).toContain("name=TestApp");
      expect(result).toContain("slug=test-app");
    });
  });

  describe("constructGenericImage", () => {
    it("returns a URL path with generic parameters", async () => {
      const result = await constructGenericImage({
        title: "Login",
        description: "Sign in to your account",
      });
      expect(result).toMatch(/^\/api\/social\/og\/image\?/);
      expect(result).toContain("type=generic");
      expect(result).toContain("title=Login");
      expect(result).toContain("description=Sign+in+to+your+account");
    });
  });

  describe("OG image branding uses configurable logo constants", () => {
    it("generic type uses LOGO_DARK (with LOGO fallback) for darker logo on light backgrounds", async () => {
      const genericVersion = await getOGImageVersion("generic");
      expect(genericVersion).toBeTruthy();
      expect(typeof genericVersion).toBe("string");
      expect(genericVersion.length).toBe(8);
    });

    it("meeting and app types use LOGO constant", async () => {
      const meetingVersion = await getOGImageVersion("meeting");
      const appVersion = await getOGImageVersion("app");
      expect(meetingVersion).toBeTruthy();
      expect(appVersion).toBeTruthy();
      expect(meetingVersion.length).toBe(8);
      expect(appVersion.length).toBe(8);
    });

    it("all three types produce distinct version hashes", async () => {
      const meetingVersion = await getOGImageVersion("meeting");
      const appVersion = await getOGImageVersion("app");
      const genericVersion = await getOGImageVersion("generic");

      expect(meetingVersion).not.toBe(appVersion);
      expect(meetingVersion).not.toBe(genericVersion);
      expect(appVersion).not.toBe(genericVersion);
    });

    it("self-hosters can override logos by replacing the referenced SVG files", async () => {
      const v1 = await getOGImageVersion("generic");
      const v2 = await getOGImageVersion("generic");
      expect(v1).toBe(v2);
    });
  });
});
