// src/components/forms/expense-report-form.tsx
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
  CardFooter,
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
import { SignaturePad } from '@/components/ui/signature-pad';
import { Printer, Wand2, Loader2, CalendarIcon, PlusCircle, Trash2, Upload } from 'lucide-react';
import { useState, useTransition, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const expenseItemSchema = z.object({
  date: z.date({ required_error: 'Date is required.' }),
  category: z.enum(['fuel', 'maintenance', 'tolls', 'food', 'lodging', 'supplies', 'other']),
  description: z.string().min(1, 'Description is required.'),
  amount: z.coerce.number().positive('Amount must be positive.'),
  receiptUrl: z.string().optional(),
});

const expenseReportSchema = z.object({
  driverName: z.string().min(1, 'Driver name is required.'),
  reportingPeriodStart: z.date({ required_error: 'Start date is required.' }),
  reportingPeriodEnd: z.date({ required_error: 'End date is required.' }),
  expenses: z.array(expenseItemSchema).min(1, 'At least one expense is required.'),
  driverSignature: z.string().optional(),
});

type ExpenseReportFormValues = z.infer<typeof expenseReportSchema>;

const defaultValues: Partial<ExpenseReportFormValues> = {
  expenses: [],
};

export function ExpenseReportForm() {
  const { toast } = useToast();
  const [totalAmount, setTotalAmount] = useState(0);

  const form = useForm<ExpenseReportFormValues>({
    resolver: zodResolver(expenseReportSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    name: 'expenses',
    control: form.control,
  });

  const watchedExpenses = form.watch('expenses');

  useEffect(() => {
    const newTotal = watchedExpenses.reduce((sum, item) => sum + (item.amount || 0), 0);
    setTotalAmount(newTotal);
  }, [watchedExpenses]);


  const handlePrint = () => window.print();

  const onSubmit = (data: ExpenseReportFormValues) => {
    console.log(data);
    toast({
      title: 'Expense Report Submitted!',
      description: 'Your report has been saved.',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between no-print">
          <div>
            <h1 className="text-2xl font-headline font-bold">Expense Report</h1>
            <p className="text-muted-foreground">Submit your operational expenses for reimbursement or record-keeping.</p>
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
            <CardTitle>Report Details</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="driverName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Driver/Employee Name</FormLabel>
                  <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reportingPeriodStart"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Period Start Date</FormLabel>
                   <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reportingPeriodEnd"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Period End Date</FormLabel>
                   <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
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
            <CardTitle>Expenses</CardTitle>
            <CardDescription>Add each expense as a line item.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Date</TableHead>
                  <TableHead className="w-[180px]">Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[120px] text-right">Amount</TableHead>
                  <TableHead className="w-[120px]">Receipt</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow key={field.id}>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`expenses.${index}.date`}
                        render={({ field }) => (
                           <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant={"outline"} size="sm" className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                                  <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                                  {field.value ? format(field.value, "MMM d") : <span>Pick date</span>}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent>
                          </Popover>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                       <FormField
                          control={form.control}
                          name={`expenses.${index}.category`}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                              <SelectContent>
                                <SelectItem value="fuel">Fuel</SelectItem>
                                <SelectItem value="maintenance">Maintenance</SelectItem>
                                <SelectItem value="tolls">Tolls</SelectItem>
                                <SelectItem value="food">Food</SelectItem>
                                <SelectItem value="lodging">Lodging</SelectItem>
                                <SelectItem value="supplies">Supplies</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                    </TableCell>
                    <TableCell>
                      <FormField control={form.control} name={`expenses.${index}.description`} render={({ field }) => <Input placeholder="e.g. Diesel at Pilot" {...field} />} />
                    </TableCell>
                    <TableCell className="text-right">
                       <FormField control={form.control} name={`expenses.${index}.amount`} render={({ field }) => <Input type="number" className="text-right" {...field} />} />
                    </TableCell>
                     <TableCell>
                        <Button type="button" variant="outline" size="sm"><Upload className="h-4 w-4 mr-2" /> Upload</Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                    <TableCell colSpan={3} className="text-right font-bold">Total Expenses</TableCell>
                    <TableCell className="text-right font-bold">
                        ${totalAmount.toFixed(2)}
                    </TableCell>
                    <TableCell colSpan={2}></TableCell>
                </TableRow>
              </TableFooter>
            </Table>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => append({ date: new Date(), category: 'fuel', description: '', amount: 0 })}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </CardContent>
        </Card>

        <Card className="printable-card">
          <CardHeader>
            <CardTitle>Signature</CardTitle>
            <CardDescription>
              I certify that these expenses are accurate and were incurred for business purposes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              <FormLabel>Driver Signature</FormLabel>
               <FormField
                control={form.control}
                name="driverSignature"
                render={({ field }) => (
                    <SignaturePad onEnd={field.onChange} penColor='white' width={400} height={150} />
                )}
                />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end no-print">
            <Button type="submit" size="lg">Submit Report</Button>
        </div>
      </form>
    </Form>
  );
}
