
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function OrdersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Orders</CardTitle>
        <CardDescription>
          A list of your recent orders.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>You have no new orders.</p>
      </CardContent>
    </Card>
  );
}
