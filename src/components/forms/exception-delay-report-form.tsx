// src/components/forms/exception-delay-report-form.tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { SignaturePad } from '@/components/ui/signature-pad';
import { Printer, CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const exceptionDelayReportSchema = z.object({
  loadNumber: z.string().min(1, 'Load number is required.'),
  driverName: z.string().min(1, 'Driver name is required.'),
  reportDate: z.date({ required_error: 'Date is required.' }),
  
  exceptionType: z.enum(['weather', 'traffic', 'mechanical', 'shipper_delay', 'consignee_delay', 'other']),
  
  delayStartDate: z.date({ required_error: 'Start date is required.' }),
  delayStartTime: z.string().min(1, 'Start time is required.'),
  delayEndDate: z.date().optional(),
  delayEndTime: z.string().optional(),
  
  location: z.string().min(1, 'Location is required.'),
  description: z.string().min(10, 'A detailed description is required.'),
  
  dispatcherNotified: z.boolean().default(false),
  dispatcherName: z.string().optional(),
  
  driverSignature: z.string().optional(),
});

type ExceptionDelayReportFormValues = z.infer<typeof exceptionDelayReportSchema>;

export function ExceptionDelayReportForm() {
  const { toast } = useToast();
  const form = useForm<ExceptionDelayReportFormValues>({
    resolver: zodResolver(exceptionDelayReportSchema),
    defaultValues: { reportDate: new Date(), dispatcherNotified: false },
    mode: 'onChange',
  });

  const handlePrint = () => window.print();

  const onSubmit = (data: ExceptionDelayReportFormValues) => {
    console.log(data);
    toast({
      title: 'Report Submitted',
      description: 'The exception/delay report has been logged.',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between no-print">
          <div>
            <h1 className="text-2xl font-headline font-bold">Exception/Delay Report</h1>
            <p className="text-muted-foreground">Report any delays or exceptions that occur during transit.</p>
          </div>
          <Button type="button" variant="outline" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print</Button>
        </div>

        <Card className="printable-card">
          <CardHeader><CardTitle>Report Details</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField control={form.control} name="loadNumber" render={({ field }) => (<FormItem><FormLabel>Load/BOL Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="driverName" render={({ field }) => (<FormItem><FormLabel>Driver Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="reportDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Date of Report</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
          </CardContent>
        </Card>

        <Card className="printable-card">
          <CardHeader><CardTitle>Exception Details</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <FormField control={form.control} name="exceptionType" render={({ field }) => (
                <FormItem><FormLabel>Reason for Delay/Exception</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a reason" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="weather">Weather</SelectItem>
                      <SelectItem value="traffic">Traffic/Road Closure</SelectItem>
                      <SelectItem value="mechanical">Mechanical Issue</SelectItem>
                      <SelectItem value="shipper_delay">Shipper Delay</SelectItem>
                      <SelectItem value="consignee_delay">Consignee Delay</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                <FormMessage /></FormItem>
              )} />
            <div className="grid md:grid-cols-2 gap-6">
                <FormItem><FormLabel>Delay Start</FormLabel><div className='flex gap-2'><FormField control={form.control} name="delayStartDate" render={({ field }) => (<Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "P") : <span>Pick date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover>)} /><FormField control={form.control} name="delayStartTime" render={({ field }) => (<FormControl><Input type="time" {...field} /></FormControl>)} /></div><FormMessage/></FormItem>
                <FormItem><FormLabel>Delay End (Optional)</FormLabel><div className='flex gap-2'><FormField control={form.control} name="delayEndDate" render={({ field }) => (<Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "P") : <span>Pick date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover>)} /><FormField control={form.control} name="delayEndTime" render={({ field }) => (<FormControl><Input type="time" {...field} /></FormControl>)} /></div></FormItem>
            </div>
            <FormField control={form.control} name="location" render={({ field }) => (<FormItem><FormLabel>Location of Incident</FormLabel><FormControl><Input placeholder="e.g., I-80 EB, near Cheyenne, WY" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Detailed Description of Events</FormLabel><FormControl><Textarea className="min-h-[120px]" {...field} /></FormControl><FormMessage /></FormItem>)} />
          </CardContent>
        </Card>

        <Card className="printable-card">
            <CardHeader><CardTitle>Notification & Signature</CardTitle></CardHeader>
            <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6 items-end">
                    <FormField control={form.control} name="dispatcherNotified" render={({ field }) => (<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4"><div className="space-y-0.5"><FormLabel>Was Dispatch Notified?</FormLabel></div><FormControl><input type="checkbox" checked={field.value} onChange={e => field.onChange(e.target.checked)} /></FormControl></FormItem>)} />
                    {form.watch('dispatcherNotified') && <FormField control={form.control} name="dispatcherName" render={({ field }) => (<FormItem><FormLabel>Dispatcher Name</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />}
                </div>
                 <div className='space-y-2'><FormLabel>Driver Signature</FormLabel><FormDescription>I certify that the information in this report is true and correct.</FormDescription><FormField control={form.control} name="driverSignature" render={({ field }) => (<SignaturePad onEnd={field.onChange} penColor='white' />)} /></div>
            </CardContent>
        </Card>

        <div className="flex justify-end no-print"><Button type="submit" size="lg">Submit Report</Button></div>
      </form>
    </Form>
  );
}
