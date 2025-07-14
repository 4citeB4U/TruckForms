// src/components/forms/lesson-plan-submission-form.tsx
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
import { Textarea } from '@/components/ui/textarea';
import { Printer, CalendarIcon, PlusCircle, Trash2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const learningObjectiveSchema = z.object({
    objective: z.string().min(1, "Objective cannot be empty."),
});

const lessonPlanSchema = z.object({
  lessonTitle: z.string().min(1, 'Lesson title is required.'),
  instructorName: z.string().min(1, 'Instructor name is required.'),
  subject: z.string().min(1, 'Subject is required.'),
  targetAudience: z.string().min(1, 'Target audience is required.'),
  
  learningObjectives: z.array(learningObjectiveSchema).min(1, "At least one learning objective is required."),
  
  materialsAndResources: z.string().optional(),
  lessonActivities: z.string().min(10, "Lesson activities must be described."),
  assessmentMethods: z.string().min(10, "Assessment methods must be described."),
  
  submissionDate: z.date(),
});

type LessonPlanFormValues = z.infer<typeof lessonPlanSchema>;

export function LessonPlanSubmissionForm() {
  const { toast } = useToast();
  const form = useForm<LessonPlanFormValues>({
    resolver: zodResolver(lessonPlanSchema),
    defaultValues: { 
        submissionDate: new Date(),
        learningObjectives: [{ objective: '' }]
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'learningObjectives',
  });

  const handlePrint = () => window.print();

  const onSubmit = (data: LessonPlanFormValues) => {
    console.log(data);
    toast({
      title: 'Lesson Plan Submitted',
      description: 'Your lesson plan has been saved for review.',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between no-print">
          <div>
            <h1 className="text-2xl font-headline font-bold">Lesson Plan Submission</h1>
            <p className="text-muted-foreground">Submit a new lesson plan for a training course.</p>
          </div>
          <Button type="button" variant="outline" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print</Button>
        </div>

        <Card className="printable-card">
          <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FormField control={form.control} name="lessonTitle" render={({ field }) => (<FormItem><FormLabel>Lesson Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="instructorName" render={({ field }) => (<FormItem><FormLabel>Instructor Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="subject" render={({ field }) => (<FormItem><FormLabel>Subject</FormLabel><FormControl><Input placeholder="e.g., Pre-Trip Inspection" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="targetAudience" render={({ field }) => (<FormItem><FormLabel>Target Audience</FormLabel><FormControl><Input placeholder="e.g., New CDL Trainees" {...field} /></FormControl><FormMessage /></FormItem>)} />
          </CardContent>
        </Card>

        <Card className="printable-card">
          <CardHeader>
            <CardTitle>Learning Objectives</CardTitle>
            <CardDescription>What will the trainees be able to do after this lesson?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name={`learningObjectives.${index}.objective`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="e.g., Trainee will be able to identify all 10 brake system components." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => append({ objective: '' })}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Objective
            </Button>
          </CardContent>
        </Card>

        <Card className="printable-card">
          <CardHeader><CardTitle>Lesson Content</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <FormField control={form.control} name="lessonActivities" render={({ field }) => (<FormItem><FormLabel>Lesson Activities &amp; Procedures</FormLabel><FormControl><Textarea className="min-h-[150px]" placeholder="Describe the step-by-step activities of the lesson..." {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="materialsAndResources" render={({ field }) => (<FormItem><FormLabel>Materials &amp; Resources Needed</FormLabel><FormControl><Textarea placeholder="e.g., Projector, handouts, a physical truck for inspection..." {...field} /></FormControl></FormItem>)} />
            <FormField control={form.control} name="assessmentMethods" render={({ field }) => (<FormItem><FormLabel>Assessment Methods</FormLabel><FormControl><Textarea placeholder="How will you measure if learning objectives were met? (e.g., Written quiz, hands-on demonstration)..." {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormItem>
                <FormLabel>Upload Supporting Documents</FormLabel>
                <FormControl>
                    <Input type="file" multiple />
                </FormControl>
                <FormDescription>Upload any handouts, presentations, or other materials.</FormDescription>
            </FormItem>
          </CardContent>
        </Card>

        <div className="flex justify-end no-print">
          <Button type="submit" size="lg">Submit Lesson Plan</Button>
        </div>
      </form>
    </Form>
  );
}
