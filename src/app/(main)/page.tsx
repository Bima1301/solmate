import TrendsSidebar from "@/components/layout/TrendsSidebar";
import ForYouFeed from "@/components/views/(main)/home/ForYouFeed";
import PostEditor from "@/components/views/(main)/home/PostEditor";

export default function Home() {

  return (
    <main className="w-full min-w-0 flex gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <ForYouFeed />
      </div>
      <TrendsSidebar />
    </main>
  );
}
