// src/components/forms/route-trip-sheet-form.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Printer, CalendarIcon, PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const stopSchema = z.object({
  stopType: z.enum(['pickup', 'delivery']),
  locationName: z.string().min(1, "Location name is required."),
  address: z.string().min(1, "Address is required."),
  appointment: z.string().min(1, "Appointment time/window is required."),
  referenceNumber: z.string().optional(),
});

const routeTripSheetSchema = z.object({
  tripNumber: z.string().min(1, 'Trip number is required.'),
  driverName: z.string().min(1, 'Driver name is required.'),
  truckNumber: z.string().min(1, 'Truck number is required.'),
  tripDate: z.date({ required_error: 'Trip date is required.' }),
  
  stops: z.array(stopSchema).min(2, "At least two stops (a pickup and a delivery) are required."),
  
  routeNotes: z.string().optional(),
});

type RouteTripSheetFormValues = z.infer<typeof routeTripSheetSchema>;

export function RouteTripSheetForm() {
  const { toast } = useToast();
  const form = useForm<RouteTripSheetFormValues>({
    resolver: zodResolver(routeTripSheetSchema),
    defaultValues: {
      tripDate: new Date(),
      stops: [
        { stopType: 'pickup', locationName: '', address: '', appointment: '', referenceNumber: '' },
        { stopType: 'delivery', locationName: '', address: '', appointment: '', referenceNumber: '' },
      ],
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'stops',
  });

  const handlePrint = () => window.print();

  const onSubmit = (data: RouteTripSheetFormValues) => {
    console.log(data);
    toast({
      title: 'Trip Sheet Saved',
      description: 'The route and trip sheet has been generated.',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between no-print">
          <div>
            <h1 className="text-2xl font-headline font-bold">Route & Trip Sheet</h1>
            <p className="text-muted-foreground">Provide drivers with a detailed itinerary for their trip.</p>
          </div>
          <Button type="button" variant="outline" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print</Button>
        </div>

        <Card className="printable-card">
          <CardHeader><CardTitle>Trip Details</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FormField control={form.control} name="tripNumber" render={({ field }) => (<FormItem><FormLabel>Trip #</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="driverName" render={({ field }) => (<FormItem><FormLabel>Driver Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="truckNumber" render={({ field }) => (<FormItem><FormLabel>Truck #</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="tripDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
          </CardContent>
        </Card>

        <Card className="printable-card">
          <CardHeader>
            <CardTitle>Stops</CardTitle>
            <CardDescription>List all stops in sequential order.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="border rounded-lg p-4 space-y-4 relative">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Stop {index + 1}</h3>
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FormField control={form.control} name={`stops.${index}.stopType`} render={({ field }) => (<FormItem><FormLabel>Type</FormLabel><FormControl><select {...field} className="w-full p-2 border rounded-md"><option value="pickup">Pickup</option><option value="delivery">Delivery</option></select></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name={`stops.${index}.locationName`} render={({ field }) => (<FormItem><FormLabel>Location Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name={`stops.${index}.address`} render={({ field }) => (<FormItem className="lg:col-span-2"><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name={`stops.${index}.appointment`} render={({ field }) => (<FormItem><FormLabel>Appointment</FormLabel><FormControl><Input placeholder="e.g., 0800-1400" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name={`stops.${index}.referenceNumber`} render={({ field }) => (<FormItem><FormLabel>Reference #</FormLabel><FormControl><Input placeholder="e.g., PU#, PO#" {...field} /></FormControl></FormItem>)} />
                  </div>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => append({ stopType: 'delivery', locationName: '', address: '', appointment: '', referenceNumber: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Stop</Button>
          </CardContent>
        </Card>

        <Card className="printable-card">
          <CardHeader><CardTitle>Route Notes</CardTitle></CardHeader>
          <CardContent>
            <FormField control={form.control} name="routeNotes" render={({ field }) => (
              <FormItem><FormLabel>Special instructions for this trip</FormLabel><FormControl><Textarea className="min-h-[120px]" placeholder="e.g., Recommended route: I-80 to I-76. Watch for construction near Denver. Call customer 1 hour prior to delivery." {...field} /></FormControl></FormItem>
            )}/>
          </CardContent>
        </Card>

        <div className="flex justify-end no-print"><Button type="submit" size="lg">Generate Trip Sheet</Button></div>
      </form>
    </Form>
  );
}
