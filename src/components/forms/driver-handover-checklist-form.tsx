// src/components/forms/driver-handover-checklist-form.tsx
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
import { Checkbox } from '@/components/ui/checkbox';
import { SignaturePad } from '@/components/ui/signature-pad';
import { Printer, CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '../ui/textarea';

const checkItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  checked: z.boolean().default(false),
});

const driverHandoverChecklistSchema = z.object({
  outgoingDriver: z.string().min(1, 'Outgoing driver is required.'),
  incomingDriver: z.string().min(1, 'Incoming driver is required.'),
  truckNumber: z.string().min(1, 'Truck number is required.'),
  handoverDate: z.date({ required_error: 'Handover date is required.' }),
  odometer: z.coerce.number().positive(),
  fuelLevel: z.string().min(1, "Fuel level is required."),
  checklistItems: z.array(checkItemSchema).refine(items => items.every(item => item.checked), {
    message: "All items must be checked off to complete the handover.",
    path: ["checklistItems"]
  }),
  damageNotes: z.string().optional(),
  outgoingDriverSignature: z.string().optional(),
  incomingDriverSignature: z.string().optional(),
});

type DriverHandoverChecklistFormValues = z.infer<typeof driverHandoverChecklistSchema>;

const checklistItems = [
    { id: 'keys', label: 'Vehicle Keys' },
    { id: 'fuel_card', label: 'Fuel Card & Documents' },
    { id: 'eld', label: 'ELD/Tablet Device' },
    { id: 'cab_clean', label: 'Cab Interior Clean & Tidy' },
    { id: 'paperwork', label: 'All Load Paperwork Present' },
    { id: 'safety_gear', label: 'Safety Gear (vest, triangles, extinguisher)' },
    { id: 'personal_items', label: 'Personal Items Removed' },
];


export function DriverHandoverChecklistForm() {
  const { toast } = useToast();
  const form = useForm<DriverHandoverChecklistFormValues>({
    resolver: zodResolver(driverHandoverChecklistSchema),
    defaultValues: {
        handoverDate: new Date(),
        checklistItems: checklistItems.map(item => ({...item, checked: false }))
    },
    mode: 'onChange',
  });

  const handlePrint = () => window.print();

  const onSubmit = (data: DriverHandoverChecklistFormValues) => {
    console.log(data);
    toast({
      title: 'Handover Complete',
      description: 'The driver handover checklist has been successfully logged.',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between no-print">
          <div>
            <h1 className="text-2xl font-headline font-bold">Driver Handover Checklist</h1>
            <p className="text-muted-foreground">Ensure a smooth and documented handover of equipment between drivers.</p>
          </div>
          <Button type="button" variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
        </div>

        <Card className="printable-card">
          <CardHeader>
            <CardTitle>Handover Details</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField control={form.control} name="outgoingDriver" render={({ field }) => (<FormItem><FormLabel>Outgoing Driver</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="incomingDriver" render={({ field }) => (<FormItem><FormLabel>Incoming Driver</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="truckNumber" render={({ field }) => (<FormItem><FormLabel>Truck/Unit #</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="handoverDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Handover Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="odometer" render={({ field }) => (<FormItem><FormLabel>Odometer Reading</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="fuelLevel" render={({ field }) => (<FormItem><FormLabel>Fuel Level</FormLabel><FormControl><Input placeholder='e.g., 3/4 Tank' {...field} /></FormControl><FormMessage /></FormItem>)} />
          </CardContent>
        </Card>

        <Card className="printable-card">
            <CardHeader><CardTitle>Handover Checklist</CardTitle><CardDescription>Both drivers must verify each item is present and correct.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
                 <FormField
                    control={form.control}
                    name="checklistItems"
                    render={() => (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {form.getValues('checklistItems').map((item, index) => (
                            <FormField
                            key={item.id}
                            control={form.control}
                            name={`checklistItems.${index}.checked`}
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>{item.label}</FormLabel>
                                </div>
                                </FormItem>
                            )}
                            />
                        ))}
                        </div>
                    )}
                    />
                {form.formState.errors.checklistItems && <FormMessage>{form.formState.errors.checklistItems.message}</FormMessage>}
                <Separator className="my-6"/>
                <FormField control={form.control} name="damageNotes" render={({ field }) => (<FormItem><FormLabel>Notes on any Existing Damage or Issues</FormLabel><FormControl><Textarea placeholder="e.g., Small crack in bottom corner of windshield, driver side. Scratch on passenger door." {...field} /></FormControl></FormItem>)} />
            </CardContent>
        </Card>

        <Card className="printable-card">
          <CardHeader><CardTitle>Signatures</CardTitle><CardDescription>Both drivers must sign to confirm the handover is complete and accurate.</CardDescription></CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8">
            <div className='space-y-2'><FormLabel>Outgoing Driver Signature</FormLabel><FormField control={form.control} name="outgoingDriverSignature" render={({ field }) => (<SignaturePad onEnd={field.onChange} penColor='white' />)} /></div>
            <div className='space-y-2'><FormLabel>Incoming Driver Signature</FormLabel><FormField control={form.control} name="incomingDriverSignature" render={({ field }) => (<SignaturePad onEnd={field.onChange} penColor='white' />)} /></div>
          </CardContent>
        </Card>

        <div className="flex justify-end no-print"><Button type="submit" size="lg">Complete Handover</Button></div>
      </form>
    </Form>
  );
}
