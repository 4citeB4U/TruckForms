// src/components/forms/certification-completion-report-form.tsx
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
import { Textarea } from '@/components/ui/textarea';
import { SignaturePad } from '@/components/ui/signature-pad';
import { Printer, CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';

const certificationCompletionSchema = z.object({
  traineeName: z.string().min(1, 'Trainee name is required.'),
  certificationName: z.string().min(1, 'Certification name is required.'),
  completionDate: z.date({ required_error: 'Completion date is required.' }),
  trainerName: z.string().min(1, 'Trainer name is required.'),
  finalScore: z.coerce.number().optional(),
  overallAssessment: z.string().min(10, "Assessment notes are required."),
  trainerSignature: z.string().optional(),
  traineeSignature: z.string().optional(),
});

type CertificationCompletionFormValues = z.infer<typeof certificationCompletionSchema>;

export function CertificationCompletionReportForm() {
  const { toast } = useToast();

  const form = useForm<CertificationCompletionFormValues>({
    resolver: zodResolver(certificationCompletionSchema),
    defaultValues: {},
    mode: 'onChange',
  });

  const handlePrint = () => window.print();

  const onSubmit = (data: CertificationCompletionFormValues) => {
    console.log(data);
    toast({
      title: 'Report Submitted!',
      description: 'The Certification Completion Report has been saved.',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between no-print">
          <div>
            <h1 className="text-2xl font-headline font-bold">Certification Completion Report</h1>
            <p className="text-muted-foreground">Confirm trainees have met certification requirements.</p>
          </div>
          <Button type="button" variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print / Download
          </Button>
        </div>

        <Card className="printable-card">
          <CardHeader>
            <CardTitle>Certification Details</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField control={form.control} name="traineeName" render={({ field }) => (
                <FormItem><FormLabel>Trainee Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            <FormField control={form.control} name="certificationName" render={({ field }) => (
                <FormItem><FormLabel>Certification/Training Program</FormLabel><FormControl><Input placeholder="e.g., Class A CDL Training" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            <FormField control={form.control} name="completionDate" render={({ field }) => (
                <FormItem className="flex flex-col"><FormLabel>Completion Date</FormLabel>
                  <Popover><PopoverTrigger asChild><FormControl>
                    <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover>
                  <FormMessage />
                </FormItem>
              )} />
            <FormField control={form.control} name="trainerName" render={({ field }) => (
                <FormItem><FormLabel>Trainer/Assessor Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            <FormField control={form.control} name="finalScore" render={({ field }) => (
                <FormItem><FormLabel>Final Score (Optional)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
          </CardContent>
        </Card>

        <Card className="printable-card">
          <CardHeader>
            <CardTitle>Overall Assessment</CardTitle>
            <CardDescription>Provide a summary of the trainee's performance and readiness.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField control={form.control} name="overallAssessment" render={({ field }) => (
                <FormItem><FormControl><Textarea className="min-h-[150px]" placeholder="Summarize strengths, areas for improvement, and confirm that all requirements have been met..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />
          </CardContent>
        </Card>

        <Card className="printable-card">
          <CardHeader>
            <CardTitle>Signatures</CardTitle>
            <CardDescription>Both trainer and trainee must sign to confirm completion and understanding.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8">
            <div className='space-y-2'>
              <FormLabel>Trainer Signature</FormLabel>
               <FormField control={form.control} name="trainerSignature" render={({ field }) => (
                    <SignaturePad onEnd={field.onChange} penColor='white' />
                )} />
            </div>
            <div className='space-y-2'>
              <FormLabel>Trainee Signature</FormLabel>
               <FormField control={form.control} name="traineeSignature" render={({ field }) => (
                    <SignaturePad onEnd={field.onChange} penColor='white' />
                )} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end no-print">
          <Button type="submit" size="lg">Finalize Report</Button>
        </div>
      </form>
    </Form>
  );
}
