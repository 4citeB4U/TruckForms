// src/components/forms/driver-qualification-file-form.tsx
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
import { SignaturePad } from '@/components/ui/signature-pad';
import { Printer, CalendarIcon, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const dqfItemSchema = z.object({
  name: z.string(),
  isComplete: z.boolean().default(false),
  documentDate: z.date().optional(),
  notes: z.string().optional(),
});

const driverQualificationFileSchema = z.object({
  driverName: z.string().min(1, "Driver's name is required."),
  hireDate: z.date({ required_error: 'Hire date is required.' }),
  dqfItems: z.array(dqfItemSchema),
  reviewerName: z.string().min(1, 'Reviewer name is required.'),
  reviewDate: z.date({ required_error: 'Review date is required.' }),
  reviewerSignature: z.string().optional(),
});

type DriverQualificationFileFormValues = z.infer<typeof driverQualificationFileSchema>;

const dqfChecklist = [
  'Driver Application for Employment',
  'Motor Vehicle Record (MVR)',
  'Road Test Certificate or Equivalent',
  'Medical Examiner’s Certificate (MEC)',
  'Annual Driver’s Certification of Violations',
  'Annual MVR Review',
  'Entry-Level Driver Training Certificate (if applicable)',
  'Hazardous Materials Training Certificate (if applicable)',
];

const defaultValues: Partial<DriverQualificationFileFormValues> = {
  dqfItems: dqfChecklist.map((name) => ({
    name,
    isComplete: false,
    notes: '',
  })),
};

export function DriverQualificationFileForm() {
  const { toast } = useToast();

  const form = useForm<DriverQualificationFileFormValues>({
    resolver: zodResolver(driverQualificationFileSchema),
    defaultValues,
    mode: 'onChange',
  });

  const handlePrint = () => window.print();

  const onSubmit = (data: DriverQualificationFileFormValues) => {
    console.log(data);
    toast({
      title: 'File Updated!',
      description: "The Driver Qualification File has been saved.",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between no-print">
          <div>
            <h1 className="text-2xl font-headline font-bold">Driver Qualification File (DQF)</h1>
            <p className="text-muted-foreground">Checklist for required driver documents.</p>
          </div>
          <Button type="button" variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print / Download
          </Button>
        </div>

        <Card className="printable-card">
          <CardHeader>
            <CardTitle>Driver Information</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="driverName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Driver Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hireDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Hire</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                        >
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className="printable-card">
          <CardHeader>
            <CardTitle>DQF Checklist</CardTitle>
            <CardDescription>
              Verify that each required document is present and up to date in the driver's file.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {form.watch('dqfItems').map((item, index) => (
              <div key={item.name} className="p-4 border rounded-md space-y-4">
                <FormField
                  control={form.control}
                  name={`dqfItems.${index}.isComplete`}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between">
                      <FormLabel className="text-base">{item.name}</FormLabel>
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="grid md:grid-cols-3 gap-4 items-end">
                    <FormField
                      control={form.control}
                      name={`dqfItems.${index}.documentDate`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel className="text-xs">Document Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild><FormControl>
                                <Button variant={'outline'} size="sm" className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')} >
                                    {field.value ? format(field.value, 'P') : <span>Pick a date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                                </FormControl></PopoverTrigger>
                                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent>
                            </Popover>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`dqfItems.${index}.notes`}
                      render={({ field }) => (
                         <FormItem>
                            <FormLabel className="text-xs">Notes (e.g., Expiration)</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                        </FormItem>
                      )}
                    />
                     <Button type="button" variant="outline" size="sm"><Upload className="h-4 w-4 mr-2" /> Upload Document</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="printable-card">
          <CardHeader>
            <CardTitle>Review & Signature</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                 <FormField
                    control={form.control}
                    name="reviewerName"
                    render={({ field }) => (
                        <FormItem><FormLabel>Reviewed By</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="reviewDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>Review Date</FormLabel>
                        <Popover><PopoverTrigger asChild><FormControl>
                            <Button variant={'outline'} className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl></PopoverTrigger>
                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent>
                        </Popover><FormMessage /></FormItem>
                    )}
                    />
            </div>
            <FormField
              control={form.control}
              name="reviewerSignature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reviewer's Signature</FormLabel>
                   <FormDescription>I certify that this file has been reviewed and is complete to the best of my knowledge.</FormDescription>
                  <SignaturePad onEnd={field.onChange} penColor='white' />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end no-print">
          <Button type="submit" size="lg">Save DQF</Button>
        </div>
      </form>
    </Form>
  );
}
