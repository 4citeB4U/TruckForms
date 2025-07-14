// src/components/forms/medical-certificate-submission-form.tsx
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
import { Printer, CalendarIcon, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import Image from 'next/image';

const medicalCertificateSchema = z.object({
  driverName: z.string().min(1, 'Driver name is required.'),
  driversLicenseNumber: z.string().min(1, "Driver's license number is required."),
  
  medicalExaminerName: z.string().min(1, "Examiner's name is required."),
  medicalExaminerLicenseNumber: z.string().min(1, "Examiner's license number is required."),
  
  examinationDate: z.date({ required_error: 'Examination date is required.' }),
  certificateExpirationDate: z.date({ required_error: 'Expiration date is required.' }),
  
  restrictions: z.string().optional(),
  
  certificateImage: z.string().min(1, 'A certificate image is required.'),
});

type MedicalCertificateFormValues = z.infer<typeof medicalCertificateSchema>;

export function MedicalCertificateSubmissionForm() {
  const { toast } = useToast();
  const [certPreview, setCertPreview] = useState<string | null>(null);

  const form = useForm<MedicalCertificateFormValues>({
    resolver: zodResolver(medicalCertificateSchema),
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

  const onSubmit = (data: MedicalCertificateFormValues) => {
    console.log(data);
    toast({
      title: 'Certificate Submitted',
      description: 'Your medical certificate has been logged.',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between no-print">
          <div>
            <h1 className="text-2xl font-headline font-bold">Medical Certificate Submission</h1>
            <p className="text-muted-foreground">Submit your DOT medical examiner's certificate.</p>
          </div>
          <Button type="submit" size="lg">Submit Certificate</Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
            <Card className="printable-card">
                <CardHeader><CardTitle>Certificate Details</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <FormField control={form.control} name="driverName" render={({ field }) => (<FormItem><FormLabel>Driver Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="driversLicenseNumber" render={({ field }) => (<FormItem><FormLabel>Driver's License Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="medicalExaminerName" render={({ field }) => (<FormItem><FormLabel>Medical Examiner's Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="medicalExaminerLicenseNumber" render={({ field }) => (<FormItem><FormLabel>Examiner's License/Registry #</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <div className='grid grid-cols-2 gap-4'>
                        <FormField control={form.control} name="examinationDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Examination Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="certificateExpirationDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Expiration Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                    </div>
                    <FormField control={form.control} name="restrictions" render={({ field }) => (<FormItem><FormLabel>Restrictions (if any)</FormLabel><FormControl><Input placeholder="e.g., Corrective Lenses Required" {...field} /></FormControl></FormItem>)} />
                </CardContent>
            </Card>

            <Card className="printable-card">
                <CardHeader><CardTitle>Certificate Image</CardTitle><CardDescription>Upload a clear photo of your medical card.</CardDescription></CardHeader>
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
                            <Image src={certPreview} alt="Certificate Preview" width={400} height={250} className="w-full h-auto rounded-md object-contain" />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </form>
    </Form>
  );
}
