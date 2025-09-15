
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CustomersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Customers</CardTitle>
        <CardDescription>
          A list of your customers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>No customers yet.</p>
      </CardContent>
    </Card>
  );
}
