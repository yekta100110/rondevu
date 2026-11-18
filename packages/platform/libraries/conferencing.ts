export {
  getRecordingsOfCalVideoByRoomName,
  getDownloadLinkOfCalVideoByRecordingId,
  getAllTranscriptsAccessLinkFromRoomName,
  getCalVideoMeetingSessionsByRoomName,
  createMeeting,
  updateMeeting,
  deleteMeeting,
} from "@rondevu/features/conferencing/lib/videoClient";

export { FAKE_DAILY_CREDENTIAL } from "@rondevu/app-store/dailyvideo/lib/VideoApiAdapter";

export type { RondevuMeetingParticipant, RondevuMeetingSession } from "@rondevu/app-store/dailyvideo/zod";
