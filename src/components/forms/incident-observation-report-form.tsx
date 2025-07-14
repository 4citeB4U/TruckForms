// src/components/forms/incident-observation-report-form.tsx
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
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

const incidentObservationReportSchema = z.object({
  traineeName: z.string().min(1, 'Trainee name is required.'),
  trainerName: z.string().min(1, 'Trainer name is required.'),
  observationDate: z.date({ required_error: 'Observation date is required.' }),
  
  observationType: z.enum(['positive', 'negative']),
  
  context: z.string().min(1, "Context is required."),
  observation: z.string().min(10, 'A detailed observation is required.'),
  feedbackProvided: z.string().min(10, 'Feedback provided is required.'),
  
  traineeSignature: z.string().optional(),
  trainerSignature: z.string().optional(),
});

type IncidentObservationReportFormValues = z.infer<typeof incidentObservationReportSchema>;

export function IncidentObservationReportForm() {
  const { toast } = useToast();
  const form = useForm<IncidentObservationReportFormValues>({
    resolver: zodResolver(incidentObservationReportSchema),
    defaultValues: { observationDate: new Date(), observationType: 'positive' },
    mode: 'onChange',
  });

  const handlePrint = () => window.print();

  const onSubmit = (data: IncidentObservationReportFormValues) => {
    console.log(data);
    toast({
      title: 'Report Saved',
      description: 'The incident/observation report has been saved.',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between no-print">
          <div>
            <h1 className="text-2xl font-headline font-bold">Incident/Observation Report (Training)</h1>
            <p className="text-muted-foreground">Document specific incidents or observations during training sessions.</p>
          </div>
          <Button type="button" variant="outline" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print</Button>
        </div>

        <Card className="printable-card">
          <CardHeader><CardTitle>Report Details</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField control={form.control} name="traineeName" render={({ field }) => (<FormItem><FormLabel>Trainee Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="trainerName" render={({ field }) => (<FormItem><FormLabel>Trainer Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="observationDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Date of Observation</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
          </CardContent>
        </Card>

        <Card className="printable-card">
          <CardHeader><CardTitle>Observation Details</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <FormField control={form.control} name="observationType" render={({ field }) => (
                <FormItem className="space-y-3"><FormLabel>Observation Type</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4"><FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="positive" /></FormControl><FormLabel className="font-normal">Positive (Skill Demonstrated)</FormLabel></FormItem><FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="negative" /></FormControl><FormLabel className="font-normal">Negative (Incident/Area for Improvement)</FormLabel></FormItem></RadioGroup></FormControl><FormMessage /></FormItem>
              )} />
            <FormField control={form.control} name="context" render={({ field }) => (<FormItem><FormLabel>Context of Observation</FormLabel><FormControl><Input placeholder="e.g., During pre-trip inspection, city driving, backing maneuver..." {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="observation" render={({ field }) => (<FormItem><FormLabel>Detailed Observation (What happened?)</FormLabel><FormControl><Textarea className="min-h-[120px]" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="feedbackProvided" render={({ field }) => (<FormItem><FormLabel>Feedback Provided to Trainee</FormLabel><FormControl><Textarea className="min-h-[120px]" {...field} /></FormControl><FormMessage /></FormItem>)} />
          </CardContent>
        </Card>

        <Card className="printable-card">
          <CardHeader><CardTitle>Signatures</CardTitle><CardDescription>Signatures acknowledge this observation was discussed.</CardDescription></CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8">
            <div className='space-y-2'><FormLabel>Trainee Signature</FormLabel><FormField control={form.control} name="traineeSignature" render={({ field }) => (<SignaturePad onEnd={field.onChange} penColor='white' />)} /></div>
            <div className='space-y-2'><FormLabel>Trainer Signature</FormLabel><FormField control={form.control} name="trainerSignature" render={({ field }) => (<SignaturePad onEnd={field.onChange} penColor='white' />)} /></div>
          </CardContent>
        </Card>

        <div className="flex justify-end no-print"><Button type="submit" size="lg">Save Report</Button></div>
      </form>
    </Form>
  );
}
