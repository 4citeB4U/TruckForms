// src/components/forms/pre-post-trip-inspection-form.tsx
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
import { Printer, Wand2, Loader2, CalendarIcon, AlertTriangle } from 'lucide-react';
import { useState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const inspectionItemSchema = z.object({
  name: z.string(),
  status: z.enum(['ok', 'defect', 'na']),
  remarks: z.string().optional(),
});

const prePostTripInspectionSchema = z.object({
  inspectionType: z.enum(['pre-trip', 'post-trip']),
  date: z.date({ required_error: 'Date is required.' }),
  driverName: z.string().min(1, 'Driver name is required.'),
  truckNumber: z.string().min(1, 'Truck number is required.'),
  odometerReading: z.coerce.number().min(1, 'Odometer reading is required.'),
  inspectionItems: z.array(inspectionItemSchema),
  defectsCorrected: z.boolean().default(false),
  remarks: z.string().optional(),
  driverSignature: z.string().optional(),
  mechanicSignature: z.string().optional(),
});

type PrePostTripInspectionFormValues = z.infer<typeof prePostTripInspectionSchema>;

const inspectionChecklist = [
    // Exterior
    "Air Compressor", "Air Lines", "Battery", "Brakes", "Body", "Clutch",
    "Coupling Devices", "Defroster", "Drive Line", "Engine", "Exhaust",
    "Fifth Wheel", "Fluid Levels", "Frame & Assembly", "Front Axle",
    "Fuel Tanks", "Heater", "Horn", "Lights & Reflectors", "Mirrors",
    // Interior
    "Oil Pressure", "Parking Brake", "Radiator", "Rear End", "Safety Equipment",
    "Springs", "Starter", "Steering", "Suspension", "Tires", "Transmission",
    "Trip Recorder", "Wheels & Rims", "Windows", "Windshield Wipers", "Other",
];

const defaultValues: Partial<PrePostTripInspectionFormValues> = {
  inspectionType: 'pre-trip',
  inspectionItems: inspectionChecklist.map(name => ({ name, status: 'ok', remarks: '' })),
  defectsCorrected: false,
};

export function PrePostTripInspectionForm() {
  const { toast } = useToast();
  const [isAiPending, startAiTransition] = useTransition();

  const form = useForm<PrePostTripInspectionFormValues>({
    resolver: zodResolver(prePostTripInspectionSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { fields } = useFieldArray({
    name: 'inspectionItems',
    control: form.control,
  });

  const handlePrint = () => window.print();

  const onSubmit = (data: PrePostTripInspectionFormValues) => {
    console.log(data);
    toast({
      title: 'DVIR Submitted!',
      description: 'Your inspection report has been saved.',
    });
  };

  const hasDefects = form.watch('inspectionItems').some(item => item.status === 'defect');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between no-print">
          <div>
            <h1 className="text-2xl font-headline font-bold">Pre/Post-Trip Inspection (DVIR)</h1>
            <p className="text-muted-foreground">Driver's Vehicle Inspection Report</p>
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
            <CardTitle>Inspection Details</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FormField
              control={form.control}
              name="inspectionType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inspection Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pre-trip">Pre-Trip</SelectItem>
                      <SelectItem value="post-trip">Post-Trip</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="driverName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Driver Name</FormLabel>
                  <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="truckNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Truck/Tractor No.</FormLabel>
                  <FormControl><Input placeholder="T-567" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="odometerReading"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Odometer Reading</FormLabel>
                  <FormControl><Input type="number" placeholder="123456" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className="printable-card">
          <CardHeader>
            <CardTitle>Vehicle Inspection Checklist</CardTitle>
            <CardDescription>Check each item. Mark as 'Defect' if any issues are found.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-4">
            {fields.map((item, index) => (
              <FormField
                key={item.id}
                control={form.control}
                name={`inspectionItems.${index}`}
                render={({ field }) => (
                  <FormItem className="p-2 rounded-md border border-transparent hover:border-border transition-colors">
                    <FormLabel className="font-semibold">{item.name}</FormLabel>
                    <FormControl>
                      <Select onValueChange={(value) => field.onChange({ ...field.value, status: value })} defaultValue={field.value.status}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ok">✅ OK</SelectItem>
                          <SelectItem value="defect">❌ Defect</SelectItem>
                          <SelectItem value="na">N/A</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    {form.watch(`inspectionItems.${index}.status`) === 'defect' && (
                      <FormField
                        control={form.control}
                        name={`inspectionItems.${index}.remarks`}
                        render={({ field: remarkField }) => (
                          <Input {...remarkField} placeholder="Describe defect..." className="mt-2" />
                        )}
                      />
                    )}
                  </FormItem>
                )}
              />
            ))}
          </CardContent>
        </Card>

        {hasDefects && (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Defects Found</AlertTitle>
                <AlertDescription>
                    One or more defects have been noted. Please add remarks below and ensure the vehicle is safe to operate.
                </AlertDescription>
            </Alert>
        )}

        <Card className="printable-card">
            <CardHeader><CardTitle>Remarks</CardTitle></CardHeader>
            <CardContent>
                <FormField
                    control={form.control}
                    name="remarks"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>If any defects were noted, describe them below. If not, note "No defects".</FormLabel>
                            <FormControl>
                                <Textarea placeholder="e.g., Left headlight out. Replaced bulb." {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>

        <Card className="printable-card">
          <CardHeader>
            <CardTitle>Certification &amp; Signatures</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="defectsCorrected"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={!hasDefects} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Defects corrected</FormLabel>
                    <FormDescription>Check if the defects listed above have been corrected. (Mechanic/Shop)</FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <Separator />
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <FormLabel>Driver's Signature</FormLabel>
                    <FormDescription>I certify that this report is true and correct.</FormDescription>
                    <FormField control={form.control} name="driverSignature" render={({ field }) => (
                        <SignaturePad onEnd={field.onChange} penColor="white" />
                    )} />
                </div>
                <div className="space-y-2">
                    <FormLabel>Mechanic's Signature (if defects corrected)</FormLabel>
                     <FormDescription>I certify that the defects have been corrected.</FormDescription>
                    <FormField control={form.control} name="mechanicSignature" render={({ field }) => (
                        <SignaturePad onEnd={field.onChange} penColor="white" />
                    )} />
                </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end no-print">
          <Button type="submit" size="lg">Submit Inspection Report</Button>
        </div>
      </form>
    </Form>
  );
}
