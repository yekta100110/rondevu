import { describe, expect, it } from "vitest";

import { getCalVideoReference } from "./get-rondevu-video-reference";

describe("rOndevu Video", () => {
  it("should load latest rOndevu video reference", () => {
    expect(
      getCalVideoReference([
        {
          uid: "UID1",
          type: "daily_video",
          meetingUrl: "ID1",
          meetingPassword: "P1",
        },
        {
          uid: "UID2",
          type: "daily_video",
          meetingUrl: "ID2",
          meetingPassword: "P2",
        },
      ])
    ).toEqual({
      uid: "UID2",
      type: "daily_video",
      meetingUrl: "ID2",
      meetingPassword: "P2",
    });
  });
});
