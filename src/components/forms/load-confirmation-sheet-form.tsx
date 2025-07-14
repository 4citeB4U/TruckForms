// src/components/forms/load-confirmation-sheet-form.tsx
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
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SignaturePad } from '@/components/ui/signature-pad';
import { Printer, CalendarIcon, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const loadConfirmationSchema = z.object({
  // Parties
  carrierName: z.string().min(1, 'Carrier name is required.'),
  brokerName: z.string().min(1, 'Broker/shipper name is required.'),
  
  // Load Details
  loadConfirmationNumber: z.string().min(1, 'Load number is required.'),
  rate: z.coerce.number().positive('A valid rate is required.'),
  
  // Pickup Info
  pickupName: z.string().min(1, 'Pickup name is required.'),
  pickupAddress: z.string().min(1, 'Pickup address is required.'),
  pickupDate: z.date({ required_error: 'Pickup date is required.' }),
  pickupTime: z.string().min(1, 'Pickup time is required.'),
  pickupNumber: z.string().optional(),
  
  // Delivery Info
  deliveryName: z.string().min(1, 'Delivery name is required.'),
  deliveryAddress: z.string().min(1, 'Delivery address is required.'),
  deliveryDate: z.date({ required_error: 'Delivery date is required.' }),
  deliveryTime: z.string().min(1, 'Delivery time is required.'),
  deliveryNumber: z.string().optional(),
  
  // Freight Details
  equipmentType: z.string().min(1, 'Equipment type is required.'),
  freightDescription: z.string().min(1, 'Freight description is required.'),
  weight: z.coerce.number().positive('Weight must be positive.'),
  
  // Notes and Signature
  notes: z.string().optional(),
  carrierSignature: z.string().optional(),
  brokerSignature: z.string().optional(),
  agreementDate: z.date({ required_error: 'Date of agreement is required.' }),
});

type LoadConfirmationFormValues = z.infer<typeof loadConfirmationSchema>;

export function LoadConfirmationSheetForm() {
  const { toast } = useToast();

  const form = useForm<LoadConfirmationFormValues>({
    resolver: zodResolver(loadConfirmationSchema),
    defaultValues: { agreementDate: new Date() },
    mode: 'onChange',
  });

  const handlePrint = () => window.print();

  const onSubmit = (data: LoadConfirmationFormValues) => {
    console.log(data);
    toast({
      title: 'Load Confirmed!',
      description: 'The load confirmation has been signed and saved.',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between no-print">
          <div>
            <h1 className="text-2xl font-headline font-bold">Load Confirmation Sheet</h1>
            <p className="text-muted-foreground">Formal agreement between a carrier and a shipper/broker.</p>
          </div>
          <Button type="button" variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print / Download
          </Button>
        </div>

        <Card className="printable-card">
          <CardHeader>
            <CardTitle>Carrier &amp; Broker Information</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <FormField control={form.control} name="carrierName" render={({ field }) => (
                <FormItem><FormLabel>Carrier Name</FormLabel><FormControl><Input placeholder="Your Company LLC" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="brokerName" render={({ field }) => (
                <FormItem><FormLabel>Broker/Shipper Name</FormLabel><FormControl><Input placeholder="Logistics Pros Inc." {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
          </CardContent>
        </Card>

        <Card className="printable-card">
          <CardHeader>
            <CardTitle>Load Details</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FormField control={form.control} name="loadConfirmationNumber" render={({ field }) => (
                <FormItem><FormLabel>Load Conf #</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="rate" render={({ field }) => (
                <FormItem><FormLabel>Rate</FormLabel><FormControl><div className="relative"><DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input type="number" step="0.01" className="pl-8" {...field} /></div></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="equipmentType" render={({ field }) => (
                <FormItem><FormLabel>Equipment Type</FormLabel><FormControl><Input placeholder="53' Dry Van" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="weight" render={({ field }) => (
                <FormItem><FormLabel>Weight (lbs)</FormLabel><FormControl><Input type="number" placeholder="44000" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="freightDescription" render={({ field }) => (
                <FormItem className="md:col-span-2 lg:col-span-4"><FormLabel>Freight Description</FormLabel><FormControl><Input placeholder="FAK - General Commodities" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8 items-start">
            <Card className="printable-card">
                <CardHeader><CardTitle>Pickup</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                     <FormField control={form.control} name="pickupName" render={({ field }) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                     <FormField control={form.control} name="pickupAddress" render={({ field }) => (<FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                     <FormField control={form.control} name="pickupDate" render={({ field }) => (<FormItem><FormLabel>Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)}/>
                     <FormField control={form.control} name="pickupTime" render={({ field }) => (<FormItem><FormLabel>Time / Hours</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                     <FormField control={form.control} name="pickupNumber" render={({ field }) => (<FormItem><FormLabel>PU#</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)}/>
                </CardContent>
            </Card>
            <Card className="printable-card">
                <CardHeader><CardTitle>Delivery</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                     <FormField control={form.control} name="deliveryName" render={({ field }) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                     <FormField control={form.control} name="deliveryAddress" render={({ field }) => (<FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                     <FormField control={form.control} name="deliveryDate" render={({ field }) => (<FormItem><FormLabel>Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)}/>
                     <FormField control={form.control} name="deliveryTime" render={({ field }) => (<FormItem><FormLabel>Time / Hours</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                     <FormField control={form.control} name="deliveryNumber" render={({ field }) => (<FormItem><FormLabel>PO# / Ref#</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)}/>
                </CardContent>
            </Card>
        </div>
        
        <Card className="printable-card">
          <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
          <CardContent>
            <FormField control={form.control} name="notes" render={({ field }) => (
                <FormItem><FormControl><Textarea placeholder="e.g., Detention: $75/hr after 2 hours. Lumper: Paid by broker." className="min-h-[100px]" {...field} /></FormControl></FormItem>
            )}/>
          </CardContent>
        </Card>

        <Card className="printable-card">
          <CardHeader>
            <CardTitle>Agreement & Signatures</CardTitle>
            <CardDescription>
                This confirmation shall be considered the complete and binding agreement for this shipment. 
                Carrier agrees to transport this shipment safely and in compliance with all regulations.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8 items-end">
            <div className='space-y-2'>
              <FormLabel>Carrier Authorized Signature</FormLabel>
               <FormField control={form.control} name="carrierSignature" render={({ field }) => (
                    <SignaturePad onEnd={field.onChange} penColor='white' />
                )} />
            </div>
            <div className='space-y-2'>
              <FormLabel>Broker/Shipper Authorized Signature</FormLabel>
               <FormField control={form.control} name="brokerSignature" render={({ field }) => (
                    <SignaturePad onEnd={field.onChange} penColor='white' />
                )} />
            </div>
            <FormField control={form.control} name="agreementDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Date of Agreement</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
          </CardContent>
        </Card>

        <div className="flex justify-end no-print">
            <Button type="submit" size="lg">Confirm Load</Button>
        </div>
      </form>
    </Form>
  );
}
