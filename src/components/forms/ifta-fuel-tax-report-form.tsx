// src/components/forms/ifta-fuel-tax-report-form.tsx
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
  CardFooter
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table';
import { Printer, CalendarIcon, PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

const jurisdictionEntrySchema = z.object({
  jurisdiction: z.string().min(2).max(2, 'Use 2-letter code.'),
  totalMiles: z.coerce.number().positive(),
  taxableMiles: z.coerce.number().positive(),
  taxPaidGallons: z.coerce.number().positive(),
});

const iftaFuelTaxReportSchema = z.object({
  companyName: z.string().min(1, 'Company name is required.'),
  iftaAccountNumber: z.string().min(1, 'IFTA account number is required.'),
  quarter: z.enum(['Q1', 'Q2', 'Q3', 'Q4']),
  year: z.coerce.number().min(2000),
  totalFleetMiles: z.coerce.number().positive(),
  totalFuelGallons: z.coerce.number().positive(),
  jurisdictions: z.array(jurisdictionEntrySchema).min(1, 'At least one jurisdiction is required.'),
});

type IftaFuelTaxReportFormValues = z.infer<typeof iftaFuelTaxReportSchema>;

export function IftaFuelTaxReportForm() {
  const { toast } = useToast();
  const form = useForm<IftaFuelTaxReportFormValues>({
    resolver: zodResolver(iftaFuelTaxReportSchema),
    defaultValues: {
      year: new Date().getFullYear(),
      jurisdictions: [],
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'jurisdictions',
  });

  const handlePrint = () => window.print();

  const onSubmit = (data: IftaFuelTaxReportFormValues) => {
    console.log(data);
    toast({
      title: 'Report Ready',
      description: 'Your IFTA Fuel Tax Report data has been prepared.',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between no-print">
          <div>
            <h1 className="text-2xl font-headline font-bold">IFTA Fuel Tax Report</h1>
            <p className="text-muted-foreground">Prepare your quarterly International Fuel Tax Agreement report.</p>
          </div>
          <Button type="button" variant="outline" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print</Button>
        </div>

        <Card className="printable-card">
          <CardHeader><CardTitle>Report Header</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FormField control={form.control} name="companyName" render={({ field }) => (<FormItem><FormLabel>Company Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="iftaAccountNumber" render={({ field }) => (<FormItem><FormLabel>IFTA Account #</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="quarter" render={({ field }) => (<FormItem><FormLabel>Quarter</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Q1">Q1 (Jan-Mar)</SelectItem><SelectItem value="Q2">Q2 (Apr-Jun)</SelectItem><SelectItem value="Q3">Q3 (Jul-Sep)</SelectItem><SelectItem value="Q4">Q4 (Oct-Dec)</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="year" render={({ field }) => (<FormItem><FormLabel>Year</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
          </CardContent>
        </Card>

        <Card className="printable-card">
          <CardHeader><CardTitle>Fleet Summary</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <FormField control={form.control} name="totalFleetMiles" render={({ field }) => (<FormItem><FormLabel>Total Fleet Miles (All Jurisdictions)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="totalFuelGallons" render={({ field }) => (<FormItem><FormLabel>Total Fuel Gallons Purchased</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
          </CardContent>
        </Card>

        <Card className="printable-card">
            <CardHeader><CardTitle>Mileage & Fuel by Jurisdiction</CardTitle></CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead className="w-[150px]">Jurisdiction</TableHead>
                    <TableHead>Total Miles</TableHead>
                    <TableHead>Taxable Miles</TableHead>
                    <TableHead>Tax-Paid Gallons</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {fields.map((field, index) => (
                    <TableRow key={field.id}>
                    <TableCell><FormField control={form.control} name={`jurisdictions.${index}.jurisdiction`} render={({ field }) => <Input placeholder="e.g., CA" {...field} />} /></TableCell>
                    <TableCell><FormField control={form.control} name={`jurisdictions.${index}.totalMiles`} render={({ field }) => <Input type="number" {...field} />} /></TableCell>
                    <TableCell><FormField control={form.control} name={`jurisdictions.${index}.taxableMiles`} render={({ field }) => <Input type="number" {...field} />} /></TableCell>
                    <TableCell><FormField control={form.control} name={`jurisdictions.${index}.taxPaidGallons`} render={({ field }) => <Input type="number" {...field} />} /></TableCell>
                    <TableCell><Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button></TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => append({ jurisdiction: '', totalMiles: 0, taxableMiles: 0, taxPaidGallons: 0 })}><PlusCircle className="mr-2 h-4 w-4" /> Add Jurisdiction</Button>
            </CardContent>
        </Card>

        <div className="flex justify-end no-print"><Button type="submit" size="lg">Generate Report</Button></div>
      </form>
    </Form>
  );
}
