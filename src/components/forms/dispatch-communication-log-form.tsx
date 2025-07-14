
// src/components/forms/dispatch-communication-log-form.tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Printer, CalendarIcon, PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const communicationEntrySchema = z.object({
  time: z.string().min(1, 'Time is required.'),
  driverName: z.string().min(1, 'Driver name is required.'),
  truckUnit: z.string().min(1, 'Truck unit is required.'),
  communicationType: z.enum(['phone', 'text', 'qualcomm', 'email', 'in_person']),
  subject: z.string().min(1, 'Subject is required.'),
  details: z.string().min(1, 'Details are required.'),
});

const dispatchCommunicationLogSchema = z.object({
  dispatcherName: z.string().min(1, 'Dispatcher name is required.'),
  logDate: z.date({ required_error: 'Date is required.' }),
  logEntries: z.array(communicationEntrySchema),
});

type DispatchCommunicationLogFormValues = z.infer<typeof dispatchCommunicationLogSchema>;

export function DispatchCommunicationLogForm() {
  const { toast } = useToast();

  const form = useForm<DispatchCommunicationLogFormValues>({
    resolver: zodResolver(dispatchCommunicationLogSchema),
    defaultValues: {
      logEntries: [],
      logDate: new Date(),
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    name: 'logEntries',
    control: form.control,
  });

  const handlePrint = () => window.print();

  const onSubmit = (data: DispatchCommunicationLogFormValues) => {
    console.log(data);
    toast({
      title: 'Log Saved',
      description: 'The communication log has been saved.',
    });
  };
  
  const addDefaultEntry = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    append({
        time: `${hours}:${minutes}`,
        driverName: '',
        truckUnit: '',
        communicationType: 'phone',
        subject: '',
        details: '',
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between no-print">
          <div>
            <h1 className="text-2xl font-headline font-bold">Dispatch Communication Log</h1>
            <p className="text-muted-foreground">Track all communications with drivers and other parties.</p>
          </div>
          <Button type="button" variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print / Download
          </Button>
        </div>

        <Card className="printable-card">
          <CardHeader>
            <CardTitle>Log Details</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <FormField control={form.control} name="dispatcherName" render={({ field }) => (
                <FormItem><FormLabel>Dispatcher Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            <FormField control={form.control} name="logDate" render={({ field }) => (
                <FormItem className="flex flex-col"><FormLabel>Date of Log</FormLabel>
                   <Popover><PopoverTrigger asChild><FormControl>
                        <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover>
                <FormMessage /></FormItem>
              )} />
          </CardContent>
        </Card>
        
        <Card className="printable-card">
            <CardHeader>
                <CardTitle>Communication Entries</CardTitle>
                <CardDescription>Log each individual communication event.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Time</TableHead>
                                <TableHead>Driver</TableHead>
                                <TableHead>Unit #</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Details</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fields.map((field, index) => (
                                <TableRow key={field.id}>
                                    <TableCell><FormField control={form.control} name={`logEntries.${index}.time`} render={({ field }) => <Input type="time" {...field} /> } /></TableCell>
                                    <TableCell><FormField control={form.control} name={`logEntries.${index}.driverName`} render={({ field }) => <Input {...field} /> } /></TableCell>
                                    <TableCell><FormField control={form.control} name={`logEntries.${index}.truckUnit`} render={({ field }) => <Input {...field} /> } /></TableCell>
                                    <TableCell><FormField control={form.control} name={`logEntries.${index}.communicationType`} render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="phone">Phone Call</SelectItem>
                                                <SelectItem value="text">Text Message</SelectItem>
                                                <SelectItem value="qualcomm">Qualcomm/ELD</SelectItem>
                                                <SelectItem value="email">Email</SelectItem>
                                                <SelectItem value="in_person">In Person</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )} /></TableCell>
                                    <TableCell><FormField control={form.control} name={`logEntries.${index}.subject`} render={({ field }) => <Input {...field} /> } /></TableCell>
                                    <TableCell><FormField control={form.control} name={`logEntries.${index}.details`} render={({ field }) => <Textarea {...field} /> } /></TableCell>
                                    <TableCell><Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                 <Button type="button" variant="outline" size="sm" className="mt-4" onClick={addDefaultEntry}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Log Entry
                </Button>
            </CardContent>
        </Card>

        <div className="flex justify-end no-print">
          <Button type="submit" size="lg">Save Log</Button>
        </div>
      </form>
    </Form>
  );
}
