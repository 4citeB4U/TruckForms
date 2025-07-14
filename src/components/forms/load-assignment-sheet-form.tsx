// src/components/forms/load-assignment-sheet-form.tsx
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
import { Textarea } from '@/components/ui/textarea';
import { SignaturePad } from '@/components/ui/signature-pad';
import { Printer, CalendarIcon, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const loadAssignmentSchema = z.object({
  // Load Info
  loadNumber: z.string().min(1, 'Load number is required.'),
  customerName: z.string().min(1, 'Customer name is required.'),
  
  // Driver Info
  driverName: z.string().min(1, 'Driver name is required.'),
  truckNumber: z.string().min(1, 'Truck number is required.'),
  trailerNumber: z.string().optional(),
  
  // Pickup Info
  pickupName: z.string().min(1, 'Pickup name is required.'),
  pickupAddress: z.string().min(1, 'Pickup address is required.'),
  pickupDate: z.date({ required_error: 'Pickup date is required.' }),
  pickupTime: z.string().min(1, 'Pickup time is required.'),
  pickupContact: z.string().optional(),
  
  // Delivery Info
  deliveryName: z.string().min(1, 'Delivery name is required.'),
  deliveryAddress: z.string().min(1, 'Delivery address is required.'),
  deliveryDate: z.date({ required_error: 'Delivery date is required.' }),
  deliveryTime: z.string().min(1, 'Delivery time is required.'),
  deliveryContact: z.string().optional(),
  
  // Freight & Instructions
  freightDescription: z.string().min(1, 'Freight description is required.'),
  weight: z.coerce.number().positive('Weight must be positive.'),
  specialInstructions: z.string().optional(),

  // Signatures
  dispatcherSignature: z.string().optional(),
  driverSignature: z.string().optional(),
});

type LoadAssignmentFormValues = z.infer<typeof loadAssignmentSchema>;

export function LoadAssignmentSheetForm() {
  const { toast } = useToast();

  const form = useForm<LoadAssignmentFormValues>({
    resolver: zodResolver(loadAssignmentSchema),
    defaultValues: {},
    mode: 'onChange',
  });

  const handlePrint = () => window.print();

  const onSubmit = (data: LoadAssignmentFormValues) => {
    console.log(data);
    toast({
      title: 'Load Assigned!',
      description: 'The load assignment sheet has been saved and sent.',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between no-print">
          <div>
            <h1 className="text-2xl font-headline font-bold">Load Assignment Sheet</h1>
            <p className="text-muted-foreground">Assign a new load to a driver with all necessary details.</p>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print / Download
            </Button>
          </div>
        </div>

        <Card className="printable-card">
          <CardHeader>
            <CardTitle>Load &amp; Driver Information</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FormField control={form.control} name="loadNumber" render={({ field }) => (
                <FormItem><FormLabel>Load Number</FormLabel><FormControl><Input placeholder="L12345" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="customerName" render={({ field }) => (
                <FormItem><FormLabel>Customer</FormLabel><FormControl><Input placeholder="Global Exports Inc." {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="driverName" render={({ field }) => (
                <FormItem><FormLabel>Driver Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="truckNumber" render={({ field }) => (
                <FormItem><FormLabel>Truck Number</FormLabel><FormControl><Input placeholder="T-567" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
          </CardContent>
        </Card>
        
        <div className="grid md:grid-cols-2 gap-8">
            <Card className="printable-card">
                <CardHeader>
                    <CardTitle>Pickup Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <FormField control={form.control} name="pickupName" render={({ field }) => (
                        <FormItem><FormLabel>Shipper Name</FormLabel><FormControl><Input placeholder="Acme Corporation" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                     <FormField control={form.control} name="pickupAddress" render={({ field }) => (
                        <FormItem><FormLabel>Shipper Address</FormLabel><FormControl><Input placeholder="123 Industrial Way, Anytown, USA" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <div className="flex gap-4">
                        <FormField control={form.control} name="pickupDate" render={({ field }) => (
                            <FormItem className="flex-1"><FormLabel>Pickup Date</FormLabel>
                                <Popover><PopoverTrigger asChild><FormControl>
                                    <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover>
                            <FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="pickupTime" render={({ field }) => (
                            <FormItem className="flex-1"><FormLabel>Pickup Time</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </div>
                     <FormField control={form.control} name="pickupContact" render={({ field }) => (
                        <FormItem><FormLabel>Contact Info (Optional)</FormLabel><FormControl><Input placeholder="Name, Phone, PU#" {...field} /></FormControl></FormItem>
                    )}/>
                </CardContent>
            </Card>
            <Card className="printable-card">
                <CardHeader>
                    <CardTitle>Delivery Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                      <FormField control={form.control} name="deliveryName" render={({ field }) => (
                        <FormItem><FormLabel>Consignee Name</FormLabel><FormControl><Input placeholder="Global Exports Inc." {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                     <FormField control={form.control} name="deliveryAddress" render={({ field }) => (
                        <FormItem><FormLabel>Consignee Address</FormLabel><FormControl><Input placeholder="456 Commerce Blvd, Otherville, USA" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <div className="flex gap-4">
                        <FormField control={form.control} name="deliveryDate" render={({ field }) => (
                            <FormItem className="flex-1"><FormLabel>Delivery Date</FormLabel>
                                <Popover><PopoverTrigger asChild><FormControl>
                                    <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover>
                            <FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="deliveryTime" render={({ field }) => (
                            <FormItem className="flex-1"><FormLabel>Delivery Time</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </div>
                     <FormField control={form.control} name="deliveryContact" render={({ field }) => (
                        <FormItem><FormLabel>Contact Info (Optional)</FormLabel><FormControl><Input placeholder="Name, Phone, PO#" {...field} /></FormControl></FormItem>
                    )}/>
                </CardContent>
            </Card>
        </div>

        <Card className="printable-card">
            <CardHeader><CardTitle>Freight & Instructions</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
                 <FormField control={form.control} name="freightDescription" render={({ field }) => (
                    <FormItem><FormLabel>Freight Description</FormLabel><FormControl><Input placeholder="e.g., 24 Pallets of Electronics" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                 <FormField control={form.control} name="weight" render={({ field }) => (
                    <FormItem><FormLabel>Total Weight (lbs)</FormLabel><FormControl><Input type="number" placeholder="42000" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="specialInstructions" render={({ field }) => (
                    <FormItem className="md:col-span-2"><FormLabel>Special Instructions</FormLabel><FormControl><Textarea placeholder="e.g., Lumper fee authorized up to $150. Call 1hr before arrival." {...field} /></FormControl></FormItem>
                )}/>
            </CardContent>
        </Card>

        <Card className="printable-card">
          <CardHeader><CardTitle>Authorization &amp; Acknowledgment</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8">
            <div className='space-y-2'>
              <FormLabel>Dispatcher Signature</FormLabel>
               <FormField control={form.control} name="dispatcherSignature" render={({ field }) => (
                    <SignaturePad onEnd={field.onChange} penColor='white' />
                )} />
                <FormDescription>I authorize this load assignment.</FormDescription>
            </div>
            <div className='space-y-2'>
              <FormLabel>Driver Signature</FormLabel>
               <FormField control={form.control} name="driverSignature" render={({ field }) => (
                    <SignaturePad onEnd={field.onChange} penColor='white' />
                )} />
                <FormDescription>I acknowledge receipt of this load assignment.</FormDescription>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end no-print">
            <Button type="submit" size="lg">Assign Load</Button>
        </div>
      </form>
    </Form>
  );
}
