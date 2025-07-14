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
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SignaturePad } from '@/components/ui/signature-pad';
import {
  Printer,
  Wand2,
  Loader2,
  PlusCircle,
  Trash2,
} from 'lucide-react';
import { useState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
// Assuming autofill action exists and is relevant
// import { autofillFormAction } from '@/actions/autofill';

const dutyStatusEntrySchema = z.object({
  timeFrom: z.string().min(1, 'Start time is required.'),
  timeTo: z.string().min(1, 'End time is required.'),
  status: z.enum(['off-duty', 'sleeper', 'driving', 'on-duty']),
  remarks: z.string().optional(),
});

const driversDailyLogSchema = z.object({
  driverName: z.string().min(1, 'Driver name is required.'),
  employeeId: z.string().min(1, 'Employee ID is required.'),
  coDriverName: z.string().optional(),
  date: z.date({ required_error: 'Date is required.' }),
  truckNumber: z.string().min(1, 'Truck number is required.'),
  trailerNumber: z.string().optional(),
  totalMiles: z.coerce.number().min(0, 'Total miles cannot be negative.'),
  carrierName: z.string().min(1, 'Carrier name is required.'),
  carrierAddress: z.string().min(1, 'Carrier address is required.'),
  dutyStatusEntries: z.array(dutyStatusEntrySchema).min(1, 'At least one duty status entry is required.'),
  driverSignature: z.string().optional(),
});

type DriversDailyLogFormValues = z.infer<typeof driversDailyLogSchema>;

const defaultValues: Partial<DriversDailyLogFormValues> = {
  dutyStatusEntries: [
    { timeFrom: '00:00', timeTo: '06:00', status: 'off-duty', remarks: '' },
  ],
  totalMiles: 0,
};

export function DriversDailyLogForm() {
  const { toast } = useToast();
  const [isAiPending, startAiTransition] = useTransition();

  const form = useForm<DriversDailyLogFormValues>({
    resolver: zodResolver(driversDailyLogSchema),
    defaultValues,
    mode: 'onChange',
  });
  
  const { fields, append, remove } = useFieldArray({
    name: 'dutyStatusEntries',
    control: form.control,
  });

  const handlePrint = () => {
    window.print();
  };

  const handleAiAutofill = () => {
    // startAiTransition(async () => {
    //   // AI Autofill Logic here
    // });
    toast({
        title: 'AI Autofill',
        description: 'This feature is not yet implemented for this form.',
    });
  };

  const onSubmit = (data: DriversDailyLogFormValues) => {
    console.log(data);
    toast({
      title: 'Form Submitted!',
      description: 'Your Daily Log has been saved.',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between no-print">
          <div>
            <h1 className="text-2xl font-headline font-bold">Driver's Daily Log (HOS)</h1>
            <p className="text-muted-foreground">
              Complete the form to record your hours of service.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleAiAutofill}
              disabled={isAiPending}
            >
              {isAiPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              AI Autofill
            </Button>
            <Button type="button" variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print / Download
            </Button>
          </div>
        </div>

        <Card className="printable-card">
          <CardHeader>
            <CardTitle>Driver & Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="driverName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Driver Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee ID</FormLabel>
                  <FormControl>
                    <Input placeholder="EMP12345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="coDriverName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Co-Driver Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Jane Smith" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                    )}
                                >
                                    {field.value ? (
                                        format(field.value, "PPP")
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                    date > new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="truckNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Truck Number</FormLabel>
                  <FormControl>
                    <Input placeholder="T-789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="trailerNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trailer(s) Number</FormLabel>
                  <FormControl>
                    <Input placeholder="TR-1011" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="totalMiles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Miles Driven Today</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="350" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className="printable-card">
          <CardHeader>
            <CardTitle>Duty Status Log</CardTitle>
            <CardDescription>Record your activities for the 24-hour period.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">From (Time)</TableHead>
                  <TableHead className="w-[120px]">To (Time)</TableHead>
                  <TableHead className="w-[200px]">Status</TableHead>
                  <TableHead>Remarks (Location, etc.)</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => (
                    <TableRow key={field.id}>
                        <TableCell>
                            <FormField
                                control={form.control}
                                name={`dutyStatusEntries.${index}.timeFrom`}
                                render={({ field }) => <Input type="time" {...field} />}
                            />
                        </TableCell>
                        <TableCell>
                            <FormField
                                control={form.control}
                                name={`dutyStatusEntries.${index}.timeTo`}
                                render={({ field }) => <Input type="time" {...field} />}
                            />
                        </TableCell>
                        <TableCell>
                            <FormField
                                control={form.control}
                                name={`dutyStatusEntries.${index}.status`}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="off-duty">Off Duty</SelectItem>
                                            <SelectItem value="sleeper">Sleeper Berth</SelectItem>
                                            <SelectItem value="driving">Driving</SelectItem>
                                            <SelectItem value="on-duty">On Duty (Not Driving)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </TableCell>
                        <TableCell>
                            <FormField
                                control={form.control}
                                name={`dutyStatusEntries.${index}.remarks`}
                                render={({ field }) => <Input placeholder="e.g., Pre-trip inspection at yard" {...field} />}
                            />
                        </TableCell>
                        <TableCell>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => remove(index)}
                                disabled={fields.length <= 1}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
             <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => append({ timeFrom: '', timeTo: '', status: 'off-duty', remarks: '' })}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Duty Status
            </Button>
          </CardContent>
        </Card>

        <Card className="printable-card">
          <CardHeader>
            <CardTitle>Carrier Information & Signature</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <FormField
                control={form.control}
                name="carrierName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Carrier Name</FormLabel>
                    <FormControl>
                        <Input placeholder="Logistics Inc." {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="carrierAddress"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Carrier Main Office Address</FormLabel>
                    <FormControl>
                        <Input placeholder="123 Supply Chain Rd, Industry, CA" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <Separator />
            <div className="space-y-2">
                <FormLabel>Driver's Signature</FormLabel>
                <FormField
                    control={form.control}
                    name="driverSignature"
                    render={({ field }) => (
                         <div className="flex flex-col items-center md:items-start">
                            <SignaturePad onEnd={field.onChange} penColor='white' width={400} height={150} />
                            <FormDescription>
                                I certify that these entries are true and correct.
                            </FormDescription>
                         </div>
                    )}
                />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end no-print">
          <Button type="submit" size="lg">
            Submit Log
          </Button>
        </div>
      </form>
    </Form>
  );
}
