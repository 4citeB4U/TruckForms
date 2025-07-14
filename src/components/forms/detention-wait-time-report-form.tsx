// src/components/forms/detention-wait-time-report-form.tsx
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
import { Printer, CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';

const detentionWaitTimeSchema = z.object({
  loadNumber: z.string().min(1, "Load number is required."),
  driverName: z.string().min(1, "Driver name is required."),
  customerName: z.string().min(1, "Customer name is required."),
  location: z.string().min(1, "Location is required."),
  
  arrivalDate: z.date({ required_error: 'Arrival date is required.' }),
  arrivalTime: z.string().min(1, 'Arrival time is required.'),
  
  departureDate: z.date({ required_error: 'Departure date is required.' }),
  departureTime: z.string().min(1, 'Departure time is required.'),

  reasonForDetention: z.string().optional(),
  contactPerson: z.string().optional(),
  
  driverSignature: z.string().optional(),
  facilitySignature: z.string().optional(),
});

type DetentionWaitTimeFormValues = z.infer<typeof detentionWaitTimeSchema>;

export function DetentionWaitTimeReportForm() {
  const { toast } = useToast();

  const form = useForm<DetentionWaitTimeFormValues>({
    resolver: zodResolver(detentionWaitTimeSchema),
    defaultValues: {},
    mode: 'onChange',
  });

  const handlePrint = () => window.print();

  const onSubmit = (data: DetentionWaitTimeFormValues) => {
    console.log(data);
    toast({
      title: 'Report Submitted!',
      description: 'The Detention/Wait Time Report has been saved.',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between no-print">
          <div>
            <h1 className="text-2xl font-headline font-bold">Detention/Wait Time Report</h1>
            <p className="text-muted-foreground">Track and report waiting times at facilities.</p>
          </div>
          <Button type="button" variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print / Download
          </Button>
        </div>

        <Card className="printable-card">
          <CardHeader>
            <CardTitle>Load & Location Details</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField control={form.control} name="loadNumber" render={({ field }) => (
                <FormItem><FormLabel>Load/BOL Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            <FormField control={form.control} name="driverName" render={({ field }) => (
                <FormItem><FormLabel>Driver Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            <FormField control={form.control} name="customerName" render={({ field }) => (
                <FormItem><FormLabel>Customer/Facility Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            <FormField control={form.control} name="location" render={({ field }) => (
                <FormItem className="lg:col-span-3"><FormLabel>Facility Address</FormLabel><FormControl><Input placeholder="Street, City, State, ZIP" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
          </CardContent>
        </Card>

        <Card className="printable-card">
            <CardHeader><CardTitle>Arrival & Departure Times</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-4 p-4 border rounded-md">
                    <h3 className="font-semibold">Arrival</h3>
                    <FormField control={form.control} name="arrivalDate" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>Arrival Date</FormLabel>
                        <Popover><PopoverTrigger asChild><FormControl>
                            <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover>
                        <FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="arrivalTime" render={({ field }) => (
                        <FormItem><FormLabel>Arrival Time</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                 <div className="space-y-4 p-4 border rounded-md">
                    <h3 className="font-semibold">Departure</h3>
                    <FormField control={form.control} name="departureDate" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>Departure Date</FormLabel>
                        <Popover><PopoverTrigger asChild><FormControl>
                            <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover>
                        <FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="departureTime" render={({ field }) => (
                        <FormItem><FormLabel>Departure Time</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
            </CardContent>
        </Card>

        <Card className="printable-card">
            <CardHeader><CardTitle>Detention Details</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
                <FormField control={form.control} name="reasonForDetention" render={({ field }) => (
                    <FormItem><FormLabel>Reason for Detention (Optional)</FormLabel><FormControl><Textarea placeholder="e.g., No available dock, waiting for paperwork..." {...field} /></FormControl></FormItem>
                )}/>
                <FormField control={form.control} name="contactPerson" render={({ field }) => (
                    <FormItem><FormLabel>Facility Contact Person (Optional)</FormLabel><FormControl><Input placeholder="Name of person notified" {...field} /></FormControl></FormItem>
                )}/>
            </CardContent>
        </Card>

        <Card className="printable-card">
          <CardHeader>
            <CardTitle>Signatures</CardTitle>
            <CardDescription>Get signatures to confirm the times are accurate.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8">
            <div className='space-y-2'>
              <FormLabel>Driver Signature</FormLabel>
               <FormField control={form.control} name="driverSignature" render={({ field }) => (
                    <SignaturePad onEnd={field.onChange} penColor='white' />
                )} />
            </div>
            <div className='space-y-2'>
              <FormLabel>Facility Representative Signature</FormLabel>
               <FormField control={form.control} name="facilitySignature" render={({ field }) => (
                    <SignaturePad onEnd={field.onChange} penColor='white' />
                )} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end no-print">
          <Button type="submit" size="lg">Submit Report</Button>
        </div>
      </form>
    </Form>
  );
}
