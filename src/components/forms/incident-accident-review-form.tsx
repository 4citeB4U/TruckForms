// src/components/forms/incident-accident-review-form.tsx
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
import { Textarea } from '@/components/ui/textarea';
import { SignaturePad } from '@/components/ui/signature-pad';
import { Printer, CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const incidentReviewSchema = z.object({
  originalReportId: z.string().min(1, 'Original report ID/number is required.'),
  driverName: z.string().min(1, 'Driver name is required.'),
  dateOfIncident: z.date({ required_error: 'Date of incident is required.' }),
  
  reviewDate: z.date({ required_error: 'Review date is required.' }),
  reviewerName: z.string().min(1, 'Reviewer name is required.'),
  
  rootCauseAnalysis: z.string().min(10, 'Root cause analysis is required.'),
  preventability: z.enum(['preventable', 'non-preventable']),
  preventabilityReasoning: z.string().min(10, 'Reasoning for preventability is required.'),
  
  correctiveActions: z.string().min(10, 'Corrective actions are required.'),
  followUpRequired: z.boolean().default(false),
  followUpDate: z.date().optional(),
  
  reviewerSignature: z.string().optional(),
  driverSignature: z.string().optional(),
});

type IncidentReviewFormValues = z.infer<typeof incidentReviewSchema>;

export function IncidentAccidentReviewForm() {
  const { toast } = useToast();
  const form = useForm<IncidentReviewFormValues>({
    resolver: zodResolver(incidentReviewSchema),
    defaultValues: {
      reviewDate: new Date(),
      preventability: 'preventable',
      followUpRequired: false
    },
    mode: 'onChange',
  });

  const handlePrint = () => window.print();
  const onSubmit = (data: IncidentReviewFormValues) => {
    console.log(data);
    toast({
      title: 'Review Complete',
      description: 'The incident review has been saved.',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between no-print">
          <div>
            <h1 className="text-2xl font-headline font-bold">Incident/Accident Review</h1>
            <p className="text-muted-foreground">Internal review of a reported incident for preventability and corrective action.</p>
          </div>
          <Button type="button" variant="outline" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print</Button>
        </div>

        <Card className="printable-card">
          <CardHeader><CardTitle>Incident & Review Details</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField control={form.control} name="originalReportId" render={({ field }) => (<FormItem><FormLabel>Original Report #</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="driverName" render={({ field }) => (<FormItem><FormLabel>Driver Involved</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="dateOfIncident" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Date of Incident</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="reviewerName" render={({ field }) => (<FormItem><FormLabel>Reviewer Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="reviewDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Date of Review</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
          </CardContent>
        </Card>
        
        <Card className="printable-card">
            <CardHeader><CardTitle>Analysis & Findings</CardTitle></CardHeader>
            <CardContent className="space-y-6">
                <FormField control={form.control} name="rootCauseAnalysis" render={({ field }) => (<FormItem><FormLabel>Root Cause Analysis</FormLabel><FormControl><Textarea placeholder="Describe the primary factors that led to the incident..." className='min-h-[120px]' {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="preventability" render={({ field }) => (
                    <FormItem className="space-y-3"><FormLabel>Preventability Determination</FormLabel><FormControl><div className="flex gap-4"><div className='flex items-center space-x-2'><input type="radio" value="preventable" checked={field.value === 'preventable'} onChange={field.onChange} name={field.name} /><label>Preventable</label></div><div className='flex items-center space-x-2'><input type="radio" value="non-preventable" checked={field.value === 'non-preventable'} onChange={field.onChange} name={field.name} /><label>Non-Preventable</label></div></div></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="preventabilityReasoning" render={({ field }) => (<FormItem><FormLabel>Reasoning for Determination</FormLabel><FormControl><Textarea placeholder="Explain why the incident was or was not preventable..." className='min-h-[120px]' {...field} /></FormControl><FormMessage /></FormItem>)} />
            </CardContent>
        </Card>
        
        <Card className="printable-card">
            <CardHeader><CardTitle>Corrective Action & Follow-Up</CardTitle></CardHeader>
            <CardContent className="space-y-6">
                <FormField control={form.control} name="correctiveActions" render={({ field }) => (<FormItem><FormLabel>Corrective Actions to be Taken</FormLabel><FormControl><Textarea placeholder="e.g., Additional training on backing maneuvers, coaching on speed management..." className='min-h-[120px]' {...field} /></FormControl><FormMessage /></FormItem>)} />
                <div className='grid md:grid-cols-2 gap-6 items-center'>
                    <FormField control={form.control} name="followUpRequired" render={({ field }) => (<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4"><div className="space-y-0.5"><FormLabel>Is a follow-up required?</FormLabel></div><FormControl><input type="checkbox" checked={field.value} onChange={e => field.onChange(e.target.checked)} /></FormControl></FormItem>)} />
                    {form.watch('followUpRequired') && <FormField control={form.control} name="followUpDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Follow-Up Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover></FormItem>)} />}
                </div>
            </CardContent>
        </Card>

        <Card className="printable-card">
          <CardHeader><CardTitle>Signatures</CardTitle><CardDescription>Signatures acknowledge this review was conducted and discussed.</CardDescription></CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8">
            <div className='space-y-2'><FormLabel>Reviewer Signature</FormLabel><FormField control={form.control} name="reviewerSignature" render={({ field }) => (<SignaturePad onEnd={field.onChange} penColor='white' />)} /></div>
            <div className='space-y-2'><FormLabel>Driver Signature</FormLabel><FormField control={form.control} name="driverSignature" render={({ field }) => (<SignaturePad onEnd={field.onChange} penColor='white' />)} /></div>
          </CardContent>
        </Card>

        <div className="flex justify-end no-print"><Button type="submit" size="lg">Save Review</Button></div>
      </form>
    </Form>
  );
}
