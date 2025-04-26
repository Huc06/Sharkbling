import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Users } from "lucide-react";

interface SavedMarketData {
  id: number;
  title: string;
  description: string;
  resolutionTime: number;
  minAmount: number;
  coinObjectId: string;
  createdAt: string;
  platform?: string;
}

interface SavedMarketDataProps {
  onDataChange?: (hasData: boolean) => void;
}

const SavedMarketData: React.FC<SavedMarketDataProps> = ({ onDataChange }) => {
  // Giả lập tỷ lệ Yes/No cho mỗi thị trường
  const [marketPredictions, setMarketPredictions] = useState<{[key: number]: {yes: number, no: number}}>({});
  const [savedDataList, setSavedDataList] = useState<SavedMarketData[]>([]);

  // Hàm tính toán thời gian còn lại
  const formatTimeLeft = (timestamp: number) => {
    const now = new Date();
    const endDate = new Date(timestamp * 1000);
    const diffTime = Math.max(endDate.getTime() - now.getTime(), 0);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Nếu còn ít hơn 1 ngày, hiển thị giờ
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      return `${diffHours} hours`;
    } else if (diffDays === 1) {
      return "1 day";
    } else {
      return `${diffDays} days`;
    }
  };

  useEffect(() => {
    // Lấy dữ liệu từ localStorage khi component mount
    const storedData = localStorage.getItem('marketFormDataList');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        console.log("Parsed data from localStorage:", parsedData);
        const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];
        setSavedDataList(dataArray);

        // Khởi tạo dữ liệu dự đoán ngẫu nhiên cho mỗi thị trường
        const predictions: {[key: number]: {yes: number, no: number}} = {};
        dataArray.forEach(market => {
          if (market.id) {
            // Tạo tỷ lệ ngẫu nhiên, đảm bảo tổng là 100%
            const yesPercent = Math.floor(Math.random() * 80) + 10; // 10-90%
            predictions[market.id] = {
              yes: yesPercent,
              no: 100 - yesPercent
            };
          }
        });
        setMarketPredictions(predictions);

        // Thông báo cho component cha về trạng thái dữ liệu
        if (onDataChange) {
          onDataChange(dataArray.length > 0);
        }
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
        if (onDataChange) {
          onDataChange(false);
        }
      }
    } else {
      // Kiểm tra key cũ để tương thích ngược
      const oldStoredData = localStorage.getItem('marketFormData');
      if (oldStoredData) {
        try {
          const parsedData = JSON.parse(oldStoredData);
          setSavedDataList([parsedData]);

          // Khởi tạo dữ liệu dự đoán ngẫu nhiên
          if (parsedData.id) {
            const yesPercent = Math.floor(Math.random() * 80) + 10;
            setMarketPredictions({
              [parsedData.id]: {
                yes: yesPercent,
                no: 100 - yesPercent
              }
            });
          }

          if (onDataChange) {
            onDataChange(true);
          }
        } catch (error) {
          console.error("Error parsing old localStorage data:", error);
          if (onDataChange) {
            onDataChange(false);
          }
        }
      } else {
        console.log("No data found in localStorage");
        if (onDataChange) {
          onDataChange(false);
        }
      }
    }
  }, [onDataChange]);

  // Kiểm tra dữ liệu trước khi render
  console.log("Current savedDataList state:", savedDataList);

  const clearSavedData = () => {
    localStorage.removeItem('marketFormDataList');
    localStorage.removeItem('marketFormData'); // Also remove old format for completeness
    setSavedDataList([]);

    // Thông báo cho component cha rằng không còn dữ liệu
    if (onDataChange) {
      onDataChange(false);
    }
  };

  const removeMarket = (marketId: number) => {
    const updatedList = savedDataList.filter(market => market.id !== marketId);
    localStorage.setItem('marketFormDataList', JSON.stringify(updatedList));
    setSavedDataList(updatedList);

    // Thông báo cho component cha về trạng thái dữ liệu mới
    if (onDataChange) {
      onDataChange(updatedList.length > 0);
    }
  };

  if (savedDataList.length === 0) {
    // Tạo 4 thẻ trống để giữ layout
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <i className="fas fa-bookmark text-slate-400 text-lg"></i>
          </div>
          <p className="text-slate-700 font-medium text-sm mb-1">No saved markets</p>
          <p className="text-xs text-slate-500">Create a market to get started.</p>
        </div>

        {/* Thẻ trống với viền đứt để gợi ý thêm market */}
        <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <i className="fas fa-plus text-slate-400"></i>
            </div>
            <p className="text-xs text-slate-500">Add more markets</p>
          </div>
        </div>

        {/* Hai thẻ trống còn lại */}
        <div className="hidden sm:block lg:hidden"></div>
        <div className="hidden lg:block"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={clearSavedData}
          className="text-xs bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
        >
          <i className="fas fa-trash-alt mr-1"></i> Clear All
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {savedDataList.map((market, index) => {
          // Lấy dữ liệu dự đoán cho thị trường này
          const prediction = market.id ? marketPredictions[market.id] : { yes: 68, no: 32 };
          const yesPercentage = prediction?.yes || 68;
          const noPercentage = prediction?.no || 32;

          return (
            <div key={market.id || index} className="bg-white rounded-lg shadow-sm overflow-hidden saved-market-item h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-2 bg-teal-100">
                <span className="font-medium text-teal-800 text-xs">
                  {market.platform || "GitHub"}
                </span>
                <span className="px-2 py-0.5 text-xs font-bold text-white rounded-full bg-green-500">
                  Active
                </span>
              </div>

              {/* Content */}
              <div className="p-3 flex-1 flex flex-col">
                {/* Market Title */}
                <h2 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2">
                  {market.title}
                </h2>

                {/* Time and Pool Info */}
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <Clock size={12} className="mr-1" />
                  <span>{formatTimeLeft(market.resolutionTime)}</span>
                  <span className="mx-1">•</span>
                  <span>${market.minAmount.toLocaleString()} pool</span>
                </div>

                {/* Prediction Progress */}
                <div className="mb-3">
                  <div className="relative h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full rounded-l-full bg-blue-500"
                      style={{ width: `${yesPercentage}%` }}
                    ></div>
                    <div
                      className="absolute top-0 left-0 h-full rounded-r-full bg-red-500"
                      style={{ width: `${noPercentage}%`, left: `${yesPercentage}%` }}
                    ></div>
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-gray-600">
                    <span>Yes ({yesPercentage}%)</span>
                    <span>No ({noPercentage}%)</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-1 mt-auto">
                  <button
                    className="w-full py-1.5 rounded text-xs font-medium text-center bg-teal-200 text-teal-800 hover:bg-teal-300 transition duration-200"
                  >
                    Predict Yes
                  </button>
                  <button
                    className="w-full py-1.5 rounded text-xs font-medium text-center bg-blue-200 text-blue-800 hover:bg-blue-300 transition duration-200"
                  >
                    Predict No
                  </button>
                </div>

                {/* Footer */}
                <div className="mt-2 flex items-center justify-between text-xs">
                  <div className="flex items-center text-gray-500">
                    <Users size={12} className="mr-1" />
                    <span>Participants</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="text-blue-600 hover:underline font-medium text-xs"
                    >
                      View Details
                    </button>
                    <button
                      className="text-red-600 hover:underline font-medium text-xs"
                      onClick={() => removeMarket(market.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Không cần modal nữa vì đã thay đổi thiết kế */}
    </div>
  );
};

export default SavedMarketData;
