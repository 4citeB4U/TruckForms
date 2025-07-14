// src/components/forms/violation-warning-notice-form.tsx
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

const violationWarningNoticeSchema = z.object({
  driverName: z.string().min(1, 'Driver name is required.'),
  noticeDate: z.date({ required_error: 'Date of notice is required.' }),
  
  noticeType: z.enum(['warning', 'violation']),
  
  violationType: z.string().min(1, 'Violation type is required.'),
  violationDate: z.date({ required_error: 'Date of violation is required.' }),
  
  violationDescription: z.string().min(10, 'A detailed description is required.'),
  correctiveActionRequired: z.string().min(10, 'Corrective action is required.'),
  
  driverComments: z.string().optional(),
  
  driverSignature: z.string().optional(),
  managerName: z.string().min(1, "Manager's name is required."),
  managerSignature: z.string().optional(),
});

type ViolationWarningNoticeFormValues = z.infer<typeof violationWarningNoticeSchema>;

export function ViolationWarningNoticeForm() {
  const { toast } = useToast();

  const form = useForm<ViolationWarningNoticeFormValues>({
    resolver: zodResolver(violationWarningNoticeSchema),
    defaultValues: { noticeDate: new Date(), noticeType: 'warning' },
    mode: 'onChange',
  });

  const handlePrint = () => window.print();

  const onSubmit = (data: ViolationWarningNoticeFormValues) => {
    console.log(data);
    toast({
      title: 'Notice Served',
      description: 'The violation/warning notice has been logged.',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between no-print">
          <div>
            <h1 className="text-2xl font-headline font-bold">Violation/Warning Notice</h1>
            <p className="text-muted-foreground">Formally document a violation or issue a warning.</p>
          </div>
          <Button type="button" variant="outline" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print</Button>
        </div>

        <Card className="printable-card">
          <CardHeader><CardTitle>Notice Details</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField control={form.control} name="driverName" render={({ field }) => (<FormItem><FormLabel>Driver Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="noticeDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Date of Notice</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="managerName" render={({ field }) => (<FormItem><FormLabel>Manager Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
          </CardContent>
        </Card>

        <Card className="printable-card">
            <CardHeader><CardTitle>Violation Information</CardTitle></CardHeader>
            <CardContent className="space-y-6">
                <FormField control={form.control} name="noticeType" render={({ field }) => (<FormItem className="space-y-3"><FormLabel>Type of Notice</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4"><FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="warning" /></FormControl><FormLabel className="font-normal">Warning</FormLabel></FormItem><FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="violation" /></FormControl><FormLabel className="font-normal">Violation</FormLabel></FormItem></RadioGroup></FormControl></FormItem>)} />
                <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="violationType" render={({ field }) => (<FormItem><FormLabel>Violation Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select type..." /></SelectTrigger></FormControl><SelectContent><SelectItem value="safety">Safety</SelectItem><SelectItem value="hos">Hours of Service</SelectItem><SelectItem value="equipment">Equipment</SelectItem><SelectItem value="company_policy">Company Policy</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="violationDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Date of Violation</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                </div>
                <FormField control={form.control} name="violationDescription" render={({ field }) => (<FormItem><FormLabel>Description of Violation/Issue</FormLabel><FormControl><Textarea className="min-h-[120px]" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="correctiveActionRequired" render={({ field }) => (<FormItem><FormLabel>Corrective Action Required</FormLabel><FormControl><Textarea placeholder="e.g., Driver must complete a remedial safety training course by..." className="min-h-[120px]" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </CardContent>
        </Card>

        <Card className="printable-card">
            <CardHeader><CardTitle>Driver Acknowledgment</CardTitle></CardHeader>
            <CardContent>
                <FormField control={form.control} name="driverComments" render={({ field }) => (<FormItem><FormLabel>Driver Comments (Optional)</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>)} />
            </CardContent>
        </Card>

        <Card className="printable-card">
          <CardHeader><CardTitle>Signatures</CardTitle><CardDescription>Driver signature acknowledges receipt of this notice, not necessarily agreement.</CardDescription></CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8">
            <div className='space-y-2'><FormLabel>Driver Signature</FormLabel><FormField control={form.control} name="driverSignature" render={({ field }) => (<SignaturePad onEnd={field.onChange} penColor='white' />)} /></div>
            <div className='space-y-2'><FormLabel>Manager Signature</FormLabel><FormField control={form.control} name="managerSignature" render={({ field }) => (<SignaturePad onEnd={field.onChange} penColor='white' />)} /></div>
          </CardContent>
        </Card>

        <div className="flex justify-end no-print"><Button type="submit" size="lg">Save Notice</Button></div>
      </form>
    </Form>
  );
}
