// src/components/forms/driver-availability-board-form.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
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
import { Textarea } from '@/components/ui/textarea';
import { Printer, CalendarIcon, PlusCircle, Trash2 } from 'lucide-react';
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
} from '@/components/ui/table';

const driverStatusSchema = z.object({
  driverName: z.string().min(1, "Driver's name is required."),
  status: z.enum(['available', 'on-duty', 'off-duty', 'pto', 'other']),
  availableFrom: z.date().optional(),
  notes: z.string().optional(),
});

const driverAvailabilityBoardSchema = z.object({
  boardDate: z.date({ required_error: 'Date is required.' }),
  drivers: z.array(driverStatusSchema),
});

type DriverAvailabilityBoardFormValues = z.infer<
  typeof driverAvailabilityBoardSchema
>;

export function DriverAvailabilityBoardForm() {
  const { toast } = useToast();

  const form = useForm<DriverAvailabilityBoardFormValues>({
    resolver: zodResolver(driverAvailabilityBoardSchema),
    defaultValues: {
      boardDate: new Date(),
      drivers: [{ driverName: '', status: 'available', notes: '' }],
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    name: 'drivers',
    control: form.control,
  });

  const handlePrint = () => window.print();

  const onSubmit = (data: DriverAvailabilityBoardFormValues) => {
    console.log(data);
    toast({
      title: 'Board Updated!',
      description: 'The driver availability board has been saved.',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between no-print">
          <div>
            <h1 className="text-2xl font-headline font-bold">Driver Availability Board</h1>
            <p className="text-muted-foreground">Track driver availability and status.</p>
          </div>
          <div className="flex items-center gap-2">
            <FormField
              control={form.control}
              name="boardDate"
              render={({ field }) => (
                <FormItem>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-[240px] pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
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
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="button" variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </div>

        <Card className="printable-card">
          <CardHeader>
            <CardTitle>Driver Status</CardTitle>
            <CardDescription>
              Update the status for each driver. Add or remove rows as needed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Driver Name</TableHead>
                  <TableHead className="w-[180px]">Status</TableHead>
                  <TableHead className="w-[180px]">Available From</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow key={field.id}>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`drivers.${index}.driverName`}
                        render={({ field }) => <Input {...field} placeholder="John Doe" />}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`drivers.${index}.status`}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="available">Available</SelectItem>
                              <SelectItem value="on-duty">On Duty</SelectItem>
                              <SelectItem value="off-duty">Off Duty</SelectItem>
                              <SelectItem value="pto">PTO/Vacation</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                       <FormField
                          control={form.control}
                          name={`drivers.${index}.availableFrom`}
                          render={({ field }) => (
                            <Popover>
                                <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                    variant={'outline'}
                                    className={cn(
                                        'w-full pl-3 text-left font-normal',
                                        !field.value && 'text-muted-foreground'
                                    )}
                                    >
                                    {field.value ? (
                                        format(field.value, 'PPP')
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
                                    initialFocus
                                />
                                </PopoverContent>
                            </Popover>
                          )}
                        />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`drivers.${index}.notes`}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="e.g., HOS reset at 10 PM"
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
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
              onClick={() => append({ driverName: '', status: 'available' })}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Driver
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end no-print">
          <Button type="submit" size="lg">
            Save Board
          </Button>
        </div>
      </form>
    </Form>
  );
}
