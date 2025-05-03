import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import { TokenData, TokenTrendsResponse } from "@/types/TokenTrends";
import { AIDetailedResponse } from "@/types/AIAnalysis";

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

// Define BetScenario type from AIDetailedResponse
type BetScenario = {
  title: string;
  description: string;
};

type BetGroup = BetScenario[];

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi I'm Sharkbling an AI assistant. How can I help you today?  ",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatSwapResponse = (responseText: string) => {
    if (responseText.includes("swap")) {
      try {
        // Assume data from API or backend is in swap format
        const swapData = JSON.parse(responseText);

        // Get information from response
        const {
          fromToken,
          toToken,
          exchangeRate,
          priceImpact,
          recommendation,
        } = swapData;

        // Build a better formatted response
        let formattedResponse = `🔄 **Swap Information**\n\n`;
        formattedResponse += `🪙 **From Token:** ${fromToken.name} (${fromToken.symbol})\n`;
        formattedResponse += `💰 **To Token:** ${toToken.name} (${toToken.symbol})\n`;
        formattedResponse += `💱 **Exchange Rate:** 1 ${fromToken.symbol} = ${exchangeRate} ${toToken.symbol}\n`;
        formattedResponse += `📉 **Price Impact:** ${priceImpact}%\n`;
        formattedResponse += `📝 **Recommendation:** ${recommendation}\n\n`;

        return formattedResponse;
      } catch (error) {
        console.error("Error parsing swap data:", error);
        return responseText;
      }
    }
    return responseText;
  };
  // Format wallet balance response
  const formatWalletBalance = (responseText: string) => {
    if (responseText.includes("Your wallet balance:")) {
      try {
        const jsonStr = responseText.replace("Your wallet balance: ", "");
        const balances: TokenBalance[] = JSON.parse(jsonStr);

        let formattedResponse = `💼 **Your Wallet Overview**\n\n`;
        balances.forEach((token) => {
          formattedResponse += `🪙 **${token.name} (${token.symbol})**\n`;
          formattedResponse += ` • Balance: ${token.balance} ${token.symbol}\n\n`;
        });

        const totalUSD = balances
          .map((t) => parseFloat(t.balance)) // fallback if no USD value
          .reduce((a, b) => a + b, 0)
          .toFixed(2);

        formattedResponse += `📊 **Estimated Total (raw balance):** ${totalUSD} tokens\n`;

        return formattedResponse;
      } catch (error) {
        console.error("Error parsing wallet balance:", error);
        return responseText;
      }
    }
    return responseText;
  };

  // Format token trends response
  const formatTokenTrends = (responseText: string) => {
    if (responseText.includes('{"network":')) {
      try {
        const data: TokenTrendsResponse = JSON.parse(responseText);
        const date = new Date(data.timestamp);

        let formattedResponse = `📈 **Trending Tokens on ${data.network.toUpperCase()}**\n`;
        formattedResponse += `🕒 ${date.toLocaleDateString()} ${date.toLocaleTimeString()}\n\n`;

        data.tokens.forEach((token: TokenData) => {
          const emoji =
            token.sentiment === "positive"
              ? "🟢"
              : token.sentiment === "negative"
              ? "🔴"
              : "⚪";

          formattedResponse += `${emoji} **${token.name} (${token.symbol})** — ${token.mentionPercentage}% mentions\n`;
        });

        return formattedResponse;
      } catch (error) {
        console.error("Error parsing token trends:", error);
        return responseText;
      }
    }
    return responseText;
  };
  const formatSuggestBet = (responseText: string | any) => {
    // Try to parse the string if it's a JSON string
    if (typeof responseText === 'string' && responseText.trim().startsWith('{')) {
      try {
        responseText = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse JSON string:", e);
      }
    }
    
    // If it's an object (either originally or after parsing)
    if (typeof responseText === 'object' && responseText !== null) {
      // Check if it's a transaction response with digest (success case)
      if (responseText.success && responseText.digest) {
        let formattedResponse = `✅ **Transaction Successful**\n\n`;
        formattedResponse += `🔗 **Transaction ID:** ${responseText.digest}\n`;
        
        // Add explorer link with proper formatting
        if (responseText.explorerUrl) {
          formattedResponse += `🌐 **Explorer URL:** [View on Explorer](${responseText.explorerUrl})\n`;
        }
        
        // Add sender with shortened address for better readability
        if (responseText.sender) {
          const shortAddress = responseText.sender.substring(0, 8) + '...' + 
                              responseText.sender.substring(responseText.sender.length - 8);
          formattedResponse += `👤 **Sender:** ${shortAddress}\n`;
        }
        
        formattedResponse += `\n🕒 **Time:** ${new Date().toLocaleString()}\n`;
        return formattedResponse;
      }
      
      // Check if it's a swap response
      if (responseText.input && responseText.output) {
        let formattedResponse = `🔄 **Swap Information**\n\n`;
        
        // Extract token information safely
        const fromToken = responseText.input || {};
        const toToken = responseText.output || {};
        
        formattedResponse += `🪙 **From Token:** ${fromToken.name || fromToken.coinType || 'SUI'}\n`;
        formattedResponse += `💰 **To Token:** ${toToken.name || toToken.coinType || 'WAL'}\n`;
        
        // Format amounts
        const amountIn = responseText.amountIn ? 
          (typeof responseText.amountIn === 'object' ? 
            responseText.amountIn.toString() : responseText.amountIn) : '0';
        
        const amountOut = responseText.amountOut || '0';
        
        // Convert from smallest units (MIST) to SUI (1 SUI = 1,000,000,000 MIST)
        const amountInSUI = parseFloat(amountIn) / 1000000000;
        const amountOutToken = parseFloat(amountOut) / 1000000000;
        
        formattedResponse += `💱 **Amount In:** ${amountInSUI.toFixed(6)} SUI\n`;
        formattedResponse += `💱 **Amount Out:** ${amountOutToken.toFixed(6)} WAL\n`;
        
        if (responseText.slippage) {
          const slippagePercent = (responseText.slippage / 10000).toFixed(2);
          formattedResponse += `📉 **Slippage Tolerance:** ${slippagePercent}%\n`;
        }
        
        return formattedResponse;
      }
      
      // If it's some other object, return a generic message
      return "Request processed successfully.";
    }
    
    // Original string parsing logic
    if (typeof responseText === 'string') {
      const betGroups: BetGroup[] = [];
      const groups = responseText.split(/\d+\.\s*\n/).filter(Boolean);

      for (const group of groups) {
        try {
          const parsed = JSON.parse(group.trim());
          if (Array.isArray(parsed)) {
            betGroups.push(parsed);
          }
        } catch (e) {
          console.error("Failed to parse bet group:", e);
        }
      }

      if (betGroups.length === 0) return responseText;

      let formattedResponse = `🎯 **Speculative Bet Scenarios**\n\n`;
      
      betGroups.forEach((group, groupIndex) => {
        group.slice(groupIndex === 0 ? 1 : 0).forEach((bet, i) => {
          formattedResponse += `**${i + 1}. ${bet.title}**\n`;
          formattedResponse += ` ${bet.description}\n\n`;
        });
      });

      return formattedResponse;
    }
    
    // If all else fails, return the input
    return String(responseText);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

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
        }
      );

      // Format the response based on content type
      let formattedResponse = response.data.data.response;
      formattedResponse = formatWalletBalance(formattedResponse);
      formattedResponse = formatTokenTrends(formattedResponse);
      formattedResponse = formatSwapResponse(formattedResponse);
      formattedResponse = formatSuggestBet(formattedResponse);

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
          "Sorry an error occurred while processing your request. Please try again later.",
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
      // Check for markdown links [text](url)
      if (line.includes("[") && line.includes("](") && line.includes(")")) {
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        const parts = [];
        let lastIndex = 0;
        let match;
        
        // Create a copy of the line to work with
        let remainingLine = line;
        
        while ((match = linkRegex.exec(line)) !== null) {
          // Add text before the link
          const beforeLink = line.substring(lastIndex, match.index);
          if (beforeLink) {
            parts.push(<span key={`${index}-text-${lastIndex}`}>{beforeLink}</span>);
          }
          
          // Add the link
          const linkText = match[1];
          const linkUrl = match[2];
          parts.push(
            <a 
              key={`${index}-link-${match.index}`}
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:underline"
            >
              {linkText}
            </a>
          );
          
          lastIndex = match.index + match[0].length;
        }
        
        // Add any remaining text after the last link
        if (lastIndex < line.length) {
          parts.push(
            <span key={`${index}-text-end`}>
              {line.substring(lastIndex)}
            </span>
          );
        }
        
        return <p key={index}>{parts}</p>;
      }
      
      // Check for bold text (wrapped in **)
      else if (line.startsWith("**") && line.endsWith("**")) {
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

  return (
    <div className="flex flex-col h-[600px] border rounded-xl overflow-hidden bg-white">
      <div className="p-4 border-b bg-primary-500 text-white">
        <h2 className="text-xl font-bold">SharkBling AI</h2>
        <p className="text-sm opacity-80">AI Assistant</p>
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
                {msg.sender === "user" && (
                  <div className="flex items-center justify-end gap-2 mb-1">
                    <span className="text-xs font-medium">You</span>
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
            placeholder="Type your message..."
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
