// src/components/forms/skills-assessment-checklist-form.tsx
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { SignaturePad } from '@/components/ui/signature-pad';
import { Printer, CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const skillItemSchema = z.object({
  id: z.string(),
  skill: z.string(),
  rating: z.enum(['not_demonstrated', 'needs_improvement', 'proficient']),
  comment: z.string().optional(),
});

const skillsAssessmentSchema = z.object({
  traineeName: z.string().min(1, 'Trainee name is required.'),
  trainerName: z.string().min(1, 'Trainer name is required.'),
  assessmentDate: z.date({ required_error: 'Assessment date is required.' }),
  
  skills: z.array(skillItemSchema),
  
  overallFeedback: z.string().min(10, "Overall feedback is required."),
  
  traineeSignature: z.string().optional(),
  trainerSignature: z.string().optional(),
});

type SkillsAssessmentFormValues = z.infer<typeof skillsAssessmentSchema>;

const checklistItems = [
    { id: 'pre_trip', skill: 'Pre-Trip Inspection' },
    { id: 'coupling', skill: 'Coupling & Uncoupling' },
    { id: 'straight_back', skill: 'Straight Line Backing' },
    { id: 'offset_back', skill: 'Offset Backing (Left & Right)' },
    { id: 'parallel_park', skill: 'Parallel Parking (Driver & Blind Side)' },
    { id: 'alley_dock', skill: 'Alley Docking' },
    { id: 'city_driving', skill: 'City Driving (Turns, Intersections)' },
    { id: 'highway_driving', skill: 'Highway Driving (Merging, Lane Changes)' },
    { id: 'defensive_driving', skill: 'Defensive Driving Techniques' },
    { id: 'hos_management', skill: 'Hours of Service Management' },
];

export function SkillsAssessmentChecklistForm() {
  const { toast } = useToast();
  const form = useForm<SkillsAssessmentFormValues>({
    resolver: zodResolver(skillsAssessmentSchema),
    defaultValues: {
        assessmentDate: new Date(),
        skills: checklistItems.map(item => ({...item, rating: 'not_demonstrated', comment: '' }))
    },
    mode: 'onChange',
  });

  const handlePrint = () => window.print();

  const onSubmit = (data: SkillsAssessmentFormValues) => {
    console.log(data);
    toast({
      title: 'Assessment Saved',
      description: 'The skills assessment has been successfully logged.',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between no-print">
          <div>
            <h1 className="text-2xl font-headline font-bold">Skills Assessment Checklist</h1>
            <p className="text-muted-foreground">Evaluate a trainee's proficiency in key driving skills.</p>
          </div>
          <Button type="button" variant="outline" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print</Button>
        </div>

        <Card className="printable-card">
          <CardHeader><CardTitle>Assessment Details</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6">
            <FormField control={form.control} name="traineeName" render={({ field }) => (<FormItem><FormLabel>Trainee Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="trainerName" render={({ field }) => (<FormItem><FormLabel>Trainer/Evaluator</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="assessmentDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
          </CardContent>
        </Card>

        <Card className="printable-card">
            <CardHeader><CardTitle>Skills Checklist</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                {form.watch('skills').map((item, index) => (
                    <div key={item.id} className="p-4 border rounded-md space-y-4">
                        <h3 className="font-semibold">{item.skill}</h3>
                        <FormField
                            control={form.control}
                            name={`skills.${index}.rating`}
                            render={({ field }) => (
                                <FormItem>
                                <FormControl>
                                    <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-col sm:flex-row gap-4">
                                        <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="not_demonstrated" /></FormControl><FormLabel className="font-normal">Not Demonstrated</FormLabel></FormItem>
                                        <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="needs_improvement" /></FormControl><FormLabel className="font-normal">Needs Improvement</FormLabel></FormItem>
                                        <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="proficient" /></FormControl><FormLabel className="font-normal">Proficient</FormLabel></FormItem>
                                    </RadioGroup>
                                </FormControl>
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name={`skills.${index}.comment`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs text-muted-foreground">Comments</FormLabel>
                                    <FormControl><Input placeholder="Optional comments..." {...field} /></FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                ))}
            </CardContent>
        </Card>

        <Card className="printable-card">
            <CardHeader><CardTitle>Overall Feedback & Signatures</CardTitle></CardHeader>
            <CardContent className="space-y-6">
                <FormField control={form.control} name="overallFeedback" render={({ field }) => (<FormItem><FormLabel>Overall Feedback and Recommendations</FormLabel><FormControl><Textarea className="min-h-[120px]" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <Separator />
                <div className="grid md:grid-cols-2 gap-8">
                    <div className='space-y-2'><FormLabel>Trainee Signature</FormLabel><FormField control={form.control} name="traineeSignature" render={({ field }) => (<SignaturePad onEnd={field.onChange} penColor='white' />)} /></div>
                    <div className='space-y-2'><FormLabel>Trainer Signature</FormLabel><FormField control={form.control} name="trainerSignature" render={({ field }) => (<SignaturePad onEnd={field.onChange} penColor='white' />)} /></div>
                </div>
            </CardContent>
        </Card>

        <div className="flex justify-end no-print"><Button type="submit" size="lg">Save Assessment</Button></div>
      </form>
    </Form>
  );
}
