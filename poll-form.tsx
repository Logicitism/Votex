import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { useState } from "react";
import { X } from "lucide-react";
import { extendedPollSchema } from "@shared/schema";

// Form schema
const formSchema = extendedPollSchema.omit({ id: true, userId: true, createdAt: true });

export function PollForm() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [options, setOptions] = useState<string[]>(["", ""]);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      options: [{ text: "" }, { text: "" }],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default to 1 week from now
      isAnonymous: false,
    },
  });

  // Poll creation mutation
  const createPollMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const res = await apiRequest("POST", "/api/polls", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Poll created",
        description: "Your poll has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/polls'] });
      navigate("/my-polls");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create poll",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Ensure the endDate is properly formatted as an ISO string
    const formattedValues = {
      ...values,
      endDate: new Date(values.endDate).toISOString()
    };
    createPollMutation.mutate(formattedValues);
  }

  // Add option handler
  const addOption = () => {
    form.setValue('options', [
      ...(form.getValues('options') || []),
      { text: '' }
    ]);
    setOptions([...options, ""]);
  };

  // Remove option handler
  const removeOption = (index: number) => {
    if (options.length <= 2) {
      toast({
        title: "Cannot remove option",
        description: "A poll must have at least 2 options.",
        variant: "destructive",
      });
      return;
    }
    
    const newOptions = form.getValues('options').filter((_, i) => i !== index);
    form.setValue('options', newOptions);
    
    setOptions(options.filter((_, i) => i !== index));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Poll Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter poll title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your poll"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel className="block mb-2">Poll Options</FormLabel>
          <div className="space-y-2">
            {form.getValues('options')?.map((_, index) => (
              <FormField
                key={index}
                control={form.control}
                name={`options.${index}.text`}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex rounded-md shadow-sm">
                      <FormControl>
                        <Input
                          placeholder={`Option ${index + 1}`}
                          className="rounded-r-none"
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="rounded-l-none border border-l-0 border-input"
                        onClick={() => removeOption(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={addOption}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Option
          </Button>
        </div>

        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>
                The poll will automatically close on this date.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isAnonymous"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Anonymous Voting</FormLabel>
                <FormDescription>
                  Voter identities will not be stored on the blockchain, only their votes.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/my-polls')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createPollMutation.isPending}
          >
            {createPollMutation.isPending ? "Creating..." : "Create Poll"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
