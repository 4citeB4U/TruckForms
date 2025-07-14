// src/components/forms/maintenance-repair-log-form.tsx
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
import { Printer, CalendarIcon, PlusCircle, Trash2, Upload } from 'lucide-react';
import { useState, useTransition, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const logEntrySchema = z.object({
  date: z.date({ required_error: 'Date is required.' }),
  odometer: z.coerce.number().positive('Odometer reading is required.'),
  description: z.string().min(1, 'Description is required.'),
  workType: z.enum(['maintenance', 'repair', 'inspection']),
  performedBy: z.string().min(1, 'This field is required.'),
  cost: z.coerce.number().min(0, 'Cost must be zero or more.'),
  receiptUrl: z.string().optional(),
});

const maintenanceRepairLogSchema = z.object({
  truckOrUnitNumber: z.string().min(1, 'Unit number is required.'),
  vin: z.string().optional(),
  logEntries: z.array(logEntrySchema).min(1, 'At least one log entry is required.'),
});

type MaintenanceRepairLogFormValues = z.infer<typeof maintenanceRepairLogSchema>;

const defaultValues: Partial<MaintenanceRepairLogFormValues> = {
  logEntries: [],
};

export function MaintenanceRepairLogForm() {
  const { toast } = useToast();
  const [totalCost, setTotalCost] = useState(0);

  const form = useForm<MaintenanceRepairLogFormValues>({
    resolver: zodResolver(maintenanceRepairLogSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    name: 'logEntries',
    control: form.control,
  });

  const watchedLogEntries = form.watch('logEntries');

  useEffect(() => {
    const newTotal = watchedLogEntries.reduce((sum, item) => sum + (item.cost || 0), 0);
    setTotalCost(newTotal);
  }, [watchedLogEntries]);

  const handlePrint = () => window.print();

  const onSubmit = (data: MaintenanceRepairLogFormValues) => {
    console.log(data);
    toast({
      title: 'Log Submitted!',
      description: 'Your Maintenance & Repair Log has been saved.',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between no-print">
          <div>
            <h1 className="text-2xl font-headline font-bold">Maintenance & Repair Log</h1>
            <p className="text-muted-foreground">Track all vehicle maintenance and repairs.</p>
          </div>
          <Button type="button" variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print / Download
          </Button>
        </div>

        <Card className="printable-card">
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="truckOrUnitNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Truck/Unit #</FormLabel>
                  <FormControl><Input placeholder="T-567" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>VIN (Optional)</FormLabel>
                  <FormControl><Input placeholder="1A2B3C..." {...field} /></FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className="printable-card">
          <CardHeader>
            <CardTitle>Log Entries</CardTitle>
            <CardDescription>Add each maintenance or repair event.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Date</TableHead>
                  <TableHead className="min-w-[120px]">Odometer</TableHead>
                  <TableHead className="min-w-[150px]">Type</TableHead>
                  <TableHead className="min-w-[250px]">Description of Work</TableHead>
                  <TableHead className="min-w-[150px]">Performed By</TableHead>
                  <TableHead className="min-w-[120px] text-right">Cost ($)</TableHead>
                  <TableHead className="min-w-[120px]">Receipt</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow key={field.id}>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`logEntries.${index}.date`}
                        render={({ field }) => (
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant={'outline'} size="sm" className={cn('w-full justify-start text-left font-normal', !field.value && 'text-muted-foreground')}>
                                  <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                                  {field.value ? format(field.value, 'P') : <span>Pick date</span>}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent>
                          </Popover>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField control={form.control} name={`logEntries.${index}.odometer`} render={({ field }) => <Input type="number" {...field} />} />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`logEntries.${index}.workType`}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="maintenance">Maintenance</SelectItem>
                              <SelectItem value="repair">Repair</SelectItem>
                              <SelectItem value="inspection">Inspection</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField control={form.control} name={`logEntries.${index}.description`} render={({ field }) => <Textarea placeholder="e.g., Oil change, replaced tires" {...field} />} />
                    </TableCell>
                    <TableCell>
                      <FormField control={form.control} name={`logEntries.${index}.performedBy`} render={({ field }) => <Input placeholder="e.g., Company Shop, TA" {...field} />} />
                    </TableCell>
                    <TableCell>
                      <FormField control={form.control} name={`logEntries.${index}.cost`} render={({ field }) => <Input type="number" className="text-right" {...field} />} />
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
                  <TableCell colSpan={5} className="text-right font-bold">Total Cost</TableCell>
                  <TableCell className="text-right font-bold">${totalCost.toFixed(2)}</TableCell>
                  <TableCell colSpan={2}></TableCell>
                </TableRow>
              </TableFooter>
            </Table>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => append({ date: new Date(), odometer: 0, description: '', workType: 'maintenance', performedBy: '', cost: 0 })}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Log Entry
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end no-print">
          <Button type="submit" size="lg">Submit Log</Button>
        </div>
      </form>
    </Form>
  );
}
