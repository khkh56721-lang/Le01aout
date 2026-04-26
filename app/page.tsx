import { redirect } from "next/navigation";

// Root page — middleware handles locale redirect but this is the fallback
export default function RootPage() {
  redirect("/ar");
}
