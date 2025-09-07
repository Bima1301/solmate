import Chat from "@/components/views/(main)/messages/Chat"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Messages",
}

export default function page() {
    return <Chat />
}
