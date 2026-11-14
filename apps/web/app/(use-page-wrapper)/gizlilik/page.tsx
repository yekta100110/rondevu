import { permanentRedirect } from "next/navigation";

export default function GizlilikRedirectPage() {
  permanentRedirect("/privacy");
}
