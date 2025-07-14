// src/components/forms/trainee-feedback-survey-form.tsx
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Printer, CalendarIcon, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import React from 'react';

const ratingLabels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

const traineeFeedbackSurveySchema = z.object({
  traineeName: z.string().optional(),
  trainingProgram: z.string().min(1, 'Training program name is required.'),
  completionDate: z.date({ required_error: 'Completion date is required.' }),
  
  instructorEffectiveness: z.number().min(1).max(5),
  contentRelevance: z.number().min(1).max(5),
  trainingPace: z.number().min(1).max(5),
  facilitiesAndEquipment: z.number().min(1).max(5),
  
  mostHelpfulAspect: z.string().min(1, 'This field is required.'),
  leastHelpfulAspect: z.string().min(1, 'This field is required.'),
  suggestionsForImprovement: z.string().optional(),
});

type TraineeFeedbackSurveyFormValues = z.infer<typeof traineeFeedbackSurveySchema>;

export function TraineeFeedbackSurveyForm() {
  const { toast } = useToast();
  const form = useForm<TraineeFeedbackSurveyFormValues>({
    resolver: zodResolver(traineeFeedbackSurveySchema),
    defaultValues: {
        completionDate: new Date(),
        instructorEffectiveness: 3,
        contentRelevance: 3,
        trainingPace: 3,
        facilitiesAndEquipment: 3,
    },
    mode: 'onChange',
  });

  const handlePrint = () => window.print();
  const onSubmit = (data: TraineeFeedbackSurveyFormValues) => {
    console.log(data);
    toast({
      title: 'Feedback Submitted',
      description: 'Thank you for your valuable feedback!',
    });
  };

  const RatingField = ({ name, label }: { name: keyof TraineeFeedbackSurveyFormValues, label: string }) => (
    <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
            <FormItem className="space-y-3 rounded-md border p-4">
                <FormLabel className="font-semibold">{label}</FormLabel>
                <FormControl>
                    <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                            <Button
                                key={rating}
                                type="button"
                                variant={(field.value as number) >= rating ? 'default' : 'outline'}
                                size="icon"
                                onClick={() => field.onChange(rating)}
                                className="h-8 w-8"
                            >
                                <Star className="h-4 w-4" />
                            </Button>
                        ))}
                         <span className='ml-4 text-sm text-muted-foreground'>{ratingLabels[(field.value as number) - 1]}</span>
                    </div>
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between no-print">
          <div>
            <h1 className="text-2xl font-headline font-bold">Trainee Feedback Survey</h1>
            <p className="text-muted-foreground">Provide feedback on the training program you attended.</p>
          </div>
          <Button type="button" variant="outline" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print</Button>
        </div>

        <Card className="printable-card">
          <CardHeader><CardTitle>Training Details</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField control={form.control} name="traineeName" render={({ field }) => (<FormItem><FormLabel>Your Name (Optional)</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
            <FormField control={form.control} name="trainingProgram" render={({ field }) => (<FormItem><FormLabel>Training Program Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="completionDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Completion Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
          </CardContent>
        </Card>

        <Card className="printable-card">
            <CardHeader><CardTitle>Training Evaluation</CardTitle><CardDescription>Please rate the following aspects of the training (1=Poor, 5=Excellent).</CardDescription></CardHeader>
            <CardContent className="space-y-4">
                <RatingField name="instructorEffectiveness" label="Instructor's Knowledge and Teaching" />
                <RatingField name="contentRelevance" label="Relevance of Training Content to Your Job" />
                <RatingField name="trainingPace" label="Pace and Structure of the Training" />
                <RatingField name="facilitiesAndEquipment" label="Quality of Facilities and Equipment" />
            </CardContent>
        </Card>
        
        <Card className="printable-card">
            <CardHeader><CardTitle>Open-Ended Feedback</CardTitle></CardHeader>
            <CardContent className="space-y-6">
                <FormField control={form.control} name="mostHelpfulAspect" render={({ field }) => (<FormItem><FormLabel>What was the most helpful aspect of the training?</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="leastHelpfulAspect" render={({ field }) => (<FormItem><FormLabel>What was the least helpful aspect of the training?</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="suggestionsForImprovement" render={({ field }) => (<FormItem><FormLabel>What suggestions do you have for improving this training?</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>)} />
            </CardContent>
        </Card>

        <div className="flex justify-end no-print"><Button type="submit" size="lg">Submit Survey</Button></div>
      </form>
    </Form>
  );
}