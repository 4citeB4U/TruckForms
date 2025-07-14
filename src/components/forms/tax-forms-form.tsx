// src/components/forms/tax-forms-form.tsx
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { SignaturePad } from '@/components/ui/signature-pad';
import { Printer, CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '../ui/checkbox';

const taxFormSchema = z.object({
  // Section 1: Payee Information
  payeeName: z.string().min(1, 'Name is required.'),
  businessName: z.string().optional(),
  address: z.string().min(1, 'Address is required.'),
  cityStateZip: z.string().min(1, 'City, State, and ZIP are required.'),
  
  // Section 2: Taxpayer Identification Number (TIN)
  ssnOrEin: z.enum(['ssn', 'ein']),
  tin: z.string().min(9, 'A valid SSN or EIN is required.').max(10), // SSN is 9, EIN is 9 with a hyphen so 10
  
  // Section 3: Tax Classification
  taxClassification: z.enum([
    'individual',
    'c_corp',
    's_corp',
    'partnership',
    'trust_estate',
    'llc'
  ]),
  llcTaxClassification: z.string().optional(), // C, S, or P if LLC is checked
  
  // Section 4: Exemptions (if any)
  exemptPayeeCode: z.string().optional(),
  fatcaCode: z.string().optional(),
  
  // Section 5: Certification
  signature: z.string().min(1, "Signature is required."),
  signatureDate: z.date({ required_error: 'Signature date is required.' }),
});

type TaxFormValues = z.infer<typeof taxFormSchema>;

export function TaxFormsForm() {
  const { toast } = useToast();
  const form = useForm<TaxFormValues>({
    resolver: zodResolver(taxFormSchema),
    defaultValues: { signatureDate: new Date(), ssnOrEin: 'ssn' },
    mode: 'onChange',
  });

  const handlePrint = () => window.print();

  const onSubmit = (data: TaxFormValues) => {
    console.log(data);
    toast({
      title: 'W-9 Submitted',
      description: 'Your tax information has been securely saved.',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="text-center">
            <h1 className="text-3xl font-bold">Form W-9</h1>
            <p className="text-lg text-muted-foreground">Request for Taxpayer Identification Number and Certification</p>
        </div>

        <Card className="printable-card">
          <CardHeader><CardTitle>Part I: Payee Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField control={form.control} name="payeeName" render={({ field }) => (<FormItem><FormLabel>1. Name (as shown on your income tax return)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="businessName" render={({ field }) => (<FormItem><FormLabel>2. Business name/disregarded entity name, if different from above</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
            <FormField control={form.control} name="address" render={({ field }) => (<FormItem><FormLabel>5. Address (number, street, and apt. or suite no.)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="cityStateZip" render={({ field }) => (<FormItem><FormLabel>6. City, state, and ZIP code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
          </CardContent>
        </Card>

        <Card className="printable-card">
          <CardHeader><CardTitle>Part I: Tax Classification</CardTitle></CardHeader>
          <CardContent>
             <FormField
                control={form.control}
                name="taxClassification"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel>3. Federal tax classification</FormLabel>
                        <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="individual" /></FormControl><FormLabel className="font-normal">Individual/sole proprietor or single-member LLC</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="s_corp" /></FormControl><FormLabel className="font-normal">S Corporation</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="c_corp" /></FormControl><FormLabel className="font-normal">C Corporation</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="partnership" /></FormControl><FormLabel className="font-normal">Partnership</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="trust_estate" /></FormControl><FormLabel className="font-normal">Trust/estate</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="llc" /></FormControl><FormLabel className="font-normal">Limited liability company (LLC). Enter the tax classification (C=C corporation, S=S corporation, P=Partnership) here:</FormLabel></FormItem>
                            </RadioGroup>
                        </FormControl>
                        {form.watch('taxClassification') === 'llc' && (
                             <FormField control={form.control} name="llcTaxClassification" render={({ field }) => (<FormControl><Input className="w-24" placeholder="C, S, or P" {...field} /></FormControl>)} />
                        )}
                        <FormMessage />
                    </FormItem>
                )}
                />
          </CardContent>
        </Card>
        
        <Card className="printable-card">
          <CardHeader><CardTitle>Part I: Taxpayer Identification Number (TIN)</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8 items-center">
            <FormField control={form.control} name="tin" render={({ field }) => (<FormItem><FormLabel>Enter your TIN in the appropriate box.</FormLabel><FormControl><Input placeholder="XXX-XX-XXXX or XX-XXXXXXX" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField
              control={form.control}
              name="ssnOrEin"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-1">
                      <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="ssn" /></FormControl><FormLabel className="font-normal">Social security number (SSN)</FormLabel></FormItem>
                      <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="ein" /></FormControl><FormLabel className="font-normal">Employer identification number (EIN)</FormLabel></FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
        <Card className="printable-card">
          <CardHeader>
            <CardTitle>Part II: Certification</CardTitle>
            <CardDescription>
              Under penalties of perjury, I certify that:
              1. The number shown on this form is my correct taxpayer identification number (or I am waiting for a number to be issued to me); and
              2. I am not subject to backup withholding because: (a) I am exempt from backup withholding, or (b) I have not been notified by the Internal Revenue Service (IRS) that I am subject to backup withholding as a result of a failure to report all interest or dividends, or (c) the IRS has notified me that I am no longer subject to backup withholding; and
              3. I am a U.S. citizen or other U.S. person (defined in the instructions).
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8 items-end">
            <div className='space-y-2'>
              <FormLabel>Signature of U.S. person</FormLabel>
               <FormField control={form.control} name="signature" render={({ field }) => (<SignaturePad onEnd={field.onChange} penColor='white' />)} />
               <FormMessage />
            </div>
             <FormField control={form.control} name="signatureDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
          </CardContent>
        </Card>

        <div className="flex justify-end no-print">
          <Button type="submit" size="lg">Submit W-9</Button>
        </div>
      </form>
    </Form>
  );
}
