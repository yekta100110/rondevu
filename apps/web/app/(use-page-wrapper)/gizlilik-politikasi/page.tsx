import { permanentRedirect } from "next/navigation";

export default function GizlilikPolitikasiRedirectPage() {
  permanentRedirect("/privacy");
}
