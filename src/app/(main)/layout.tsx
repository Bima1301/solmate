import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import SessionProvider from "../../context/SessionProvider";
import LayoutClient from "./layout.client";

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await validateRequest();

    if (!session.user) redirect("/login");

    return <SessionProvider value={session}>
        <LayoutClient>
            {children}
        </LayoutClient>
    </SessionProvider >;
}