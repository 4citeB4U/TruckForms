// src/components/forms/injury-illness-report-form.tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { SignaturePad } from '@/components/ui/signature-pad';
import {
  Printer,
  Wand2,
  Loader2,
  CalendarIcon
} from 'lucide-react';
import { useState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

const injuryIllnessReportSchema = z.object({
  employeeName: z.string().min(1, 'Employee name is required.'),
  jobTitle: z.string().min(1, 'Job title is required.'),
  dateOfIncident: z.date({ required_error: 'Date of incident is required.' }),
  timeOfIncident: z.string().min(1, 'Time of incident is required.'),
  locationOfIncident: z.string().min(1, 'Location of incident is required.'),
  descriptionOfIncident: z.string().min(10, 'A detailed description is required.'),
  bodyPartAffected: z.string().min(1, 'Body part affected is required.'),
  typeOfInjury: z.string().min(1, 'Type of injury is required.'),
  witnesses: z.string().optional(),
  firstAidProvided: z.boolean().default(false),
  firstAidDescription: z.string().optional(),
  medicalTreatmentSought: z.boolean().default(false),
  medicalFacilityName: z.string().optional(),
  employeeSignature: z.string().optional(),
  supervisorName: z.string().min(1, 'Supervisor name is required.'),
  supervisorSignature: z.string().optional(),
});

type InjuryIllnessReportFormValues = z.infer<typeof injuryIllnessReportSchema>;

const defaultValues: Partial<InjuryIllnessReportFormValues> = {
  firstAidProvided: false,
  medicalTreatmentSought: false,
};

export function InjuryIllnessReportForm() {
  const { toast } = useToast();
  const [isAiPending, startAiTransition] = useTransition();

  const form = useForm<InjuryIllnessReportFormValues>({
    resolver: zodResolver(injuryIllnessReportSchema),
    defaultValues,
    mode: 'onChange',
  });

  const handlePrint = () => {
    window.print();
  };

  const handleAiAutofill = () => {
    toast({
        title: 'AI Autofill',
        description: 'This feature is not yet implemented for this form.',
    });
  };

  const onSubmit = (data: InjuryIllnessReportFormValues) => {
    console.log(data);
    toast({
      title: 'Form Submitted!',
      description: 'The Injury/Illness Report has been saved.',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between no-print">
          <div>
            <h1 className="text-2xl font-headline font-bold">Injury/Illness Report</h1>
            <p className="text-muted-foreground">
              Official report for any work-related injuries or illnesses.
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
            <CardTitle>Employee & Incident Information</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="employeeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Truck Driver" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfIncident"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Incident</FormLabel>
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
                                disabled={(date) => date > new Date()}
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
              name="timeOfIncident"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time of Incident</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="locationOfIncident"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Location of Incident</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Loading dock at 123 Industrial Way" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className="printable-card">
            <CardHeader>
                <CardTitle>Description of Incident</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                 <FormField
                    control={form.control}
                    name="descriptionOfIncident"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Please describe in detail how the injury/illness occurred.</FormLabel>
                        <FormControl>
                            <Textarea
                            placeholder="Provide a step-by-step account of the events leading to the incident..."
                            className="resize-y min-h-[120px]"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                    control={form.control}
                    name="witnesses"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Witnesses (if any)</FormLabel>
                        <FormControl>
                           <Input placeholder="Name and contact information of anyone who saw the incident" {...field} />
                        </FormControl>
                        </FormItem>
                    )}
                 />
            </CardContent>
        </Card>

        <Card className="printable-card">
            <CardHeader>
                <CardTitle>Nature of Injury/Illness</CardTitle>
            </CardHeader>
             <CardContent className="grid md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="typeOfInjury"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Type of Injury/Illness</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Sprain, Cut, Burn, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="bodyPartAffected"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Body Part(s) Affected</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Left wrist, Lower back, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>
        
        <Card className="printable-card">
            <CardHeader>
                <CardTitle>Medical Treatment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <FormField
                    control={form.control}
                    name="firstAidProvided"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Was first aid provided at the scene?</FormLabel>
                            </div>
                        </FormItem>
                    )}
                />
                {form.watch('firstAidProvided') && (
                     <FormField
                        control={form.control}
                        name="firstAidDescription"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Describe the first aid that was provided.</FormLabel>
                            <FormControl>
                               <Textarea placeholder="e.g., Cleaned wound and applied bandage." {...field} />
                            </FormControl>
                            </FormItem>
                        )}
                     />
                )}
                 <FormField
                    control={form.control}
                    name="medicalTreatmentSought"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                             <div className="space-y-1 leading-none">
                                <FormLabel>Was professional medical treatment sought?</FormLabel>
                                <FormDescription> (e.g., Doctor, clinic, hospital)</FormDescription>
                            </div>
                        </FormItem>
                    )}
                />
                {form.watch('medicalTreatmentSought') && (
                     <FormField
                        control={form.control}
                        name="medicalFacilityName"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Name of Doctor or Facility</FormLabel>
                            <FormControl>
                               <Input placeholder="Dr. Smith / City General Hospital" {...field} />
                            </FormControl>
                            </FormItem>
                        )}
                     />
                )}
            </CardContent>
        </Card>


        <Card className="printable-card">
          <CardHeader>
            <CardTitle>Signatures</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8">
            <div className='space-y-2'>
              <FormLabel>Employee Signature</FormLabel>
               <FormField
                control={form.control}
                name="employeeSignature"
                render={({ field }) => (
                    <SignaturePad onEnd={field.onChange} penColor='white' width={400} height={150} />
                )}
                />
                 <FormDescription>I certify that this information is true and correct to the best of my knowledge.</FormDescription>
            </div>
            <div className='space-y-2'>
              <FormLabel>Supervisor Signature</FormLabel>
               <FormField
                control={form.control}
                name="supervisorName"
                render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground">Supervisor Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Supervisor's Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
               />
               <FormField
                control={form.control}
                name="supervisorSignature"
                render={({ field }) => (
                     <SignaturePad onEnd={field.onChange} penColor='white' width={400} height={150} />
                )}
                />
                <FormDescription>I have reviewed this report with the employee.</FormDescription>
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
