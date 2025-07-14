// src/components/forms/disciplinary-action-log-form.tsx
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
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

const disciplinaryActionLogSchema = z.object({
  employeeName: z.string().min(1, 'Employee name is required.'),
  dateOfDiscussion: z.date({ required_error: 'Date of discussion is required.' }),
  managerName: z.string().min(1, 'Manager name is required.'),
  
  actionType: z.enum(['verbal_warning', 'written_warning', 'coaching', 'performance_improvement_plan', 'other']),
  
  incidentDescription: z.string().min(10, "A description of the incident/issue is required."),
  expectedImprovement: z.string().min(10, "A description of expected improvements is required."),
  consequences: z.string().min(10, "A description of consequences is required."),
  
  employeeComments: z.string().optional(),
  
  employeeSignature: z.string().optional(),
  managerSignature: z.string().optional(),
});

type DisciplinaryActionLogFormValues = z.infer<typeof disciplinaryActionLogSchema>;

export function DisciplinaryActionLogForm() {
  const { toast } = useToast();

  const form = useForm<DisciplinaryActionLogFormValues>({
    resolver: zodResolver(disciplinaryActionLogSchema),
    defaultValues: {},
    mode: 'onChange',
  });

  const handlePrint = () => window.print();

  const onSubmit = (data: DisciplinaryActionLogFormValues) => {
    console.log(data);
    toast({
      title: 'Log Saved',
      description: 'The disciplinary action has been documented.',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between no-print">
          <div>
            <h1 className="text-2xl font-headline font-bold">Disciplinary Action Log</h1>
            <p className="text-muted-foreground">Document coaching or corrective actions.</p>
          </div>
          <Button type="button" variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print / Download
          </Button>
        </div>

        <Card className="printable-card">
          <CardHeader>
            <CardTitle>Record Details</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField control={form.control} name="employeeName" render={({ field }) => (
                <FormItem><FormLabel>Employee Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            <FormField control={form.control} name="dateOfDiscussion" render={({ field }) => (
                <FormItem className="flex flex-col"><FormLabel>Date of Discussion</FormLabel>
                   <Popover><PopoverTrigger asChild><FormControl>
                        <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover>
                <FormMessage /></FormItem>
              )} />
             <FormField control={form.control} name="managerName" render={({ field }) => (
                <FormItem><FormLabel>Manager/Supervisor Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
          </CardContent>
        </Card>

        <Card className="printable-card">
          <CardHeader>
            <CardTitle>Action Details</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            <FormField control={form.control} name="actionType" render={({ field }) => (
                <FormItem><FormLabel>Type of Action</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select an action type" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="verbal_warning">Verbal Warning</SelectItem>
                      <SelectItem value="written_warning">Written Warning</SelectItem>
                      <SelectItem value="coaching">Coaching Session</SelectItem>
                      <SelectItem value="performance_improvement_plan">Performance Improvement Plan (PIP)</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                <FormMessage /></FormItem>
              )} />
            <FormField control={form.control} name="incidentDescription" render={({ field }) => (
                <FormItem><FormLabel>Description of Performance Issue or Incident</FormLabel><FormControl><Textarea className="min-h-[120px]" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="expectedImprovement" render={({ field }) => (
                <FormItem><FormLabel>Expected Improvement or Change in Behavior</FormLabel><FormControl><Textarea className="min-h-[120px]" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="consequences" render={({ field }) => (
                <FormItem><FormLabel>Consequences of Not Meeting Expectations</FormLabel><FormControl><Textarea className="min-h-[120px]" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
          </CardContent>
        </Card>

        <Card className="printable-card">
          <CardHeader>
            <CardTitle>Employee Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField control={form.control} name="employeeComments" render={({ field }) => (
                <FormItem><FormLabel>Employee's comments on the issue (optional).</FormLabel><FormControl><Textarea className="min-h-[120px]" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
          </CardContent>
        </Card>

        <Card className="printable-card">
          <CardHeader>
            <CardTitle>Signatures</CardTitle>
            <CardDescription>Signatures acknowledge that this discussion took place, not necessarily agreement with the content.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8">
            <div className='space-y-2'>
              <FormLabel>Employee Signature</FormLabel>
               <FormField control={form.control} name="employeeSignature" render={({ field }) => (
                    <SignaturePad onEnd={field.onChange} penColor='white' />
                )} />
            </div>
            <div className='space-y-2'>
              <FormLabel>Manager/Supervisor Signature</FormLabel>
               <FormField control={form.control} name="managerSignature" render={({ field }) => (
                    <SignaturePad onEnd={field.onChange} penColor='white' />
                )} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end no-print">
          <Button type="submit" size="lg">Save Log Entry</Button>
        </div>
      </form>
    </Form>
  );
}
