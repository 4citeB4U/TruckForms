// src/components/forms/cargo-damage-loss-report-form.tsx
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
import { Textarea } from '@/components/ui/textarea';
import { SignaturePad } from '@/components/ui/signature-pad';
import { Printer, CalendarIcon, PlusCircle, Trash2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table';
import { useEffect, useState } from 'react';

const damagedItemSchema = z.object({
  quantity: z.coerce.number().min(1, 'Quantity is required.'),
  description: z.string().min(1, 'Description is required.'),
  value: z.coerce.number().positive('Value must be positive.'),
});

const cargoDamageLossReportSchema = z.object({
  bolNumber: z.string().min(1, 'BOL number is required.'),
  carrierName: z.string().min(1, 'Carrier name is required.'),
  driverName: z.string().min(1, 'Driver name is required.'),
  dateOfIncident: z.date({ required_error: 'Date is required.' }),
  locationOfIncident: z.string().min(1, 'Location is required.'),
  incidentDescription: z.string().min(10, 'A detailed description is required.'),
  damagedItems: z.array(damagedItemSchema).min(1, 'At least one item is required.'),
  driverSignature: z.string().optional(),
});

type CargoDamageLossReportFormValues = z.infer<typeof cargoDamageLossReportSchema>;

export function CargoDamageLossReportForm() {
  const { toast } = useToast();
  const [totalValue, setTotalValue] = useState(0);
  const form = useForm<CargoDamageLossReportFormValues>({
    resolver: zodResolver(cargoDamageLossReportSchema),
    defaultValues: {
      damagedItems: [],
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    name: 'damagedItems',
    control: form.control,
  });

  const watchedItems = form.watch('damagedItems');

  useEffect(() => {
    const newTotal = watchedItems.reduce((sum, item) => sum + (item.value || 0), 0);
    setTotalValue(newTotal);
  }, [watchedItems]);

  const handlePrint = () => window.print();

  const onSubmit = (data: CargoDamageLossReportFormValues) => {
    console.log(data);
    toast({
      title: 'Report Submitted!',
      description: 'Your Cargo Damage/Loss Report has been saved.',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between no-print">
          <div>
            <h1 className="text-2xl font-headline font-bold">Cargo Damage/Loss Report</h1>
            <p className="text-muted-foreground">Report any damage or loss of cargo during transit.</p>
          </div>
          <Button type="button" variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print / Download
          </Button>
        </div>

        <Card className="printable-card">
          <CardHeader>
            <CardTitle>Report Details</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField control={form.control} name="bolNumber" render={({ field }) => (
                <FormItem><FormLabel>Bill of Lading (BOL) #</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            <FormField control={form.control} name="carrierName" render={({ field }) => (
                <FormItem><FormLabel>Carrier Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            <FormField control={form.control} name="driverName" render={({ field }) => (
                <FormItem><FormLabel>Driver Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            <FormField control={form.control} name="dateOfIncident" render={({ field }) => (
                <FormItem className="flex flex-col"><FormLabel>Date of Incident</FormLabel>
                  <Popover><PopoverTrigger asChild><FormControl>
                    <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover>
                  <FormMessage />
                </FormItem>
              )} />
            <FormField control={form.control} name="locationOfIncident" render={({ field }) => (
                <FormItem className="lg:col-span-2"><FormLabel>Location of Incident</FormLabel><FormControl><Input placeholder="e.g., Warehouse dock, On I-40" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
          </CardContent>
        </Card>

        <Card className="printable-card">
          <CardHeader>
            <CardTitle>Description of Damage/Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField control={form.control} name="incidentDescription" render={({ field }) => (
                <FormItem><FormLabel>Describe what happened</FormLabel><FormControl><Textarea className="min-h-[120px]" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
          </CardContent>
        </Card>

        <Card className="printable-card">
          <CardHeader>
            <CardTitle>Itemized List of Damaged/Lost Goods</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Quantity</TableHead>
                  <TableHead>Description of Item</TableHead>
                  <TableHead className="w-[150px] text-right">Value ($)</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow key={field.id}>
                    <TableCell><FormField control={form.control} name={`damagedItems.${index}.quantity`} render={({ field }) => <Input type="number" {...field} />} /></TableCell>
                    <TableCell><FormField control={form.control} name={`damagedItems.${index}.description`} render={({ field }) => <Input {...field} />} /></TableCell>
                    <TableCell className="text-right"><FormField control={form.control} name={`damagedItems.${index}.value`} render={({ field }) => <Input type="number" className="text-right" {...field} />} /></TableCell>
                    <TableCell><Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2} className="text-right font-bold">Total Value</TableCell>
                  <TableCell className="text-right font-bold">${totalValue.toFixed(2)}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableFooter>
            </Table>
            <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => append({ quantity: 1, description: '', value: 0 })}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Item
            </Button>
          </CardContent>
        </Card>

        <Card className="printable-card">
            <CardHeader><CardTitle>Documentation</CardTitle></CardHeader>
            <CardContent className='grid md:grid-cols-2 gap-8'>
                <div className="space-y-4">
                    <h3 className="font-semibold">Photo Evidence</h3>
                    <p className="text-sm text-muted-foreground">Upload photos of the damaged cargo and any relevant documents (e.g., delivery receipt with notes).</p>
                    <Button type="button" variant="outline"><Upload className="h-4 w-4 mr-2" /> Upload Files</Button>
                </div>
                <div className='space-y-2'>
                    <FormLabel>Driver Signature</FormLabel>
                    <FormDescription>I certify that the information in this report is true and correct.</FormDescription>
                    <FormField control={form.control} name="driverSignature" render={({ field }) => (
                        <SignaturePad onEnd={field.onChange} penColor='white' />
                    )} />
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
