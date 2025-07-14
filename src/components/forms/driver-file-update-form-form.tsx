// src/components/forms/driver-file-update-form.tsx
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
import { Printer, CalendarIcon, PlusCircle, Trash2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const fileUpdateSchema = z.object({
  driverName: z.string().min(1, 'Driver name is required.'),
  dateOfUpdate: z.date({ required_error: 'Date of update is required.' }),
  updatedBy: z.string().min(1, 'Your name is required.'),
  updateType: z.enum(['address_change', 'contact_change', 'license_update', 'medical_update', 'other']),
  previousValue: z.string().optional(),
  newValue: z.string().min(1, "New value is required."),
  documentUrl: z.string().optional(),
  notes: z.string().optional(),
  driverSignature: z.string().optional(),
  managerSignature: z.string().optional(),
});

type DriverFileUpdateFormValues = z.infer<typeof fileUpdateSchema>;

export function DriverFileUpdateForm() {
  const { toast } = useToast();

  const form = useForm<DriverFileUpdateFormValues>({
    resolver: zodResolver(fileUpdateSchema),
    defaultValues: {
      dateOfUpdate: new Date(),
    },
    mode: 'onChange',
  });

  const handlePrint = () => window.print();

  const onSubmit = (data: DriverFileUpdateFormValues) => {
    console.log(data);
    toast({
      title: 'File Updated',
      description: 'The driver file update has been logged.',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between no-print">
          <div>
            <h1 className="text-2xl font-headline font-bold">Driver File Update Form</h1>
            <p className="text-muted-foreground">Log updates to a driver's file, such as address or license changes.</p>
          </div>
          <Button type="button" variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print / Download
          </Button>
        </div>

        <Card className="printable-card">
          <CardHeader>
            <CardTitle>Update Details</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField control={form.control} name="driverName" render={({ field }) => (
                <FormItem><FormLabel>Driver Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            <FormField control={form.control} name="dateOfUpdate" render={({ field }) => (
                <FormItem className="flex flex-col"><FormLabel>Date of Update</FormLabel>
                   <Popover><PopoverTrigger asChild><FormControl>
                        <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover>
                <FormMessage /></FormItem>
              )} />
            <FormField control={form.control} name="updatedBy" render={({ field }) => (
                <FormItem><FormLabel>Updated By (Manager)</FormLabel><FormControl><Input placeholder="Jane Smith" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
          </CardContent>
        </Card>

        <Card className="printable-card">
          <CardHeader>
            <CardTitle>Change Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField control={form.control} name="updateType" render={({ field }) => (
                <FormItem><FormLabel>Type of Update</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select an update type" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="address_change">Address Change</SelectItem>
                      <SelectItem value="contact_change">Contact Info Change</SelectItem>
                      <SelectItem value="license_update">Driver's License Update</SelectItem>
                      <SelectItem value="medical_update">Medical Certificate Update</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                <FormMessage /></FormItem>
              )} />
            <div className="grid md:grid-cols-2 gap-6">
              <FormField control={form.control} name="previousValue" render={({ field }) => (
                  <FormItem><FormLabel>Previous Value (Optional)</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )}/>
              <FormField control={form.control} name="newValue" render={({ field }) => (
                  <FormItem><FormLabel>New Value</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
            </div>
             <FormItem>
                <FormLabel>Supporting Document (Optional)</FormLabel>
                <Button type="button" variant="outline" className="w-full"><Upload className="h-4 w-4 mr-2" /> Upload Document</Button>
                <FormDescription>Upload a copy of the new license, medical card, etc.</FormDescription>
            </FormItem>
          </CardContent>
        </Card>

        <Card className="printable-card">
          <CardHeader>
            <CardTitle>Signatures</CardTitle>
            <CardDescription>Signatures acknowledge this update has been recorded accurately.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8">
            <div className='space-y-2'>
              <FormLabel>Driver Signature</FormLabel>
               <FormField control={form.control} name="driverSignature" render={({ field }) => (
                    <SignaturePad onEnd={field.onChange} penColor='white' />
                )} />
            </div>
            <div className='space-y-2'>
              <FormLabel>Manager Signature</FormLabel>
               <FormField control={form.control} name="managerSignature" render={({ field }) => (
                    <SignaturePad onEnd={field.onChange} penColor='white' />
                )} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end no-print">
          <Button type="submit" size="lg">Save Update</Button>
        </div>
      </form>
    </Form>
  );
}
