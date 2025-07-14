// src/components/forms/driver-complaint-feedback-form.tsx
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '../ui/separator';

const driverComplaintFeedbackSchema = z.object({
  submissionDate: z.date({ required_error: 'Submission date is required.' }),
  driverName: z.string().min(1, 'Driver name is required.'),
  submissionType: z.enum(['complaint', 'feedback', 'suggestion']),
  
  category: z.string().min(1, 'Category is required.'),
  
  description: z.string().min(10, 'A detailed description is required.'),
  suggestedSolution: z.string().optional(),
  
  followUpRequested: z.boolean().default(false),
  
  handlerName: z.string().optional(),
  actionTaken: z.string().optional(),
  resolutionDate: z.date().optional(),
  
  driverSignature: z.string().optional(),
});

type DriverComplaintFeedbackFormValues = z.infer<typeof driverComplaintFeedbackSchema>;

export function DriverComplaintFeedbackForm() {
  const { toast } = useToast();

  const form = useForm<DriverComplaintFeedbackFormValues>({
    resolver: zodResolver(driverComplaintFeedbackSchema),
    defaultValues: {
        submissionDate: new Date(),
        submissionType: 'feedback',
        followUpRequested: false,
    },
    mode: 'onChange',
  });

  const handlePrint = () => window.print();

  const onSubmit = (data: DriverComplaintFeedbackFormValues) => {
    console.log(data);
    toast({
      title: 'Submission Received',
      description: 'Thank you for your feedback. It has been recorded.',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between no-print">
          <div>
            <h1 className="text-2xl font-headline font-bold">Driver Complaint/Feedback Form</h1>
            <p className="text-muted-foreground">Log and address driver complaints, feedback, and suggestions.</p>
          </div>
          <Button type="button" variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print / Download
          </Button>
        </div>

        <Card className="printable-card">
          <CardHeader>
            <CardTitle>Submission Details</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <FormField control={form.control} name="driverName" render={({ field }) => (
                <FormItem><FormLabel>Driver Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            <FormField control={form.control} name="submissionDate" render={({ field }) => (
                <FormItem className="flex flex-col"><FormLabel>Date</FormLabel>
                   <Popover><PopoverTrigger asChild><FormControl>
                        <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover>
                <FormMessage /></FormItem>
              )} />
            <FormField control={form.control} name="submissionType" render={({ field }) => (
                <FormItem className="space-y-3"><FormLabel>Type of Submission</FormLabel><FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                        <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="complaint" /></FormControl><FormLabel className="font-normal">Complaint</FormLabel></FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="feedback" /></FormControl><FormLabel className="font-normal">Feedback</FormLabel></FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="suggestion" /></FormControl><FormLabel className="font-normal">Suggestion</FormLabel></FormItem>
                    </RadioGroup>
                </FormControl><FormMessage /></FormItem>
              )} />
             <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem><FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select a category..." /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="dispatch">Dispatch/Load Assignment</SelectItem>
                            <SelectItem value="payroll">Payroll/Settlement</SelectItem>
                            <SelectItem value="equipment">Equipment/Maintenance</SelectItem>
                            <SelectItem value="safety">Safety</SelectItem>
                            <SelectItem value="personnel">Personnel Issue</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                <FormMessage /></FormItem>
              )} />
          </CardContent>
        </Card>

        <Card className="printable-card">
            <CardHeader><CardTitle>Detailed Information</CardTitle></CardHeader>
            <CardContent className="space-y-6">
                 <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Please describe the issue, feedback, or suggestion in detail.</FormLabel><FormControl><Textarea className="min-h-[150px]" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="suggestedSolution" render={({ field }) => (
                    <FormItem><FormLabel>Suggested Solution (Optional)</FormLabel><FormControl><Textarea className="min-h-[100px]" {...field} /></FormControl></FormItem>
                )}/>
                <FormField control={form.control} name="driverSignature" render={({ field }) => (
                    <FormItem><FormLabel>Driver Signature (Optional)</FormLabel><SignaturePad onEnd={field.onChange} penColor='white' /><FormMessage /></FormItem>
                )}/>
            </CardContent>
        </Card>
        
        <Separator />
        
        <Card className="printable-card bg-muted/30">
            <CardHeader>
                <CardTitle>For Management Use Only</CardTitle>
                <CardDescription>This section is to be filled out by the handling manager or department.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
                <FormField control={form.control} name="handlerName" render={({ field }) => (
                    <FormItem><FormLabel>Received / Handled By</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )}/>
                <FormField control={form.control} name="resolutionDate" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Date of Resolution</FormLabel>
                    <Popover><PopoverTrigger asChild><FormControl>
                        <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover>
                    </FormItem>
                )}/>
                <FormField control={form.control} name="actionTaken" render={({ field }) => (
                    <FormItem className="md:col-span-2"><FormLabel>Action Taken / Resolution Details</FormLabel><FormControl><Textarea className="min-h-[120px]" {...field} /></FormControl></FormItem>
                )}/>
            </CardContent>
        </Card>

        <div className="flex justify-end no-print">
          <Button type="submit" size="lg">Submit Feedback</Button>
        </div>
      </form>
    </Form>
  );
}
