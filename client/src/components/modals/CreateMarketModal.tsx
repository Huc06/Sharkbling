import React from "react";
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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AiOutlineLink, AiOutlineQuestionCircle, AiOutlineInfoCircle } from "react-icons/ai";

interface CreateMarketModalProps {
  onClose: () => void;
  initialData?: {
    platform?: string;
    contentUrl?: string;
    title?: string;
  };
}

// Xác thực form
const formSchema = z.object({
  platform: z.string().min(1, "Vui lòng chọn nền tảng."),
  contentUrl: z.string().url("URL không hợp lệ."),
  title: z.string().min(5, "Câu hỏi phải có ít nhất 5 ký tự."),
  description: z.string().min(10, "Mô tả phải có ít nhất 10 ký tự."),
  endDate: z.string().min(1, "Vui lòng chọn ngày kết thúc."),
  initialPool: z.number().min(50, "Tối thiểu 50 SUI để tạo thị trường."),
  resolutionMethod: z.string().min(1, "Vui lòng chọn phương thức xác định kết quả."),
  marketFee: z
    .number()
    .min(1, "Phí tối thiểu là 1%.")
    .max(5, "Phí không vượt quá 5%."),
});

type FormValues = z.infer<typeof formSchema>;

const CreateMarketModal: React.FC<CreateMarketModalProps> = ({ onClose, initialData }) => {
  const { createMarket, isCreatingMarket } = useMarkets();
  const { walletAddress } = useWallet();

  // Khởi tạo form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platform: initialData?.platform || "GitHub",
      contentUrl: initialData?.contentUrl || "",
      title: initialData?.title || "",
      description: "",
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
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
      {/* Sử dụng bg-white để modal nổi bật, kèm shadow và bo góc */}
      <DialogContent className="sm:max-w-lg w-full max-h-[90vh] overflow-y-auto bg-white p-6 rounded-lg shadow-lg">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-bold text-text">
            Tạo Thị Trường Dự Báo
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Nền tảng */}
            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-text">Nền tảng</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="border border-secondary rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent">
                        <SelectValue placeholder="Chọn nền tảng" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="z-50 border border-secondary rounded-md theme-primary-bg">
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

            {/* URL */}
            <FormField
              control={form.control}
              name="contentUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-text">
                    Đường dẫn nội dung <AiOutlineLink className="inline-block ml-1" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập URL (ví dụ: https://github.com/MystenLabs/sui)"
                      {...field}
                      className="border border-secondary rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent w-full placeholder:text-gray-400"
                    />
                  </FormControl>
                  <p className="mt-1 text-xs text-secondary">
                    Link đến GitHub, LinkedIn hoặc nội dung khác
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Câu hỏi dự đoán */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-text">
                    Câu hỏi dự đoán <AiOutlineQuestionCircle className="inline-block ml-1" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập câu hỏi dự đoán (ví dụ: Repo này có đạt 10,000 sao vào cuối năm không?)"
                      {...field}
                      className="border border-secondary rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent w-full placeholder:text-gray-400"
                    />
                  </FormControl>
                  <p className="mt-1 text-xs text-secondary">
                    Đảm bảo câu hỏi có kết quả rõ ràng (Có/Không)
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Mô tả */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-text">
                    Mô tả <AiOutlineInfoCircle className="inline-block ml-1" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Mô tả ngắn gọn về thị trường dự đoán"
                      {...field}
                      className="border border-secondary rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent w-full placeholder:text-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ngày kết thúc */}
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-text">Ngày kết thúc</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      className="border border-secondary rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Quỹ ban đầu */}
            <FormField
              control={form.control}
              name="initialPool"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-text">Quỹ ban đầu (SUI)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="100"
                      min={50}
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      className="border border-secondary rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent w-full placeholder:text-gray-400"
                    />
                  </FormControl>
                  <p className="mt-1 text-xs text-secondary">
                    Tối thiểu 50 SUI để tạo thị trường
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phương thức xác định kết quả */}
            <FormField
              control={form.control}
              name="resolutionMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-text">Phương thức xác định kết quả</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="border border-secondary rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent">
                        <SelectValue placeholder="Chọn phương thức" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="z-50 border border-secondary rounded-md theme-primary-bg">
                      <SelectItem value="Automatic">Tự động (dữ liệu API)</SelectItem>
                      <SelectItem value="Community">Bỏ phiếu cộng đồng</SelectItem>
                      <SelectItem value="Oracle">Oracle chỉ định</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phí thị trường */}
            <FormField
              control={form.control}
              name="marketFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-text">Phí thị trường (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={5}
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      className="border border-secondary rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent w-full"
                    />
                  </FormControl>
                  <p className="mt-1 text-xs text-secondary">
                    Phí trích từ quỹ người thắng (1-5%)
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Nút hành động */}
            <div className="flex items-center justify-end gap-4 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border border-secondary text-text hover:bg-secondary hover:text-white px-4 py-2 rounded-md"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isCreatingMarket}
                className="bg-primary hover:bg-accent text-white px-4 py-2 rounded-md"
              >
                {isCreatingMarket ? "Đang tạo..." : "Tạo Thị Trường"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMarketModal;
