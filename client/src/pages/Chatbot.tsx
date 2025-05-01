import TopBar from "@/components/layout/TopBar";
import MobileNavigation from "@/components/layout/MobileNavigation";
import ChatInterface from "@/components/chatbot/ChatInterface";

const Chatbot = () => {
  return (
    <div className="flex flex-col min-h-screen lg:flex-row">
      {/* Main content */}
      <main className="flex-1">
        {/* TopBar */}
        <TopBar />

        {/* Content area */}
        <div className="pt-16 pb-16 lg:pb-0">
          <div className="p-4 sm:p-6 md:p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-heading font-bold text-slate-900 mb-2">
                Trợ lý AI
              </h1>
              <p className="text-slate-600">
                Đặt câu hỏi và nhận hỗ trợ về cách sử dụng nền tảng SocialPrediction.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ChatInterface />
              </div>
              
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-medium text-slate-900 mb-4">Câu hỏi thường gặp</h3>
                  <ul className="space-y-3">
                    <li>
                      <button 
                        className="text-sm text-primary-600 hover:text-primary-700 text-left"
                        onClick={() => {
                          // Implement FAQ click handler if needed
                          console.log("FAQ clicked");
                        }}
                      >
                        Làm thế nào để tạo dự đoán?
                      </button>
                    </li>
                    <li>
                      <button 
                        className="text-sm text-primary-600 hover:text-primary-700 text-left"
                        onClick={() => {
                          console.log("FAQ clicked");
                        }}
                      >
                        Cách kết nối ví Sui?
                      </button>
                    </li>
                    <li>
                      <button 
                        className="text-sm text-primary-600 hover:text-primary-700 text-left"
                        onClick={() => {
                          console.log("FAQ clicked");
                        }}
                      >
                        Làm thế nào để tạo thị trường mới?
                      </button>
                    </li>
                    <li>
                      <button 
                        className="text-sm text-primary-600 hover:text-primary-700 text-left"
                        onClick={() => {
                          console.log("FAQ clicked");
                        }}
                      >
                        Cách nhận phần thưởng từ dự đoán chính xác?
                      </button>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-medium text-slate-900 mb-4">Tài nguyên hỗ trợ</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <i className="fas fa-book text-slate-400"></i>
                      <a href="#" className="text-sm text-primary-600 hover:text-primary-700">
                        Hướng dẫn sử dụng
                      </a>
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="fas fa-video text-slate-400"></i>
                      <a href="#" className="text-sm text-primary-600 hover:text-primary-700">
                        Video hướng dẫn
                      </a>
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="fas fa-question-circle text-slate-400"></i>
                      <a href="#" className="text-sm text-primary-600 hover:text-primary-700">
                        Trung tâm hỗ trợ
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <MobileNavigation />
      </main>
    </div>
  );
};

export default Chatbot;