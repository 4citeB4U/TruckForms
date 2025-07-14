// src/components/forms/safety-meeting-attendance-form.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SignaturePad } from '@/components/ui/signature-pad';
import { Printer, CalendarIcon, PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const attendeeSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  signature: z.string().optional(),
});

const safetyMeetingAttendanceSchema = z.object({
  meetingDate: z.date({ required_error: 'Date is required.' }),
  topic: z.string().min(1, 'Meeting topic is required.'),
  instructor: z.string().min(1, 'Instructor name is required.'),
  notes: z.string().optional(),
  attendees: z.array(attendeeSchema).min(1, 'At least one attendee is required.'),
});

type SafetyMeetingAttendanceFormValues = z.infer<typeof safetyMeetingAttendanceSchema>;

export function SafetyMeetingAttendanceForm() {
  const { toast } = useToast();
  const form = useForm<SafetyMeetingAttendanceFormValues>({
    resolver: zodResolver(safetyMeetingAttendanceSchema),
    defaultValues: {
      meetingDate: new Date(),
      attendees: [],
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'attendees',
  });

  const handlePrint = () => window.print();

  const onSubmit = (data: SafetyMeetingAttendanceFormValues) => {
    console.log(data);
    toast({
      title: 'Attendance Sheet Saved!',
      description: 'The safety meeting record has been saved.',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between no-print">
          <div>
            <h1 className="text-2xl font-headline font-bold">Safety Meeting Attendance</h1>
            <p className="text-muted-foreground">Record attendance and topics covered in safety meetings.</p>
          </div>
          <Button type="button" variant="outline" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print</Button>
        </div>

        <Card className="printable-card">
          <CardHeader><CardTitle>Meeting Details</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6">
            <FormField control={form.control} name="meetingDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="topic" render={({ field }) => (<FormItem><FormLabel>Topic</FormLabel><FormControl><Input placeholder="e.g., Winter Driving Safety" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="instructor" render={({ field }) => (<FormItem><FormLabel>Instructor</FormLabel><FormControl><Input placeholder="Jane Smith" {...field} /></FormControl><FormMessage /></FormItem>)} />
          </CardContent>
        </Card>

        <Card className="printable-card">
            <CardHeader><CardTitle>Key Topics / Notes</CardTitle></CardHeader>
            <CardContent>
                <FormField control={form.control} name="notes" render={({ field }) => (<FormItem><FormLabel>Enter a summary of topics discussed</FormLabel><FormControl><Textarea className="min-h-[120px]" {...field} /></FormControl></FormItem>)} />
            </CardContent>
        </Card>

        <Card className="printable-card">
          <CardHeader><CardTitle>Attendee Sign-In</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Attendee Name</TableHead>
                  <TableHead>Signature</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow key={field.id}>
                    <TableCell>
                      <FormField control={form.control} name={`attendees.${index}.name`} render={({ field }) => <Input placeholder="Driver's Full Name" {...field} />} />
                    </TableCell>
                    <TableCell>
                      <FormField control={form.control} name={`attendees.${index}.signature`} render={({ field }) => <SignaturePad onEnd={field.onChange} penColor="white" height={100} />} />
                    </TableCell>
                    <TableCell>
                      <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => append({ name: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Attendee</Button>
          </CardContent>
        </Card>

        <div className="flex justify-end no-print"><Button type="submit" size="lg">Save Attendance</Button></div>
      </form>
    </Form>
  );
}
