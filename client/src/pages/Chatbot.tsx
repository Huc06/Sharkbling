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
                AI Assistant
              </h1>
              <p className="text-slate-600">
                Ask questions and get support on how to use the SocialPrediction platform.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ChatInterface />
              </div>
              
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-medium text-slate-900 mb-4">Frequently Asked Questions</h3>
                  <ul className="space-y-3">
                    <li>
                      <button 
                        className="text-sm text-primary-600 hover:text-primary-700 text-left"
                        onClick={() => {
                          // Implement FAQ click handler if needed
                          console.log("FAQ clicked");
                        }}
                      >
                        How to create a prediction?
                      </button>
                    </li>
                    <li>
                      <button 
                        className="text-sm text-primary-600 hover:text-primary-700 text-left"
                        onClick={() => {
                          console.log("FAQ clicked");
                        }}
                      >
                        How to connect Sui wallet?
                      </button>
                    </li>
                    <li>
                      <button 
                        className="text-sm text-primary-600 hover:text-primary-700 text-left"
                        onClick={() => {
                          console.log("FAQ clicked");
                        }}
                      >
                        How to create a new market?
                      </button>
                    </li>
                    <li>
                      <button 
                        className="text-sm text-primary-600 hover:text-primary-700 text-left"
                        onClick={() => {
                          console.log("FAQ clicked");
                        }}
                      >
                        How to receive rewards from accurate predictions?
                      </button>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-medium text-slate-900 mb-4">Support Resources</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <i className="fas fa-book text-slate-400"></i>
                      <a href="#" className="text-sm text-primary-600 hover:text-primary-700">
                        User Guide
                      </a>
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="fas fa-video text-slate-400"></i>
                      <a href="#" className="text-sm text-primary-600 hover:text-primary-700">
                        Tutorial Videos
                      </a>
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="fas fa-question-circle text-slate-400"></i>
                      <a href="#" className="text-sm text-primary-600 hover:text-primary-700">
                        Support Center
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
