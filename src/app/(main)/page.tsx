import TrendsSidebar from "@/components/layout/TrendsSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FollowingFeed from "@/components/views/(main)/home/FollowingFeed";
import ForYouFeed from "@/components/views/(main)/home/ForYouFeed";
import PostEditor from "@/components/views/(main)/home/PostEditor";

export default function Home() {

  return (
    <main className="w-full min-w-0 flex gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <Tabs defaultValue="for-you">
          <TabsList className="h-12 w-full gap-1 shadow-sm bg-card">
            <TabsTrigger value="for-you" className="h-full flex-1 hover:bg-background data-[state=active]:font-bold">For You</TabsTrigger>
            <TabsTrigger value="following" className="h-full flex-1 hover:bg-background data-[state=active]:font-bold">Following</TabsTrigger>
          </TabsList>
          <TabsContent value="for-you">
            <ForYouFeed />
          </TabsContent>
          <TabsContent value="following">
            <FollowingFeed />
          </TabsContent>
        </Tabs>
      </div>
      <TrendsSidebar />
    </main>
  );
}
