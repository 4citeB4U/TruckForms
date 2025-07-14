// src/components/forms/equipment-ownership-title-form.tsx
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
import { Printer, CalendarIcon, Upload, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Textarea } from '../ui/textarea';

const equipmentOwnershipSchema = z.object({
  equipmentType: z.enum(['truck', 'tractor', 'trailer', 'other']),
  unitNumber: z.string().min(1, 'Unit number is required.'),
  vin: z.string().length(17, 'VIN must be 17 characters.'),
  year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
  make: z.string().min(1, 'Make is required.'),
  model: z.string().min(1, 'Model is required.'),
  
  ownerName: z.string().min(1, "Owner's name is required."),
  ownerAddress: z.string().min(1, "Owner's address is required."),
  
  titleNumber: z.string().min(1, 'Title number is required.'),
  titleState: z.string().min(1, 'Title state is required.'),
  issueDate: z.date({ required_error: 'Issue date is required.' }),
  
  lienholderName: z.string().optional(),
  purchasePrice: z.coerce.number().optional(),
  purchaseDate: z.date().optional(),
  
  documentUrl: z.string().optional(),
});

type EquipmentOwnershipFormValues = z.infer<typeof equipmentOwnershipSchema>;

export function EquipmentOwnershipTitleForm() {
  const { toast } = useToast();
  const form = useForm<EquipmentOwnershipFormValues>({
    resolver: zodResolver(equipmentOwnershipSchema),
    defaultValues: { equipmentType: 'truck' },
    mode: 'onChange',
  });

  const handlePrint = () => window.print();

  const onSubmit = (data: EquipmentOwnershipFormValues) => {
    console.log(data);
    toast({
      title: 'Record Saved',
      description: 'The equipment ownership information has been saved.',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between no-print">
          <div>
            <h1 className="text-2xl font-headline font-bold">Equipment Ownership/Title</h1>
            <p className="text-muted-foreground">Manage title and ownership records for all company assets.</p>
          </div>
          <Button type="button" variant="outline" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print</Button>
        </div>

        <Card className="printable-card">
          <CardHeader><CardTitle>Equipment Details</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField control={form.control} name="unitNumber" render={({ field }) => (<FormItem><FormLabel>Unit #</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="vin" render={({ field }) => (<FormItem><FormLabel>VIN</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="year" render={({ field }) => (<FormItem><FormLabel>Year</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="make" render={({ field }) => (<FormItem><FormLabel>Make</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="model" render={({ field }) => (<FormItem><FormLabel>Model</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
          </CardContent>
        </Card>

        <Card className="printable-card">
          <CardHeader><CardTitle>Ownership Information</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <FormField control={form.control} name="ownerName" render={({ field }) => (<FormItem><FormLabel>Registered Owner Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="ownerAddress" render={({ field }) => (<FormItem><FormLabel>Owner Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="printable-card">
            <CardHeader><CardTitle>Title & Financials</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField control={form.control} name="titleNumber" render={({ field }) => (<FormItem><FormLabel>Title Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="titleState" render={({ field }) => (<FormItem><FormLabel>Title State</FormLabel><FormControl><Input placeholder="e.g., CA" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="issueDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Title Issue Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="lienholderName" render={({ field }) => (<FormItem><FormLabel>Lienholder Name (if any)</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                <FormField control={form.control} name="purchasePrice" render={({ field }) => (<FormItem><FormLabel>Purchase Price (Optional)</FormLabel><FormControl><div className="relative"><DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input type="number" className="pl-8" {...field} /></div></FormControl></FormItem>)} />
                <FormField control={form.control} name="purchaseDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Purchase Date (Optional)</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover></FormItem>)} />
            </CardContent>
        </Card>

        <Card className="printable-card">
            <CardHeader><CardTitle>Document Upload</CardTitle></CardHeader>
            <CardContent>
                <FormItem>
                    <FormLabel>Copy of Title</FormLabel>
                    <FormDescription>Upload a clear, scanned copy of the official title document.</FormDescription>
                    <Button type="button" variant="outline" className="w-full mt-2"><Upload className="h-4 w-4 mr-2" /> Upload Title Document</Button>
                </FormItem>
            </CardContent>
        </Card>
        
        <div className="flex justify-end no-print"><Button type="submit" size="lg">Save Record</Button></div>
      </form>
    </Form>
  );
}
