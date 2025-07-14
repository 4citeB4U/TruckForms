// src/components/forms/roadside-inspection-report-form.tsx
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
import { Printer, CalendarIcon, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

const roadsideInspectionReportSchema = z.object({
  driverName: z.string().min(1, 'Driver name is required.'),
  truckNumber: z.string().min(1, 'Truck number is required.'),
  inspectionDate: z.date({ required_error: 'Date is required.' }),
  inspectionTime: z.string().min(1, 'Time is required.'),
  location: z.string().min(1, 'Location is required.'),
  officerName: z.string().optional(),
  officerBadgeNumber: z.string().optional(),
  agency: z.string().optional(),
  reportNumber: z.string().optional(),
  inspectionLevel: z.enum(['1', '2', '3', '4', '5', '6']),
  violationsFound: z.boolean().default(false),
  violationsDescription: z.string().optional(),
  outcome: z.string().optional(),
  driverSignature: z.string().optional(),
});

type RoadsideInspectionReportFormValues = z.infer<typeof roadsideInspectionReportSchema>;

export function RoadsideInspectionReportForm() {
  const { toast } = useToast();

  const form = useForm<RoadsideInspectionReportFormValues>({
    resolver: zodResolver(roadsideInspectionReportSchema),
    defaultValues: {
      inspectionLevel: '1',
      violationsFound: false,
    },
    mode: 'onChange',
  });

  const handlePrint = () => window.print();

  const onSubmit = (data: RoadsideInspectionReportFormValues) => {
    console.log(data);
    toast({
      title: 'Report Submitted!',
      description: 'The Roadside Inspection Report has been saved.',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between no-print">
          <div>
            <h1 className="text-2xl font-headline font-bold">Roadside Inspection Report</h1>
            <p className="text-muted-foreground">Document details of a roadside inspection by law enforcement.</p>
          </div>
          <Button type="button" variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print / Download
          </Button>
        </div>

        <Card className="printable-card">
          <CardHeader><CardTitle>Inspection Details</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField control={form.control} name="driverName" render={({ field }) => (
                <FormItem><FormLabel>Driver Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            <FormField control={form.control} name="truckNumber" render={({ field }) => (
                <FormItem><FormLabel>Truck Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            <FormField control={form.control} name="inspectionDate" render={({ field }) => (
                <FormItem className="flex flex-col"><FormLabel>Date of Inspection</FormLabel>
                   <Popover><PopoverTrigger asChild><FormControl>
                        <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover>
                <FormMessage /></FormItem>
              )} />
            <FormField control={form.control} name="inspectionTime" render={({ field }) => (
                <FormItem><FormLabel>Time of Inspection</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
             <FormField control={form.control} name="location" render={({ field }) => (
                <FormItem className="lg:col-span-2"><FormLabel>Location</FormLabel><FormControl><Input placeholder="e.g., I-80 EB, Mile Marker 152" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
          </CardContent>
        </Card>

        <Card className="printable-card">
          <CardHeader><CardTitle>Officer & Agency Information</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
             <FormField control={form.control} name="officerName" render={({ field }) => (
                <FormItem><FormLabel>Officer Name</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
             <FormField control={form.control} name="officerBadgeNumber" render={({ field }) => (
                <FormItem><FormLabel>Officer Badge Number</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
             <FormField control={form.control} name="agency" render={({ field }) => (
                <FormItem><FormLabel>Agency</FormLabel><FormControl><Input placeholder="e.g., CHP, DOT" {...field} /></FormControl></FormItem>
              )} />
             <FormField control={form.control} name="reportNumber" render={({ field }) => (
                <FormItem><FormLabel>Report/Citation Number</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
             <FormField control={form.control} name="inspectionLevel" render={({ field }) => (
                <FormItem><FormLabel>Inspection Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="1">Level I: North American Standard Inspection</SelectItem>
                      <SelectItem value="2">Level II: Walk-Around Driver/Vehicle Inspection</SelectItem>
                      <SelectItem value="3">Level III: Driver/Credential Inspection</SelectItem>
                      <SelectItem value="4">Level IV: Special Inspection</SelectItem>
                      <SelectItem value="5">Level V: Vehicle-Only Inspection</SelectItem>
                      <SelectItem value="6">Level VI: Enhanced NAS Inspection for Radioactive Shipments</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )} />
          </CardContent>
        </Card>

        <Card className="printable-card">
          <CardHeader><CardTitle>Violations & Outcome</CardTitle></CardHeader>
          <CardContent className="space-y-6">
             <FormField control={form.control} name="violationsFound" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5"><FormLabel>Were any violations found?</FormLabel></div>
                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
             )} />
             {form.watch('violationsFound') && (
                <FormField control={form.control} name="violationsDescription" render={({ field }) => (
                    <FormItem><FormLabel>Describe all violations, warnings, or citations issued.</FormLabel><FormControl><Textarea className="min-h-[120px]" {...field} /></FormControl></FormItem>
                )}/>
             )}
            <Separator />
            <FormField control={form.control} name="outcome" render={({ field }) => (
                <FormItem><FormLabel>Outcome</FormLabel><FormControl><Input placeholder="e.g., Clean inspection, written warning, out-of-service order" {...field} /></FormControl></FormItem>
            )}/>
          </CardContent>
        </Card>
        
        <Card className="printable-card">
            <CardHeader><CardTitle>Documentation & Signature</CardTitle></CardHeader>
            <CardContent className='grid md:grid-cols-2 gap-8'>
                <div className="space-y-4">
                    <h3 className="font-semibold">Upload Inspection Report</h3>
                    <p className="text-sm text-muted-foreground">Upload a photo or scan of the official report given to you by the officer.</p>
                    <Button type="button" variant="outline"><Upload className="h-4 w-4 mr-2" /> Upload Report</Button>
                </div>
                <div className='space-y-2'>
                    <FormLabel>Driver Signature</FormLabel>
                    <FormDescription>My signature confirms that the information provided is accurate.</FormDescription>
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
