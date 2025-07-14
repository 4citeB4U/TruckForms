// src/components/forms/accident-incident-report-form.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
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
import {
  Printer,
  CalendarIcon,
  PlusCircle,
  Trash2,
  Upload,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '../ui/separator';

const otherPartySchema = z.object({
    name: z.string().min(1, "Name is required."),
    address: z.string().min(1, "Address is required."),
    phone: z.string().optional(),
    insuranceCompany: z.string().min(1, "Insurance company is required."),
    policyNumber: z.string().min(1, "Policy number is required."),
    vehicleInfo: z.string().optional(),
});


const accidentIncidentReportSchema = z.object({
  reportType: z.enum(['accident', 'incident']),
  driverName: z.string().min(1, 'Driver name is required.'),
  truckNumber: z.string().min(1, 'Truck number is required.'),
  dateOfIncident: z.date({ required_error: 'Date of incident is required.' }),
  timeOfIncident: z.string().min(1, 'Time of incident is required.'),
  location: z.string().min(1, 'Location is required.'),
  description: z.string().min(10, 'A detailed description is required.'),
  
  policeReportFiled: z.boolean().default(false),
  policeReportNumber: z.string().optional(),
  
  otherParties: z.array(otherPartySchema),
  
  witnesses: z.string().optional(),
  photosTaken: z.boolean().default(false),

  driverSignature: z.string().optional(),
  reportDate: z.date({ required_error: 'Report date is required.' }),
});

type AccidentIncidentReportFormValues = z.infer<typeof accidentIncidentReportSchema>;

const defaultValues: Partial<AccidentIncidentReportFormValues> = {
  reportType: 'incident',
  policeReportFiled: false,
  photosTaken: false,
  otherParties: [],
  reportDate: new Date(),
};

export function AccidentIncidentReportForm() {
  const { toast } = useToast();

  const form = useForm<AccidentIncidentReportFormValues>({
    resolver: zodResolver(accidentIncidentReportSchema),
    defaultValues,
    mode: 'onChange',
  });

   const { fields, append, remove } = useFieldArray({
    name: 'otherParties',
    control: form.control,
  });

  const handlePrint = () => window.print();

  const onSubmit = (data: AccidentIncidentReportFormValues) => {
    console.log(data);
    toast({
      title: 'Report Submitted!',
      description: 'Your Accident/Incident Report has been saved.',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between no-print">
          <div>
            <h1 className="text-2xl font-headline font-bold">Accident/Incident Report</h1>
            <p className="text-muted-foreground">Report any on-road accidents or safety incidents.</p>
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
            <CardTitle>Incident Details</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField control={form.control} name="reportType" render={({ field }) => (
                <FormItem><FormLabel>Report Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="accident">Accident (involving collision)</SelectItem>
                      <SelectItem value="incident">Incident (non-collision event)</SelectItem>
                    </SelectContent>
                  </Select>
                <FormMessage /></FormItem>
              )} />
            <FormField control={form.control} name="dateOfIncident" render={({ field }) => (
                <FormItem className="flex flex-col"><FormLabel>Date of Incident</FormLabel>
                   <Popover><PopoverTrigger asChild><FormControl>
                        <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent></Popover>
                <FormMessage /></FormItem>
              )} />
            <FormField control={form.control} name="timeOfIncident" render={({ field }) => (
                <FormItem><FormLabel>Time of Incident</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            <FormField control={form.control} name="driverName" render={({ field }) => (
                <FormItem><FormLabel>Driver Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            <FormField control={form.control} name="truckNumber" render={({ field }) => (
                <FormItem><FormLabel>Truck Number</FormLabel><FormControl><Input placeholder="T-567" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            <FormField control={form.control} name="location" render={({ field }) => (
                <FormItem className="lg:col-span-3"><FormLabel>Location of Incident</FormLabel><FormControl><Input placeholder="e.g., I-80 EB, Mile Marker 152, near Anytown, ST" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
          </CardContent>
        </Card>

        <Card className="printable-card">
            <CardHeader><CardTitle>Description of Events</CardTitle></CardHeader>
            <CardContent>
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Describe what happened in detail (sequence of events, weather, road conditions, etc.)</FormLabel><FormControl>
                        <Textarea className="min-h-[150px]" {...field} />
                    </FormControl><FormMessage /></FormItem>
                )}/>
            </CardContent>
        </Card>

        <Card className="printable-card">
            <CardHeader><CardTitle>Other Parties Involved</CardTitle></CardHeader>
            <CardContent>
                {fields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-md relative mb-4 space-y-4">
                         <h3 className="font-semibold">Party {index + 1}</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                             <FormField control={form.control} name={`otherParties.${index}.name`} render={({ field }) => (
                                <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name={`otherParties.${index}.phone`} render={({ field }) => (
                                <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name={`otherParties.${index}.address`} render={({ field }) => (
                                <FormItem className="md:col-span-2"><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                             <FormField control={form.control} name={`otherParties.${index}.insuranceCompany`} render={({ field }) => (
                                <FormItem><FormLabel>Insurance Company</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name={`otherParties.${index}.policyNumber`} render={({ field }) => (
                                <FormItem><FormLabel>Policy Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                             <FormField control={form.control} name={`otherParties.${index}.vehicleInfo`} render={({ field }) => (
                                <FormItem className="md:col-span-2"><FormLabel>Vehicle Info (Make, Model, License Plate)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>
                         <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => remove(index)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
                 <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', address: '', insuranceCompany: '', policyNumber: ''})}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Party
                </Button>
            </CardContent>
        </Card>

        <Card className="printable-card">
            <CardHeader><CardTitle>Official Report & Witnesses</CardTitle></CardHeader>
            <CardContent className="space-y-6">
                 <FormField control={form.control} name="policeReportFiled" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5"><FormLabel>Was a police report filed?</FormLabel></div>
                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                 )} />
                 {form.watch('policeReportFiled') && (
                    <FormField control={form.control} name="policeReportNumber" render={({ field }) => (
                        <FormItem><FormLabel>Police Report Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                 )}
                 <Separator />
                 <FormField control={form.control} name="witnesses" render={({ field }) => (
                    <FormItem><FormLabel>Witnesses (Name and contact info, if any)</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>
                 )}/>
            </CardContent>
        </Card>
        
         <Card className="printable-card">
            <CardHeader><CardTitle>Documentation & Signature</CardTitle></CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <FormField control={form.control} name="photosTaken" render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel>Photos Uploaded</FormLabel>
                                <FormDescription>Confirm you have uploaded photos of the scene and damage.</FormDescription>
                            </div>
                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        </FormItem>
                    )} />
                    <Button type="button" variant="outline"><Upload className="h-4 w-4 mr-2" /> Upload Photos</Button>
                </div>
                <Separator />
                <div className='space-y-2'>
                    <FormLabel>Driver Signature</FormLabel>
                    <FormDescription>I certify that the information in this report is true and correct to the best of my knowledge.</FormDescription>
                    <FormField control={form.control} name="driverSignature" render={({ field }) => (
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
