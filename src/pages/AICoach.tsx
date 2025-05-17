
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

// Sample AI responses based on keywords
const aiResponses: Record<string, string> = {
  retirement: "To retire comfortably by 50, you should aim to have savings of at least 25-30 times your annual expenses. Start by maximizing your retirement contributions early, diversify your investments, and consider a mix of equity and debt funds based on your risk tolerance. Creating additional passive income streams can also help you reach your goal faster.",
  loan: "Taking a loan now could impact your long-term financial goals. Consider factors like interest rates, loan tenure, and how the EMIs will affect your monthly cash flow. As a rule of thumb, your total EMIs shouldn't exceed 40% of your monthly income. Also, evaluate whether the loan is for an appreciating asset (like property) or a depreciating one (like a vehicle).",
  tax: "Some effective tax-saving strategies include: 1) Maximizing your 80C investments (up to ₹1.5 lakhs) through ELSS funds, PPF, or NPS. 2) Utilizing the ₹50,000 additional NPS benefit under 80CCD(1B). 3) Claiming deductions for health insurance premiums under 80D. 4) If applicable, using the new tax regime might be beneficial depending on your income structure.",
  invest: "For beginners, I recommend starting with: 1) Build an emergency fund covering 6 months of expenses in a high-yield savings account. 2) Invest in index funds for equity exposure. 3) Consider tax-saving ELSS funds if you haven't exhausted your 80C limit. 4) For debt allocation, look at government bonds or high-rated corporate bond funds. Start with a 70:30 or 60:40 equity to debt ratio if you're young.",
  budget: "The 50/30/20 budgeting rule is a good starting point: allocate 50% of your income to needs (rent, groceries, bills), 30% to wants (entertainment, dining), and 20% to savings and debt repayment. Track your expenses using a budgeting app, identify areas to cut back, and automate your savings to ensure consistency.",
  default: "I'm your AI Financial Coach. I can help with retirement planning, investment strategies, tax optimization, budgeting, or any other financial questions you have. Feel free to ask me anything!"
};

// Suggested questions for the user
const suggestedQuestions = [
  "How much should I save to retire by 50?",
  "What's the impact of taking a loan now?",
  "What are tax-saving strategies?",
  "How should I start investing?",
  "Help me create a budget"
];

const AICoach = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with a welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: "welcome",
      content: "Hello! I'm your AI Financial Coach. How can I help you today?",
      sender: "ai",
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to determine AI response based on user input
  const getAIResponse = (userMessage: string): string => {
    const lowerCaseMessage = userMessage.toLowerCase();
    
    if (lowerCaseMessage.includes("retire") || lowerCaseMessage.includes("retirement")) {
      return aiResponses.retirement;
    } else if (lowerCaseMessage.includes("loan") || lowerCaseMessage.includes("borrow") || lowerCaseMessage.includes("debt")) {
      return aiResponses.loan;
    } else if (lowerCaseMessage.includes("tax")) {
      return aiResponses.tax;
    } else if (lowerCaseMessage.includes("invest") || lowerCaseMessage.includes("investment")) {
      return aiResponses.invest;
    } else if (lowerCaseMessage.includes("budget") || lowerCaseMessage.includes("spending") || lowerCaseMessage.includes("save money")) {
      return aiResponses.budget;
    } else {
      return aiResponses.default;
    }
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputMessage,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);
    
    // Simulate AI thinking and responding
    setTimeout(() => {
      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        content: getAIResponse(inputMessage),
        sender: "ai",
        timestamp: new Date()
      };
      
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500); // Simulate AI thinking time
  };

  // Handle suggested question click
  const handleSuggestedQuestion = (question: string) => {
    setInputMessage(question);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Financial Coach</h1>
        <p className="text-muted-foreground">Get personalized financial advice and guidance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chat Window */}
        <Card className="md:col-span-2">
          <CardHeader className="border-b">
            <CardTitle>Financial Advisor Chat</CardTitle>
            <CardDescription>Ask me anything about your finances</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col h-[calc(70vh-8rem)]">
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="flex flex-col">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`chat-bubble ${
                        message.sender === "user" ? "chat-bubble-user" : "chat-bubble-ai"
                      }`}
                    >
                      <div className="mb-1">
                        <p>{message.content}</p>
                      </div>
                      <div className="text-xs opacity-70 text-right">
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="chat-bubble chat-bubble-ai">
                      <span className="typing-indicator">Thinking</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              
              {/* Input Area */}
              <div className="border-t p-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex space-x-2"
                >
                  <Input
                    placeholder="Type your financial question..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    disabled={isTyping}
                    className="flex-1"
                  />
                  <Button 
                    type="submit" 
                    size="icon"
                    disabled={isTyping || !inputMessage.trim()} 
                    className="bg-finance-primary hover:bg-finance-primary/90"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Suggestions and Info */}
        <Card>
          <CardHeader>
            <CardTitle>Suggested Questions</CardTitle>
            <CardDescription>Not sure what to ask? Try these questions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {suggestedQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start text-left h-auto py-2 px-3"
                onClick={() => handleSuggestedQuestion(question)}
              >
                {question}
              </Button>
            ))}
            
            <div className="border-t pt-4 mt-6">
              <h3 className="font-medium mb-2">About AI Financial Coach</h3>
              <p className="text-sm text-gray-500 mb-4">
                Our AI coach provides personalized financial guidance based on best practices and 
                common financial principles. While the advice is helpful, consider consulting a 
                professional financial advisor for complex financial decisions.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => toast.success("Your chat has been saved")}
              >
                Save This Conversation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AICoach;
