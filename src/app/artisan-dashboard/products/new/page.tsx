
'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormState } from 'react-dom';
import { z } from 'zod';
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductForm from "@/components/artisan/product-form";
import { addProduct } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import { productSchema } from "@/lib/schemas";


export type ProductFormData = z.infer<typeof productSchema>;

export default function NewProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [state, formAction] = useFormState(addProduct, { message: '' });

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      stock: 10,
      price: 0,
      category: undefined,
      image: "",
    },
    // Set the form values based on the form state
    context: state,
  });

  useEffect(() => {
    if (state.message === 'Failed to create product.' && state.errors) {
        // You can use toast to show a general error message
        toast({
            title: "Error",
            description: "Please check the form for errors.",
            variant: "destructive",
        });
    }
  }, [state, toast]);

  const onDiscard = () => {
    form.reset();
    router.push('/artisan-dashboard');
  }

  return (
    <Form {...form}>
      <form action={formAction} className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="h-7 w-7" asChild>
            <Link href="/artisan-dashboard">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold font-headline tracking-tight sm:grow-0">
            Add New Product
          </h1>
          <div className="hidden items-center gap-2 md:ml-auto md:flex">
            <Button variant="outline" size="sm" type="button" onClick={onDiscard}>
              Discard
            </Button>
            <Button size="sm" type="submit" disabled={form.formState.isSubmitting}>Save Product</Button>
          </div>
        </div>
        <ProductForm form={form} />
        <div className="flex items-center justify-center gap-2 md:hidden">
          <Button variant="outline" size="sm" type="button" onClick={onDiscard}>
            Discard
          </Button>
          <Button size="sm" type="submit" disabled={form.formState.isSubmitting}>Save Product</Button>
        </div>
      </form>
    </Form>
  );
}
