
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MyStoryPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">My Story</CardTitle>
        <CardDescription>
          Share your journey and connect with your customers.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">This is where you can edit your artisan profile, including your bio, story, and profile image.</p>
        <Button>Edit My Story</Button>
      </CardContent>
    </Card>
  );
}
