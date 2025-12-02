import { Attachment, AttachmentModal, Media, MediaModal } from "../services/calls/stories";

export function normalizeMedia(media: Media[] = []): MediaModal[] {
  return media.map((m) => ({
    mediaType:
      m.mediaType?.toLowerCase() === "video" ? "Video" : "Photo",

    caption: m.caption ?? "",
    shotTime: m.shotTime ?? "",
    filePath: m.filePath ?? "",
  }));
}

export function normalizeAttachment(attachment: Attachment[] = []): AttachmentModal[] {
  return attachment.map((a) => ({
    mediaType: a.mediaType ?? "",
    caption: a.caption ?? "",
    shotTime: a.shotTime ?? "",
    filePath: a.filePath ?? "",
  }));
}
