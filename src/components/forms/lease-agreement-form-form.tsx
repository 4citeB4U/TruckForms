// src/components/forms/lease-agreement-form.tsx
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
import { Textarea } from '@/components/ui/textarea';
import { SignaturePad } from '@/components/ui/signature-pad';
import { Printer, CalendarIcon, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

const leaseAgreementSchema = z.object({
  lessorName: z.string().min(1, 'Lessor name is required.'),
  lessorAddress: z.string().min(1, 'Lessor address is required.'),
  lesseeName: z.string().min(1, 'Lessee name is required.'),
  lesseeAddress: z.string().min(1, 'Lessee address is required.'),
  
  equipmentUnitNumber: z.string().min(1, 'Unit number is required.'),
  equipmentVin: z.string().length(17, 'VIN must be 17 characters long.'),
  equipmentDescription: z.string().min(1, 'A description is required (e.g., Year, Make, Model).'),
  
  leaseStartDate: z.date({ required_error: 'Lease start date is required.' }),
  leaseEndDate: z.date({ required_error: 'Lease end date is required.' }),
  
  paymentAmount: z.coerce.number().positive('Payment amount is required.'),
  paymentFrequency: z.enum(['weekly', 'bi-weekly', 'monthly']),
  
  responsibilities: z.string().min(10, "Maintenance responsibilities must be detailed."),
  insuranceRequirements: z.string().min(10, "Insurance requirements must be detailed."),
  
  lessorSignature: z.string().optional(),
  lesseeSignature: z.string().optional(),
  agreementDate: z.date({ required_error: 'Agreement date is required.' }),
});

type LeaseAgreementFormValues = z.infer<typeof leaseAgreementSchema>;

export function LeaseAgreementForm() {
  const { toast } = useToast();
  const form = useForm<LeaseAgreementFormValues>({
    resolver: zodResolver(leaseAgreementSchema),
    defaultValues: { paymentFrequency: 'monthly', agreementDate: new Date() },
    mode: 'onChange',
  });

  const handlePrint = () => window.print();

  const onSubmit = (data: LeaseAgreementFormValues) => {
    console.log(data);
    toast({
      title: 'Agreement Saved',
      description: 'The lease agreement has been successfully logged.',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between no-print">
          <div>
            <h1 className="text-2xl font-headline font-bold">Equipment Lease Agreement</h1>
            <p className="text-muted-foreground">Formalize the lease of equipment between two parties.</p>
          </div>
          <Button type="button" variant="outline" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print</Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
            <Card className="printable-card">
                <CardHeader><CardTitle>Lessor (Owner)</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <FormField control={form.control} name="lessorName" render={({ field }) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="lessorAddress" render={({ field }) => (<FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                </CardContent>
            </Card>
            <Card className="printable-card">
                <CardHeader><CardTitle>Lessee (Operator)</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <FormField control={form.control} name="lesseeName" render={({ field }) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="lesseeAddress" render={({ field }) => (<FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                </CardContent>
            </Card>
        </div>

        <Card className="printable-card">
            <CardHeader><CardTitle>Leased Equipment</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField control={form.control} name="equipmentUnitNumber" render={({ field }) => (<FormItem><FormLabel>Unit #</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="equipmentVin" render={({ field }) => (<FormItem><FormLabel>VIN</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="equipmentDescription" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Input placeholder='e.g., 2022 Freightliner Cascadia' {...field} /></FormControl><FormMessage /></FormItem>)} />
            </CardContent>
        </Card>

        <Card className="printable-card">
            <CardHeader><CardTitle>Lease Terms</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField control={form.control} name="leaseStartDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Start Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="leaseEndDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>End Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="paymentAmount" render={({ field }) => (<FormItem><FormLabel>Payment Amount</FormLabel><FormControl><div className="relative"><DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input type="number" step="0.01" className="pl-8" {...field} /></div></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="paymentFrequency" render={({ field }) => (<FormItem><FormLabel>Payment Frequency</FormLabel><FormControl><select {...field} className='w-full p-2 border rounded-md'><option value="weekly">Weekly</option><option value="bi-weekly">Bi-Weekly</option><option value="monthly">Monthly</option></select></FormControl><FormMessage /></FormItem>)} />
            </CardContent>
        </Card>
        
        <Card className="printable-card">
            <CardHeader><CardTitle>Responsibilities</CardTitle></CardHeader>
            <CardContent className="space-y-6">
                <FormField control={form.control} name="responsibilities" render={({ field }) => (<FormItem><FormLabel>Maintenance, Repair, and Operating Responsibilities</FormLabel><FormControl><Textarea placeholder="Detail who is responsible for maintenance, tires, repairs, fuel, etc." className="min-h-[120px]" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="insuranceRequirements" render={({ field }) => (<FormItem><FormLabel>Insurance Requirements</FormLabel><FormControl><Textarea placeholder="Detail minimum required insurance coverage (e.g., Auto Liability, Cargo, etc.) to be maintained by the Lessee." className="min-h-[120px]"{...field} /></FormControl><FormMessage /></FormItem>)} />
            </CardContent>
        </Card>

        <Card className="printable-card">
          <CardHeader><CardTitle>Signatures</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8 items-start">
            <div className='space-y-2'><FormLabel>Lessor Signature</FormLabel><FormField control={form.control} name="lessorSignature" render={({ field }) => (<SignaturePad onEnd={field.onChange} penColor='white' />)} /></div>
            <div className='space-y-2'><FormLabel>Lessee Signature</FormLabel><FormField control={form.control} name="lesseeSignature" render={({ field }) => (<SignaturePad onEnd={field.onChange} penColor='white' />)} /></div>
          </CardContent>
        </Card>

        <div className="flex justify-end no-print"><Button type="submit" size="lg">Finalize Agreement</Button></div>
      </form>
    </Form>
  );
}
