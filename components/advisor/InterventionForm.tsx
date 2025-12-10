'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateIntervention } from '@/lib/hooks/useInterventions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const interventionSchema = z.object({
  student_id: z.number(),
  intervention_type: z.enum(['email', 'sms', 'meeting', 'phone_call', 'auto_nudge']),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  scheduled_date: z.string().optional(),
});

type InterventionFormData = z.infer<typeof interventionSchema>;

interface InterventionFormProps {
  studentId: number;
  studentName: string;
  advisorId: string;
  onSuccess?: () => void;
}

export function InterventionForm({
  studentId,
  studentName,
  advisorId,
  onSuccess,
}: InterventionFormProps) {
  const { toast } = useToast();
  const createIntervention = useCreateIntervention();

  const form = useForm<InterventionFormData>({
    resolver: zodResolver(interventionSchema),
    defaultValues: {
      student_id: studentId,
      intervention_type: 'email',
      subject: '',
      message: '',
      scheduled_date: '',
    },
  });

  const selectedType = form.watch('intervention_type');

  const onSubmit = async (data: InterventionFormData) => {
    try {
      await createIntervention.mutateAsync({
        student_id: data.student_id,
        advisor_id: advisorId,
        intervention_type: data.intervention_type,
        subject: data.subject,
        message: data.message,
        status: 'pending',
        scheduled_date: data.scheduled_date || undefined,
      });

      toast({
        title: 'Intervention Sent',
        description: `${data.intervention_type} intervention has been sent to ${studentName}.`,
      });

      form.reset();
      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send intervention. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Intervention to {studentName}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="intervention_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intervention Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select intervention type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="phone_call">Phone Call</SelectItem>
                      <SelectItem value="meeting">Schedule Meeting</SelectItem>
                      <SelectItem value="auto_nudge">Auto Nudge</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the type of intervention to send to the student
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(selectedType === 'email' || selectedType === 'meeting') && (
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter subject line" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your message..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {selectedType === 'sms'
                      ? 'Keep SMS messages concise (160 characters recommended)'
                      : 'Provide a detailed message for the student'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedType === 'meeting' && (
              <FormField
                control={form.control}
                name="scheduled_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scheduled Date & Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormDescription>When would you like to meet?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex gap-2">
              <Button type="submit" disabled={createIntervention.isPending} className="flex-1">
                {createIntervention.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Intervention'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={createIntervention.isPending}
              >
                Clear
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
