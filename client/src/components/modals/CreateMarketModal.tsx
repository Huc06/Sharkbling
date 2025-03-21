import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { useMarkets } from "@/contexts/MarketsContext";
import { useWallet } from "@/contexts/WalletContext";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface CreateMarketModalProps {
  onClose: () => void;
  initialData?: {
    platform?: string;
    contentUrl?: string;
    title?: string;
  };
}

// Form schema with validation
const formSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  contentUrl: z.string().url("Please enter a valid URL"),
  title: z.string().min(5, "Question must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  endDate: z.string().min(1, "End date is required"),
  initialPool: z.number().min(50, "Minimum 50 SUI to create a market"),
  resolutionMethod: z.string().min(1, "Resolution method is required"),
  marketFee: z.number().min(1, "Fee must be at least 1%").max(5, "Fee cannot exceed 5%"),
});

type FormValues = z.infer<typeof formSchema>;

const CreateMarketModal = ({ onClose, initialData }: CreateMarketModalProps) => {
  const { createMarket, isCreatingMarket } = useMarkets();
  const { walletAddress } = useWallet();
  
  // Initialize form with default values or provided initialData
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platform: initialData?.platform || "GitHub",
      contentUrl: initialData?.contentUrl || "",
      title: initialData?.title || "",
      description: "",
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
      initialPool: 100,
      resolutionMethod: "Automatic",
      marketFee: 2,
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!walletAddress) return;
    
    const marketData = {
      ...data,
      creatorAddress: walletAddress,
      status: "active",
      endDate: new Date(data.endDate),
    };
    
    const result = await createMarket(marketData);
    if (result) {
      onClose();
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-heading font-bold">Create Prediction Market</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-700">Platform</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="GitHub">GitHub</SelectItem>
                      <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                      <SelectItem value="Farcaster">Farcaster</SelectItem>
                      <SelectItem value="Discord">Discord</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contentUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-700">Content URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://github.com/MystenLabs/sui" 
                      {...field} 
                    />
                  </FormControl>
                  <p className="mt-1 text-xs text-slate-500">Link to the GitHub repo, LinkedIn post, or other content</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-700">Prediction Question</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Will this repo reach 10,000 stars by EOY?" 
                      {...field} 
                    />
                  </FormControl>
                  <p className="mt-1 text-xs text-slate-500">Make sure your question has a clear yes/no outcome</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-700">Description</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Brief description of the prediction market" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-700">End Date</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="initialPool"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-700">Initial Pool (SUI)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="100" 
                      min={50}
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <p className="mt-1 text-xs text-slate-500">Minimum 50 SUI to create a market</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="resolutionMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-700">Resolution Method</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select resolution method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Automatic">Automatic (API Data)</SelectItem>
                      <SelectItem value="Community">Community Vote</SelectItem>
                      <SelectItem value="Oracle">Specified Oracle</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="marketFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-700">Market Fee (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1} 
                      max={5}
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <p className="mt-1 text-xs text-slate-500">Fee collected from the winning pool (1-5%)</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-primary-500 hover:bg-primary-600"
                disabled={isCreatingMarket}
              >
                {isCreatingMarket ? "Creating..." : "Create Market"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMarketModal;
