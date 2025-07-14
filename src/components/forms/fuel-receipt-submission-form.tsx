// src/components/forms/fuel-receipt-submission-form.tsx
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
import { Printer, CalendarIcon, Upload, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import Image from 'next/image';

const fuelReceiptSchema = z.object({
  driverName: z.string().min(1, 'Driver name is required.'),
  truckNumber: z.string().min(1, 'Truck number is required.'),
  fuelingDate: z.date({ required_error: 'Date is required.' }),
  fuelingTime: z.string().min(1, 'Time is required.'),
  
  vendorName: z.string().min(1, 'Vendor name is required.'),
  locationCity: z.string().min(1, 'City is required.'),
  locationState: z.string().min(2, 'State abbreviation is required.').max(2),
  
  gallons: z.coerce.number().positive('Gallons must be a positive number.'),
  pricePerGallon: z.coerce.number().positive('Price must be a positive number.'),
  totalCost: z.coerce.number().positive('Total cost must be a positive number.'),
  
  odometer: z.coerce.number().positive('Odometer reading is required.'),
  
  receiptImage: z.string().min(1, 'A receipt image is required.'),
});

type FuelReceiptFormValues = z.infer<typeof fuelReceiptSchema>;

export function FuelReceiptSubmissionForm() {
  const { toast } = useToast();
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);

  const form = useForm<FuelReceiptFormValues>({
    resolver: zodResolver(fuelReceiptSchema),
    mode: 'onChange',
  });
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setReceiptPreview(result);
        form.setValue('receiptImage', result, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };


  const onSubmit = (data: FuelReceiptFormValues) => {
    console.log(data);
    toast({
      title: 'Receipt Submitted',
      description: 'Your fuel receipt has been successfully logged.',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between no-print">
          <div>
            <h1 className="text-2xl font-headline font-bold">Fuel Receipt Submission</h1>
            <p className="text-muted-foreground">Submit your fuel receipts for IFTA and expense tracking.</p>
          </div>
          <Button type="submit" size="lg">Submit Receipt</Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
            <Card className="printable-card">
            <CardHeader><CardTitle>Receipt Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <FormField control={form.control} name="driverName" render={({ field }) => (<FormItem><FormLabel>Driver Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="truckNumber" render={({ field }) => (<FormItem><FormLabel>Truck #</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <div className='grid grid-cols-2 gap-4'>
                    <FormField control={form.control} name="fuelingDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="fuelingTime" render={({ field }) => (<FormItem><FormLabel>Time</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                <FormField control={form.control} name="vendorName" render={({ field }) => (<FormItem><FormLabel>Fuel Stop / Vendor</FormLabel><FormControl><Input placeholder='e.g., Pilot, Loves' {...field} /></FormControl><FormMessage /></FormItem>)} />
                <div className='grid grid-cols-2 gap-4'>
                    <FormField control={form.control} name="locationCity" render={({ field }) => (<FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="locationState" render={({ field }) => (<FormItem><FormLabel>State</FormLabel><FormControl><Input placeholder='e.g., CA' {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                <div className='grid grid-cols-2 gap-4'>
                    <FormField control={form.control} name="gallons" render={({ field }) => (<FormItem><FormLabel>Gallons</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="pricePerGallon" render={({ field }) => (<FormItem><FormLabel>Price/Gallon</FormLabel><FormControl><div className="relative"><DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input type="number" step="0.001" className="pl-8" {...field} /></div></FormControl><FormMessage /></FormItem>)} />
                </div>
                 <FormField control={form.control} name="totalCost" render={({ field }) => (<FormItem><FormLabel>Total Cost</FormLabel><FormControl><div className="relative"><DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input type="number" step="0.01" className="pl-8" {...field} /></div></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="odometer" render={({ field }) => (<FormItem><FormLabel>Odometer Reading</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </CardContent>
            </Card>

            <Card className="printable-card">
            <CardHeader><CardTitle>Receipt Image</CardTitle><CardDescription>Upload a clear photo of the fuel receipt.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
                 <FormField
                    control={form.control}
                    name="receiptImage"
                    render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <Input type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                {receiptPreview && (
                    <div className="mt-4 border rounded-md p-2 bg-muted">
                        <Image src={receiptPreview} alt="Receipt Preview" width={400} height={600} className="w-full h-auto rounded-md object-contain" />
                    </div>
                )}
            </CardContent>
            </Card>
        </div>
      </form>
    </Form>
  );
}
