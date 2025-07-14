// src/components/forms/business-license-permits-form.tsx
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
import { Printer, CalendarIcon, PlusCircle, Trash2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';

const permitSchema = z.object({
    permitType: z.string().min(1, 'Permit type is required.'),
    permitNumber: z.string().min(1, 'Permit number is required.'),
    issuingAuthority: z.string().min(1, 'Issuing authority is required.'),
    issueDate: z.date({ required_error: 'Issue date is required.' }),
    expirationDate: z.date({ required_error: 'Expiration date is required.' }),
    documentUrl: z.string().optional(),
});

const businessLicensePermitsSchema = z.object({
  companyName: z.string().min(1, 'Company name is required.'),
  usdotNumber: z.string().optional(),
  mcNumber: z.string().optional(),
  permits: z.array(permitSchema),
  notes: z.string().optional(),
});

type BusinessLicensePermitsFormValues = z.infer<typeof businessLicensePermitsSchema>;

export function BusinessLicensePermitsForm() {
  const { toast } = useToast();

  const form = useForm<BusinessLicensePermitsFormValues>({
    resolver: zodResolver(businessLicensePermitsSchema),
    defaultValues: {
      permits: [],
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    name: 'permits',
    control: form.control,
  });

  const handlePrint = () => window.print();

  const onSubmit = (data: BusinessLicensePermitsFormValues) => {
    console.log(data);
    toast({
      title: 'Form Submitted!',
      description: 'Business License & Permits information has been saved.',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between no-print">
          <div>
            <h1 className="text-2xl font-headline font-bold">Business Licenses & Permits</h1>
            <p className="text-muted-foreground">Manage all business licenses and permits.</p>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print / Download
            </Button>
          </div>
        </div>

        <Card className="printable-card">
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6">
            <FormField control={form.control} name="companyName" render={({ field }) => (
                <FormItem><FormLabel>Company Name</FormLabel><FormControl><Input placeholder="Your Company LLC" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            <FormField control={form.control} name="usdotNumber" render={({ field }) => (
                <FormItem><FormLabel>USDOT Number</FormLabel><FormControl><Input placeholder="1234567" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            <FormField control={form.control} name="mcNumber" render={({ field }) => (
                <FormItem><FormLabel>MC Number</FormLabel><FormControl><Input placeholder="MC-123456" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
          </CardContent>
        </Card>

        <Card className="printable-card">
          <CardHeader>
            <CardTitle>Licenses & Permits</CardTitle>
            <CardDescription>Add each license or permit held by the company.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded-md relative space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Permit / License {index + 1}</h3>
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
                <Separator />
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FormField control={form.control} name={`permits.${index}.permitType`} render={({ field }) => (
                        <FormItem><FormLabel>Type</FormLabel><FormControl><Input placeholder="e.g., IFTA, UCR" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name={`permits.${index}.permitNumber`} render={({ field }) => (
                        <FormItem><FormLabel>Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name={`permits.${index}.issuingAuthority`} render={({ field }) => (
                        <FormItem><FormLabel>Issuing Authority</FormLabel><FormControl><Input placeholder="e.g., State of CA, FMCSA" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name={`permits.${index}.issueDate`} render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>Issue Date</FormLabel>
                           <Popover><PopoverTrigger asChild><FormControl>
                                <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover>
                        <FormMessage /></FormItem>
                      )} />
                    <FormField control={form.control} name={`permits.${index}.expirationDate`} render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>Expiration Date</FormLabel>
                           <Popover><PopoverTrigger asChild><FormControl>
                                <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover>
                        <FormMessage /></FormItem>
                      )} />
                      <FormItem className='flex flex-col justify-end'>
                         <Button type="button" variant="outline"><Upload className="h-4 w-4 mr-2" /> Upload Document</Button>
                      </FormItem>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => append({ permitType: '', permitNumber: '', issuingAuthority: '', issueDate: new Date(), expirationDate: new Date() })}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add License/Permit
            </Button>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
            <CardContent>
                 <FormField control={form.control} name="notes" render={({ field }) => (
                    <FormItem><FormLabel>Additional Notes</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>
                 )}/>
            </CardContent>
        </Card>

        <div className="flex justify-end no-print">
          <Button type="submit" size="lg">Save Information</Button>
        </div>
      </form>
    </Form>
  );
}
