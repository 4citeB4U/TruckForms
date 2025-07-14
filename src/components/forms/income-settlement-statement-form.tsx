// src/components/forms/income-settlement-statement-form.tsx
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table';
import { SignaturePad } from '@/components/ui/signature-pad';
import { Printer, CalendarIcon, PlusCircle, Trash2, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Separator } from '../ui/separator';

const incomeItemSchema = z.object({
  date: z.date(),
  loadNumber: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  amount: z.coerce.number(),
});
const deductionItemSchema = z.object({
  date: z.date(),
  description: z.string().min(1, "Required"),
  amount: z.coerce.number(),
});

const settlementStatementSchema = z.object({
  driverName: z.string().min(1, 'Driver name is required.'),
  settlementDate: z.date({ required_error: 'Settlement date is required.' }),
  periodStartDate: z.date({ required_error: 'Start date is required.' }),
  periodEndDate: z.date({ required_error: 'End date is required.' }),
  
  incomeItems: z.array(incomeItemSchema),
  deductionItems: z.array(deductionItemSchema),
  
  driverSignature: z.string().optional(),
});

type SettlementStatementFormValues = z.infer<typeof settlementStatementSchema>;

export function IncomeSettlementStatementForm() {
  const { toast } = useToast();
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalDeductions, setTotalDeductions] = useState(0);

  const form = useForm<SettlementStatementFormValues>({
    resolver: zodResolver(settlementStatementSchema),
    defaultValues: {
      settlementDate: new Date(),
      incomeItems: [],
      deductionItems: [],
    },
    mode: 'onChange',
  });

  const { fields: incomeFields, append: appendIncome, remove: removeIncome } = useFieldArray({ control: form.control, name: 'incomeItems' });
  const { fields: deductionFields, append: appendDeduction, remove: removeDeduction } = useFieldArray({ control: form.control, name: 'deductionItems' });
  
  const watchedIncome = form.watch('incomeItems');
  const watchedDeductions = form.watch('deductionItems');

  useEffect(() => {
    setTotalIncome(watchedIncome.reduce((sum, item) => sum + (item.amount || 0), 0));
  }, [watchedIncome]);
  
  useEffect(() => {
    setTotalDeductions(watchedDeductions.reduce((sum, item) => sum + (item.amount || 0), 0));
  }, [watchedDeductions]);


  const handlePrint = () => window.print();

  const onSubmit = (data: SettlementStatementFormValues) => {
    console.log(data);
    toast({
      title: 'Statement Generated',
      description: 'The income/settlement statement has been saved.',
    });
  };
  
  const netPay = totalIncome - totalDeductions;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between no-print">
          <div>
            <h1 className="text-2xl font-headline font-bold">Income/Settlement Statement</h1>
            <p className="text-muted-foreground">Summarize loads, payments, and deductions for a pay period.</p>
          </div>
          <Button type="button" variant="outline" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print</Button>
        </div>

        <Card className="printable-card">
          <CardHeader><CardTitle>Statement Details</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FormField control={form.control} name="driverName" render={({ field }) => (<FormItem><FormLabel>Driver/Payee Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="settlementDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Settlement Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="periodStartDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Period Start</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="periodEndDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Period End</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
          </CardContent>
        </Card>

        <div className='grid lg:grid-cols-2 gap-8 items-start'>
            <Card className="printable-card">
                <CardHeader><CardTitle>Income & Reimbursements</CardTitle></CardHeader>
                <CardContent>
                    <Table><TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Load #</TableHead><TableHead>Description</TableHead><TableHead className="text-right">Amount</TableHead><TableHead className="w-[50px]"></TableHead></TableRow></TableHeader>
                    <TableBody>
                        {incomeFields.map((field, index) => (<TableRow key={field.id}><TableCell><FormField control={form.control} name={`incomeItems.${index}.date`} render={({ field }) => <Input type="date" {...field} value={field.value ? format(field.value, 'yyyy-MM-dd') : ''} onChange={e => field.onChange(new Date(e.target.value))}/>} /></TableCell><TableCell><FormField control={form.control} name={`incomeItems.${index}.loadNumber`} render={({ field }) => <Input {...field} />} /></TableCell><TableCell><FormField control={form.control} name={`incomeItems.${index}.description`} render={({ field }) => <Input {...field} />} /></TableCell><TableCell><FormField control={form.control} name={`incomeItems.${index}.amount`} render={({ field }) => <Input type="number" className="text-right" {...field} />} /></TableCell><TableCell><Button type="button" variant="ghost" size="icon" onClick={() => removeIncome(index)}><Trash2 className="h-4 w-4" /></Button></TableCell></TableRow>))}
                    </TableBody>
                    <TableFooter><TableRow><TableCell colSpan={3} className="text-right font-bold">Total Income</TableCell><TableCell className="text-right font-bold">${totalIncome.toFixed(2)}</TableCell><TableCell></TableCell></TableRow></TableFooter>
                    </Table>
                    <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => appendIncome({ date: new Date(), loadNumber: '', description: '', amount: 0 })}><PlusCircle className="mr-2 h-4 w-4" /> Add Income</Button>
                </CardContent>
            </Card>
            <Card className="printable-card">
                <CardHeader><CardTitle>Deductions</CardTitle></CardHeader>
                <CardContent>
                    <Table><TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Description</TableHead><TableHead className="text-right">Amount</TableHead><TableHead className="w-[50px]"></TableHead></TableRow></TableHeader>
                    <TableBody>
                        {deductionFields.map((field, index) => (<TableRow key={field.id}><TableCell><FormField control={form.control} name={`deductionItems.${index}.date`} render={({ field }) => <Input type="date" {...field} value={field.value ? format(field.value, 'yyyy-MM-dd') : ''} onChange={e => field.onChange(new Date(e.target.value))}/>} /></TableCell><TableCell><FormField control={form.control} name={`deductionItems.${index}.description`} render={({ field }) => <Input {...field} />} /></TableCell><TableCell><FormField control={form.control} name={`deductionItems.${index}.amount`} render={({ field }) => <Input type="number" className="text-right" {...field} />} /></TableCell><TableCell><Button type="button" variant="ghost" size="icon" onClick={() => removeDeduction(index)}><Trash2 className="h-4 w-4" /></Button></TableCell></TableRow>))}
                    </TableBody>
                    <TableFooter><TableRow><TableCell colSpan={2} className="text-right font-bold">Total Deductions</TableCell><TableCell className="text-right font-bold">${totalDeductions.toFixed(2)}</TableCell><TableCell></TableCell></TableRow></TableFooter>
                    </Table>
                    <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => appendDeduction({ date: new Date(), description: '', amount: 0 })}><PlusCircle className="mr-2 h-4 w-4" /> Add Deduction</Button>
                </CardContent>
            </Card>
        </div>

        <Card className="printable-card">
            <CardHeader><CardTitle className='text-center'>Settlement Summary</CardTitle></CardHeader>
            <CardContent className='flex justify-center'>
                 <div className='w-full max-w-md space-y-2 text-lg'>
                    <div className='flex justify-between'><span className='text-muted-foreground'>Total Income:</span><span className='font-mono'>${totalIncome.toFixed(2)}</span></div>
                    <div className='flex justify-between'><span className='text-muted-foreground'>Total Deductions:</span><span className='font-mono'>-${totalDeductions.toFixed(2)}</span></div>
                    <Separator/>
                    <div className='flex justify-between font-bold text-xl'><span >Net Pay:</span><span className='font-mono'>${netPay.toFixed(2)}</span></div>
                 </div>
            </CardContent>
            <CardFooter className="flex flex-col items-center gap-4 pt-6">
                <FormLabel>Driver Signature</FormLabel>
                <FormField control={form.control} name="driverSignature" render={({ field }) => (<SignaturePad onEnd={field.onChange} penColor='white' />)} />
                <FormDescription>I acknowledge receipt and accuracy of this settlement statement.</FormDescription>
            </CardFooter>
        </Card>

        <div className="flex justify-end no-print"><Button type="submit" size="lg">Finalize Statement</Button></div>
      </form>
    </Form>
  );
}
