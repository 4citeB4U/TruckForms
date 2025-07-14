// src/components/forms/customer-contact-sheet-form.tsx
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
import { Textarea } from '@/components/ui/textarea';
import { Printer, PlusCircle, Trash2, Phone, Mail, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';

const contactPersonSchema = z.object({
    name: z.string().min(1, "Name is required."),
    role: z.string().min(1, "Role is required."),
    email: z.string().email("Invalid email address.").optional().or(z.literal('')),
    phone: z.string().optional(),
});

const customerContactSheetSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required.'),
  customerType: z.enum(['shipper', 'broker', 'consignee', 'other']),
  address: z.string().min(1, 'Address is required.'),
  accountNumber: z.string().optional(),
  contacts: z.array(contactPersonSchema),
  generalNotes: z.string().optional(),
});

type CustomerContactSheetFormValues = z.infer<typeof customerContactSheetSchema>;

export function CustomerContactSheetForm() {
  const { toast } = useToast();

  const form = useForm<CustomerContactSheetFormValues>({
    resolver: zodResolver(customerContactSheetSchema),
    defaultValues: {
      customerType: 'shipper',
      contacts: [{ name: '', role: 'Primary', email: '', phone: '' }],
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    name: 'contacts',
    control: form.control,
  });

  const handlePrint = () => window.print();

  const onSubmit = (data: CustomerContactSheetFormValues) => {
    console.log(data);
    toast({
      title: 'Customer Saved!',
      description: 'The contact sheet has been successfully saved.',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between no-print">
          <div>
            <h1 className="text-2xl font-headline font-bold">Customer Contact Sheet</h1>
            <p className="text-muted-foreground">Log customer contact information and notes.</p>
          </div>
          <Button type="button" variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print / Download
          </Button>
        </div>

        <Card className="printable-card">
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField control={form.control} name="customerName" render={({ field }) => (
                <FormItem><FormLabel>Customer/Company Name</FormLabel><FormControl><Input placeholder="e.g., Global Exports Inc." {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            <FormField control={form.control} name="customerType" render={({ field }) => (
                <FormItem><FormLabel>Customer Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="shipper">Shipper</SelectItem>
                      <SelectItem value="broker">Broker</SelectItem>
                      <SelectItem value="consignee">Consignee</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                <FormMessage /></FormItem>
              )} />
            <FormField control={form.control} name="accountNumber" render={({ field }) => (
                <FormItem><FormLabel>Account # (Optional)</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
            <FormField control={form.control} name="address" render={({ field }) => (
                <FormItem className="lg:col-span-3"><FormLabel>Main Address</FormLabel><FormControl><Input placeholder="456 Commerce Blvd, Otherville, USA" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
          </CardContent>
        </Card>

        <Card className="printable-card">
          <CardHeader>
            <CardTitle>Key Contacts</CardTitle>
            <CardDescription>Add all relevant contact people for this customer.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded-md relative space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Contact {index + 1}</h3>
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
                <Separator />
                <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name={`contacts.${index}.name`} render={({ field }) => (
                        <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Jane Smith" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name={`contacts.${index}.role`} render={({ field }) => (
                        <FormItem><FormLabel>Role/Title</FormLabel><FormControl><Input placeholder="e.g., Shipping Manager" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name={`contacts.${index}.email`} render={({ field }) => (
                        <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="jane.smith@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name={`contacts.${index}.phone`} render={({ field }) => (
                        <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" placeholder="555-123-4567" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', role: '', email: '', phone: '' })}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Contact
            </Button>
          </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>General Notes</CardTitle></CardHeader>
            <CardContent>
                 <FormField control={form.control} name="generalNotes" render={({ field }) => (
                    <FormItem><FormLabel>Record any important notes about this customer</FormLabel><FormControl><Textarea className="min-h-[120px]" placeholder="e.g., Preferred communication method is email. Do not call after 5 PM. Requires 24hr notice for all pickups." {...field} /></FormControl></FormItem>
                 )}/>
            </CardContent>
        </Card>
        
        <div className="flex justify-end no-print">
          <Button type="submit" size="lg">Save Customer</Button>
        </div>
      </form>
    </Form>
  );
}
