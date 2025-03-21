import { useSuiWallet } from "@/hooks/useSuiWallet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const SuiWalletInfo = () => {
  const { walletAddress, isConnected, currentAccount } = useSuiWallet();

  if (!isConnected) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Thông tin ví</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">Vui lòng kết nối ví để xem thông tin chi tiết.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Thông tin ví Sui</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-slate-600 mb-1">Địa chỉ ví</p>
          <div className="text-sm bg-slate-100 p-2 rounded-md overflow-x-auto">
            {walletAddress}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-600 mb-1">Tên ví</p>
          <div className="text-sm">
            {currentAccount?.address || "Ví không xác định"}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-600 mb-1">Trạng thái</p>
          <Badge variant="success">Đã kết nối</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default SuiWalletInfo;