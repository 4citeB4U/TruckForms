// src/components/forms/insurance-certificate-submission-form.tsx
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
import { Printer, CalendarIcon, Upload, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import Image from 'next/image';

const insuranceCertificateSchema = z.object({
  policyHolderName: z.string().min(1, 'Policy holder name is required.'),
  insuranceCompany: z.string().min(1, 'Insurance company name is required.'),
  policyNumber: z.string().min(1, 'Policy number is required.'),
  policyType: z.enum(['auto_liability', 'cargo', 'general_liability', 'workers_comp', 'other']),
  effectiveDate: z.date({ required_error: 'Effective date is required.' }),
  expirationDate: z.date({ required_error: 'Expiration date is required.' }),
  coverageAmount: z.coerce.number().positive('Coverage amount is required.'),
  certificateImage: z.string().min(1, 'A certificate image is required.'),
});

type InsuranceCertificateFormValues = z.infer<typeof insuranceCertificateSchema>;

export function InsuranceCertificateSubmissionForm() {
  const { toast } = useToast();
  const [certPreview, setCertPreview] = useState<string | null>(null);

  const form = useForm<InsuranceCertificateFormValues>({
    resolver: zodResolver(insuranceCertificateSchema),
    mode: 'onChange',
  });
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCertPreview(result);
        form.setValue('certificateImage', result, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };


  const onSubmit = (data: InsuranceCertificateFormValues) => {
    console.log(data);
    toast({
      title: 'Certificate Submitted',
      description: 'Your Certificate of Insurance has been logged.',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between no-print">
          <div>
            <h1 className="text-2xl font-headline font-bold">Insurance Certificate Submission</h1>
            <p className="text-muted-foreground">Submit and manage certificates of insurance (COI).</p>
          </div>
          <Button type="submit" size="lg">Submit Certificate</Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
            <Card className="printable-card">
            <CardHeader><CardTitle>Policy Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <FormField control={form.control} name="policyHolderName" render={({ field }) => (<FormItem><FormLabel>Policy Holder Name</FormLabel><FormControl><Input placeholder="Your Company LLC" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="insuranceCompany" render={({ field }) => (<FormItem><FormLabel>Insurance Company</FormLabel><FormControl><Input placeholder="Allied Insurance Co." {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="policyNumber" render={({ field }) => (<FormItem><FormLabel>Policy Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="policyType" render={({ field }) => (
                    <FormItem><FormLabel>Policy Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select a policy type" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="auto_liability">Auto Liability</SelectItem>
                          <SelectItem value="cargo">Motor Truck Cargo</SelectItem>
                          <SelectItem value="general_liability">General Liability</SelectItem>
                          <SelectItem value="workers_comp">Worker's Compensation</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    <FormMessage /></FormItem>
                  )} />
                <div className='grid grid-cols-2 gap-4'>
                    <FormField control={form.control} name="effectiveDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Effective Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="expirationDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Expiration Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                </div>
                 <FormField control={form.control} name="coverageAmount" render={({ field }) => (<FormItem><FormLabel>Coverage Amount</FormLabel><FormControl><div className="relative"><DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input type="number" step="0.01" className="pl-8" placeholder='1,000,000' {...field} /></div></FormControl><FormMessage /></FormItem>)} />
            </CardContent>
            </Card>

            <Card className="printable-card">
            <CardHeader><CardTitle>Certificate Image</CardTitle><CardDescription>Upload a clear photo or PDF of the COI.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
                 <FormField
                    control={form.control}
                    name="certificateImage"
                    render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <Input type="file" accept="image/*,application/pdf" onChange={handleFileChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                {certPreview && (
                    <div className="mt-4 border rounded-md p-2 bg-muted">
                        {certPreview.startsWith('data:image') ? (
                            <Image src={certPreview} alt="Certificate Preview" width={400} height={600} className="w-full h-auto rounded-md object-contain" />
                        ) : (
                            <p className="text-sm text-center text-muted-foreground">PDF preview not available. File selected.</p>
                        )}
                    </div>
                )}
            </CardContent>
            </Card>
        </div>
      </form>
    </Form>
  );
}
