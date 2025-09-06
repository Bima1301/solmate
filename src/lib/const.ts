import { Bell, Bookmark, Home } from "lucide-react";
import { MessageCircle } from "lucide-react";

export const menuItem = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Bell, label: "Notifications", href: "/notifications" },
    { icon: MessageCircle, label: "Messages", href: '/messages' },
    { icon: Bookmark, label: "Bookmarks", href: "/bookmarks" },
]