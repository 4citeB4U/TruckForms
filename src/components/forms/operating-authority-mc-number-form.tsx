// src/components/forms/operating-authority-mc-number-form.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Printer, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import Image from 'next/image';

const operatingAuthoritySchema = z.object({
  legalBusinessName: z.string().min(1, 'Legal business name is required.'),
  doingBusinessAs: z.string().optional(),
  usdotNumber: z.string().min(1, 'USDOT number is required.'),
  mcNumber: z.string().min(1, 'MC number is required.'),
  authorityType: z.string().min(1, 'Type of authority is required.'),
  status: z.enum(['active', 'inactive', 'pending']),
  documentImage: z.string().min(1, 'A document image is required.'),
});

type OperatingAuthorityFormValues = z.infer<typeof operatingAuthoritySchema>;

export function OperatingAuthorityMcNumberForm() {
  const { toast } = useToast();
  const [docPreview, setDocPreview] = useState<string | null>(null);

  const form = useForm<OperatingAuthorityFormValues>({
    resolver: zodResolver(operatingAuthoritySchema),
    defaultValues: { status: 'active' },
    mode: 'onChange',
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setDocPreview(result);
        form.setValue('documentImage', result, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: OperatingAuthorityFormValues) => {
    console.log(data);
    toast({
      title: 'Authority Record Saved',
      description: 'The operating authority information has been saved.',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between no-print">
          <div>
            <h1 className="text-2xl font-headline font-bold">Operating Authority (MC/DOT)</h1>
            <p className="text-muted-foreground">Manage your company's operating authority records.</p>
          </div>
          <Button type="submit" size="lg">Save Record</Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
            <Card className="printable-card">
                <CardHeader><CardTitle>Authority Details</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <FormField control={form.control} name="legalBusinessName" render={({ field }) => (<FormItem><FormLabel>Legal Business Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="doingBusinessAs" render={({ field }) => (<FormItem><FormLabel>DBA (if applicable)</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                    <div className='grid grid-cols-2 gap-4'>
                        <FormField control={form.control} name="usdotNumber" render={({ field }) => (<FormItem><FormLabel>USDOT #</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="mcNumber" render={({ field }) => (<FormItem><FormLabel>MC #</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                    <FormField control={form.control} name="authorityType" render={({ field }) => (<FormItem><FormLabel>Type of Authority</FormLabel><FormControl><Input placeholder="e.g., Motor Carrier of Property" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="status" render={({ field }) => (<FormItem><FormLabel>Status</FormLabel><FormControl><select {...field} className='w-full p-2 border rounded-md'><option value="active">Active</option><option value="inactive">Inactive</option><option value="pending">Pending</option></select></FormControl><FormMessage /></FormItem>)} />
                </CardContent>
            </Card>

            <Card className="printable-card">
                <CardHeader><CardTitle>Authority Document</CardTitle><CardDescription>Upload an image of your MC certificate.</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                     <FormField
                        control={form.control}
                        name="documentImage"
                        render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input type="file" accept="image/*,application/pdf" onChange={handleFileChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    {docPreview && (
                        <div className="mt-4 border rounded-md p-2 bg-muted">
                            <Image src={docPreview} alt="Document Preview" width={400} height={500} className="w-full h-auto rounded-md object-contain" />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </form>
    </Form>
  );
}
