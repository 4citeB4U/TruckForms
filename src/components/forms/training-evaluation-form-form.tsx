// src/components/forms/training-evaluation-form.tsx
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
import { SignaturePad } from '@/components/ui/signature-pad';
import { Printer, CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const ratingSchema = z.enum(['1', '2', '3', '4', '5']);
const ratingLabels = {
    '1': "Unsatisfactory",
    '2': "Needs Improvement",
    '3': "Meets Expectations",
    '4': "Exceeds Expectations",
    '5': "Outstanding"
}

const trainingEvaluationSchema = z.object({
  traineeName: z.string().min(1, 'Trainee name is required.'),
  trainingProgram: z.string().min(1, 'Training program is required.'),
  evaluationDate: z.date({ required_error: 'Evaluation date is required.' }),
  evaluatorName: z.string().min(1, 'Evaluator name is required.'),
  
  knowledgeAssessment: ratingSchema,
  practicalSkills: ratingSchema,
  safetyCompliance: ratingSchema,
  professionalism: ratingSchema,
  
  strengths: z.string().min(1, 'Strengths are required.'),
  areasForImprovement: z.string().min(1, 'Areas for improvement are required.'),
  
  traineeSignature: z.string().optional(),
  evaluatorSignature: z.string().optional(),
});

type TrainingEvaluationFormValues = z.infer<typeof trainingEvaluationSchema>;

export function TrainingEvaluationForm() {
  const { toast } = useToast();
  const form = useForm<TrainingEvaluationFormValues>({
    resolver: zodResolver(trainingEvaluationSchema),
    defaultValues: { evaluationDate: new Date() },
    mode: 'onChange',
  });

  const handlePrint = () => window.print();
  const onSubmit = (data: TrainingEvaluationFormValues) => {
    console.log(data);
    toast({
      title: 'Evaluation Submitted',
      description: 'The training evaluation has been saved.',
    });
  };

  const RatingField = ({ name, label }: { name: keyof TrainingEvaluationFormValues, label: string }) => (
    <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
            <FormItem className="space-y-3 rounded-md border p-4">
                <FormLabel className="font-semibold">{label}</FormLabel>
                <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value as string} className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4">
                        {Object.entries(ratingLabels).map(([value, label]) => (
                            <FormItem key={value} className="flex items-center space-x-2 space-y-0">
                                <FormControl><RadioGroupItem value={value} /></FormControl>
                                <FormLabel className="font-normal text-sm">{label}</FormLabel>
                            </FormItem>
                        ))}
                    </RadioGroup>
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
            <h1 className="text-2xl font-headline font-bold">Training Evaluation Form</h1>
            <p className="text-muted-foreground">Assess trainee comprehension and performance after a training module.</p>
          </div>
          <Button type="button" variant="outline" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print</Button>
        </div>

        <Card className="printable-card">
          <CardHeader><CardTitle>Evaluation Details</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FormField control={form.control} name="traineeName" render={({ field }) => (<FormItem><FormLabel>Trainee Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="trainingProgram" render={({ field }) => (<FormItem><FormLabel>Training Program</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="evaluatorName" render={({ field }) => (<FormItem><FormLabel>Evaluator Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="evaluationDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Evaluation Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
          </CardContent>
        </Card>

        <Card className="printable-card">
            <CardHeader><CardTitle>Performance Ratings</CardTitle><CardDescription>Rate the trainee's performance in each category.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
                <RatingField name="knowledgeAssessment" label="Knowledge of Subject Matter" />
                <RatingField name="practicalSkills" label="Practical Skill Application" />
                <RatingField name="safetyCompliance" label="Safety & Compliance Adherence" />
                <RatingField name="professionalism" label="Professionalism & Attitude" />
            </CardContent>
        </Card>
        
        <Card className="printable-card">
            <CardHeader><CardTitle>Summary & Feedback</CardTitle></CardHeader>
            <CardContent className="space-y-6">
                <FormField control={form.control} name="strengths" render={({ field }) => (<FormItem><FormLabel>Key Strengths Demonstrated</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="areasForImprovement" render={({ field }) => (<FormItem><FormLabel>Areas for Improvement / Further Training</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
            </CardContent>
        </Card>
        
        <Card className="printable-card">
          <CardHeader><CardTitle>Signatures</CardTitle><CardDescription>Signature acknowledges receipt and discussion of this evaluation.</CardDescription></CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8">
            <div className='space-y-2'><FormLabel>Trainee Signature</FormLabel><FormField control={form.control} name="traineeSignature" render={({ field }) => (<SignaturePad onEnd={field.onChange} penColor='white' />)} /></div>
            <div className='space-y-2'><FormLabel>Evaluator Signature</FormLabel><FormField control={form.control} name="evaluatorSignature" render={({ field }) => (<SignaturePad onEnd={field.onChange} penColor='white' />)} /></div>
          </CardContent>
        </Card>

        <div className="flex justify-end no-print"><Button type="submit" size="lg">Submit Evaluation</Button></div>
      </form>
    </Form>
  );
}
