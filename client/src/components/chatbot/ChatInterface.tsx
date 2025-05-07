import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import { useSuiWallet } from "@/hooks/useSuiWallet";
import { Wallet, MessageSquare } from "lucide-react";

type Message = {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
};

type TokenBalance = {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  balance: string;
};

export default function ChatInterface() {
  const {
    isConnected,
    walletAddress,
    signMessage,
    signature,
    openConnectWalletModal,
  } = useSuiWallet();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi I'm Sharkbing AI Assistant how i can help you today ?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check signature from localStorage or useSuiWallet to update status of signature
  useEffect(() => {
    if (isConnected && walletAddress) {
      // checking valid signature on localStorage
      const savedSignature = localStorage.getItem(`signature_${walletAddress}`);

      if (savedSignature) {
        console.log("Found saved signature in localStorage");
        setIsAuthenticated(true);
      } else if (signature) {
        console.log(
          "Signature detected from wallet, setting authenticated to true"
        );
        setIsAuthenticated(true);
        // Save signature
        localStorage.setItem(`signature_${walletAddress}`, signature);
      }
    }
  }, [signature, isConnected, walletAddress]);

  // Checking make sure user have been logined
  useEffect(() => {
    const authenticateUser = async () => {
      console.log("Authentication check:", {
        isConnected,
        isAuthenticated,
        signature,
      });

      if (isConnected && walletAddress && !isAuthenticated) {
        // checking valid signature on localStorage first
        const savedSignature = localStorage.getItem(
          `signature_${walletAddress}`
        );

        if (savedSignature) {
          console.log("Using saved signature from localStorage");
          setIsAuthenticated(true);
          return;
        }

        try {
          const sig = await signMessage("Login to user SharkBling Bot");

          if (sig) {
            console.log("Setting authenticated to true");
            setIsAuthenticated(true);

            // save signature to localStorage
            localStorage.setItem(`signature_${walletAddress}`, sig);
          } else {
            console.error("Failed to get signature");
          }
        } catch (error) {
          console.error("Authentication error:", error);
        }
      }
    };

    authenticateUser();
  }, [isConnected, walletAddress]);

  const handleAuthenticate = async () => {
    const sig = await signMessage("Login to chatbot SharkBling");
    if (sig && walletAddress) {
      console.log("Manual authentication successful");
      setIsAuthenticated(true);
      localStorage.setItem(`signature_${walletAddress}`, sig);
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Format wallet balance response
  const formatWalletBalance = (responseText: string) => {
    if (responseText.includes("Your wallet balance:")) {
      try {
        // Extract the JSON array from the response
        const jsonStr = responseText.replace("Your wallet balance: ", "");
        const balances: TokenBalance[] = JSON.parse(jsonStr);

        // Format the response in a more readable way
        let formattedResponse = "**Your Wallet Balance:**\n\n";

        balances.forEach((token) => {
          formattedResponse += `**${token.name} (${token.symbol}):**\n`;
          formattedResponse += `${token.balance} ${token.symbol}\n\n`;
        });

        return formattedResponse;
      } catch (error) {
        console.error("Error parsing wallet balance:", error);
        return responseText;
      }
    }
    return responseText;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    if (!isConnected) {
      // Notify user to connect wallet
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "You need to connect your Sui wallet to use the chatbot.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      return;
    }

    if (!isAuthenticated) {
      try {
        // Request authentication if not yet authenticated
        const sig = await signMessage("Đăng nhập vào chatbot SharkBling");
        if (!sig) {
          const errorMessage: Message = {
            id: Date.now().toString(),
            content: "You need to authenticate your wallet to use the chatbot.",
            sender: "bot",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMessage]);
          return;
        }

        console.log("Setting authenticated to true from send");
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error during authentication in send:", error);
        return;
      }
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Call backend API
      const response = await axios.post(
        "http://localhost:5000/v1/sui-agent/chat",
        {
          message: input,
          walletAddress: walletAddress, // Thêm địa chỉ ví vào request
          signature: signature, // Thêm chữ ký vào request
        }
      );

      // Format the response
      const formattedResponse = formatWalletBalance(
        response.data.data.response
      );

      // Add bot response
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: formattedResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error calling chat API:", error);
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Sorry, an error occurred while processing your request. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to render message content with formatting
  const renderMessageContent = (content: string) => {
    // Split by newlines and process each line
    const lines = content.split("\n");

    return lines.map((line, index) => {
      // Check for bold text (wrapped in **)
      if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <p key={index} className="font-bold">
            {line.slice(2, -2)}
          </p>
        );
      }
      // Check for bold text in the middle
      else if (line.includes("**")) {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
          <p key={index}>
            {parts.map((part, i) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return (
                  <span key={i} className="font-bold">
                    {part.slice(2, -2)}
                  </span>
                );
              }
              return <span key={i}>{part}</span>;
            })}
          </p>
        );
      }
      // Regular line
      else if (line.trim()) {
        return <p key={index}>{line}</p>;
      }
      // Empty line
      return <br key={index} />;
    });
  };

// Show login screen if wallet is not connected

if (!isConnected) {
    return (
      <div className="flex flex-col h-[600px] border rounded-xl overflow-hidden bg-white">
        <div className="p-4 border-b bg-primary-500 text-white">
          <h2 className="text-xl font-bold">SharkBling AI</h2>{" "}
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Wallet className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-medium text-slate-900 mb-2">
            Connect your wallet
          </h3>
          <p className="text-slate-600 mb-6 max-w-md">
            You need to connect your Sui wallet to use the SharkBling chatbot.
            Connecting your wallet gives you full access to the AI assistant’s
            features.
          </p>
          <Button
            onClick={openConnectWalletModal}
            className="bg-primary-500 hover:bg-primary-600 text-white px-6"
          >
            <Wallet className="w-4 h-4 mr-2" />
            Kết nối ví Sui
          </Button>
        </div>
      </div>
    );
  }

  // Show authentication screen if wallet is connected but not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col h-[600px] border rounded-xl overflow-hidden bg-white">
        <div className="p-4 border-b bg-primary-500 text-white">
          <h2 className="text-xl font-bold">SharkBling AI</h2>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-medium text-slate-900 mb-2">
            → Authenticate your wallet
          </h3>
          <p className="text-slate-600 mb-6 max-w-md">
            For security, you need to authenticate your Sui wallet by signing a
            message. This helps us verify that you are the wallet owner.
          </p>
          <Button
            onClick={handleAuthenticate}
            className="bg-primary-500 hover:bg-primary-600 text-white px-6"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Sign message to authenticate{" "}
          </Button>
        </div>
      </div>
    );
  }

  console.log("Rendering chat interface, authenticated:", isAuthenticated);

  return (
    <div className="flex flex-col h-[600px] border rounded-xl overflow-hidden bg-white">
      <div className="p-4 border-b bg-primary-500 text-white">
        <h2 className="text-xl font-bold">SharkBling AI</h2>
        <p className="text-sm opacity-80">Trợ lý ảo hỗ trợ dự đoán</p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.sender === "user"
                    ? "bg-primary-100 text-primary-900"
                    : "bg-slate-100"
                }`}
              >
                {msg.sender === "bot" && (
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar className="h-6 w-6">
                      <img
                        src="/bot-avatar.png"
                        alt="AI"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "https://ui-avatars.com/api/?name=AI&background=6366f1&color=fff";
                        }}
                      />
                    </Avatar>
                    <span className="text-xs font-medium">SharkBling AI</span>
                  </div>
                )}
                <div className="text-sm space-y-1">
                  {renderMessageContent(msg.content)}
                </div>
                <div className="text-xs text-slate-500 mt-1 text-right">
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-slate-100">
                <div className="flex items-center gap-2 mb-1">
                  <Avatar className="h-6 w-6">
                    <img
                      src="/bot-avatar.png"
                      alt="AI"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "https://ui-avatars.com/api/?name=AI&background=6366f1&color=fff";
                      }}
                    />
                  </Avatar>
                  <span className="text-xs font-medium">SharkBling AI</span>
                </div>
                <div className="flex space-x-1">
                  <div
                    className="h-2 w-2 bg-slate-300 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="h-2 w-2 bg-slate-300 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="h-2 w-2 bg-slate-300 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your question..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={isLoading}>
            <i className="fas fa-paper-plane mr-2"></i>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
