'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { SignaturePad } from '@/components/ui/signature-pad';
import {
  PlusCircle,
  Trash2,
  Printer,
  Wand2,
  Loader2,
} from 'lucide-react';
import { useState, useTransition } from 'react';
import { autofillFormAction } from '@/actions/autofill';
import { useToast } from '@/hooks/use-toast';

const lineItemSchema = z.object({
  quantity: z.coerce.number().min(1, 'Quantity is required.'),
  itemType: z.string().min(1, 'Item type is required.'),
  description: z.string().min(1, 'Description is required.'),
  weight: z.coerce.number().min(1, 'Weight is required.'),
  isHazmat: z.boolean().default(false),
  unNumber: z.string().optional(),
});

const billOfLadingSchema = z.object({
  shipperName: z.string().min(1, 'Shipper name is required.'),
  shipperAddress: z.string().min(1, 'Shipper address is required.'),
  shipperCity: z.string().min(1, 'City is required.'),
  shipperState: z.string().min(1, 'State is required.'),
  shipperZip: z.string().min(1, 'ZIP code is required.'),
  consigneeName: z.string().min(1, 'Consignee name is required.'),
  consigneeAddress: z.string().min(1, 'Consignee address is required.'),
  consigneeCity: z.string().min(1, 'City is required.'),
  consigneeState: z.string().min(1, 'State is required.'),
  consigneeZip: z.string().min(1, 'ZIP code is required.'),
  specialInstructions: z.string().optional(),
  lineItems: z.array(lineItemSchema).min(1, 'At least one line item is required.'),
  shipperSignature: z.string().optional(),
  carrierSignature: z.string().optional(),
});

type BillOfLadingFormValues = z.infer<typeof billOfLadingSchema>;

const defaultValues: Partial<BillOfLadingFormValues> = {
  lineItems: [{ quantity: 1, itemType: 'Pallet', description: '', weight: 0, isHazmat: false }],
};

export function BillOfLadingForm() {
  const { toast } = useToast();
  const [isAiPending, startAiTransition] = useTransition();

  const form = useForm<BillOfLadingFormValues>({
    resolver: zodResolver(billOfLadingSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    name: 'lineItems',
    control: form.control,
  });

  const handlePrint = () => {
    window.print();
  };

  const handleAiAutofill = () => {
    startAiTransition(async () => {
      const { success, data, error } = await autofillFormAction(
        billOfLadingSchema,
        JSON.stringify(form.getValues())
      );
      if (success && data) {
        // Zod validation on AI response before resetting form
        const parsedData = billOfLadingSchema.safeParse(data);
        if (parsedData.success) {
          form.reset(parsedData.data);
          toast({
            title: 'Success',
            description: 'Form has been autofilled with AI.',
          });
        } else {
          console.error("AI returned invalid data:", parsedData.error);
          toast({
            variant: 'destructive',
            title: 'AI Error',
            description: 'AI returned data in an unexpected format.',
          });
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error,
        });
      }
    });
  };

  const onSubmit = (data: BillOfLadingFormValues) => {
    console.log(data);
    toast({
      title: 'Form Submitted!',
      description: 'Your Bill of Lading has been saved.',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between no-print">
          <div>
            <h1 className="text-2xl font-headline font-bold">Bill of Lading</h1>
            <p className="text-muted-foreground">
              Complete the form below to generate a new BOL.
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

        <div className="grid md:grid-cols-2 gap-8 printable-card">
          <Card className="printable-card">
            <CardHeader>
              <CardTitle>Shipper</CardTitle>
              <CardDescription>
                The party sending the shipment.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="shipperName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Acme Corporation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shipperAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Industrial Way" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="shipperCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shipperState"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shipperZip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZIP</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          <Card className="printable-card">
            <CardHeader>
              <CardTitle>Consignee</CardTitle>
              <CardDescription>The party receiving the shipment.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="consigneeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Global Exports Inc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="consigneeAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="456 Commerce Blvd" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="consigneeCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="consigneeState"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="consigneeZip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZIP</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="printable-card">
          <CardHeader>
            <CardTitle>Freight Details</CardTitle>
            <CardDescription>
              List all items included in the shipment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Quantity</TableHead>
                  <TableHead className="w-[150px]">Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[100px]">Weight</TableHead>
                  <TableHead className="w-[200px]">Hazardous Material</TableHead>
                  <TableHead className="text-right w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow key={field.id}>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`lineItems.${index}.quantity`}
                        render={({ field }) => <Input type="number" {...field} />}
                      />
                    </TableCell>
                    <TableCell>
                       <FormField
                        control={form.control}
                        name={`lineItems.${index}.itemType`}
                        render={({ field }) => <Input {...field} />}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`lineItems.${index}.description`}
                        render={({ field }) => <Input {...field} />}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`lineItems.${index}.weight`}
                        render={({ field }) => <Input type="number" {...field} />}
                      />
                    </TableCell>
                    <TableCell className="space-y-2">
                       <FormField
                        control={form.control}
                        name={`lineItems.${index}.isHazmat`}
                        render={({ field }) => (
                            <FormItem className='flex items-center gap-2 space-y-0'>
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <FormLabel className='text-sm font-normal'>Is Hazmat?</FormLabel>
                            </FormItem>
                        )}
                        />
                         {form.watch(`lineItems.${index}.isHazmat`) && (
                            <FormField
                                control={form.control}
                                name={`lineItems.${index}.unNumber`}
                                render={({ field }) => (
                                   <Input placeholder="UN Number" {...field} />
                                )}
                            />
                        )}
                    </TableCell>
                    <TableCell className="text-right">
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
              onClick={() => append({ quantity: 1, itemType: 'Pallet', description: '', weight: 0, isHazmat: false })}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </CardContent>
        </Card>

        <Card className="printable-card">
          <CardHeader>
            <CardTitle>Special Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="specialInstructions"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Forklift required, call upon arrival..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className="printable-card">
          <CardHeader>
            <CardTitle>Signatures</CardTitle>
            <CardDescription>
              This is to certify that the above named materials are properly classified, described, packaged, marked and labeled, and are in proper condition for transportation according to the applicable regulations of the Department of Transportation.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8">
            <div className='space-y-2'>
              <FormLabel>Shipper Signature</FormLabel>
               <FormField
                control={form.control}
                name="shipperSignature"
                render={({ field }) => (
                    <SignaturePad onEnd={field.onChange} penColor='white' width={400} height={150} />
                )}
                />
            </div>
            <div className='space-y-2'>
              <FormLabel>Carrier Signature</FormLabel>
               <FormField
                control={form.control}
                name="carrierSignature"
                render={({ field }) => (
                     <SignaturePad onEnd={field.onChange} penColor='white' width={400} height={150} />
                )}
                />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end no-print">
            <Button type="submit" size="lg">Submit Form</Button>
        </div>
      </form>
    </Form>
  );
}
