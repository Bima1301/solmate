import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import SessionProvider from "../../context/SessionProvider";
import Navbar from "@/components/layout/Navbar";
import MenuBar from "@/components/layout/MenuBar";

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await validateRequest();

    if (!session.user) redirect("/login");

    return <SessionProvider value={session}>
        <div className="flex min-h-screen flex-col bg-slate-200 dark:bg-black">
            <Navbar />
            <div className="max-w-7xl mx-auto p-5 flex w-full grow gap-5">
                <MenuBar className="sticky top-[88px] h-fit hidden sm:block flex-none space-y-3 px-3 py-5 xl:w-80" />
                {children}
            </div>
            <MenuBar className="sticky bottom-0 flex w-full justify-center gap-5 border-t bg-card p-3 sm:hidden" />
        </div>
    </SessionProvider>;
}