
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Target, MessageCircle, TrendingUp, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
}

interface MutualFund {
  id: string;
  name: string;
  category: string;
  returnRate: number;
  risk: "Low" | "Medium" | "High";
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [funds, setFunds] = useState<MutualFund[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading mock data
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock goals data
      setGoals([
        {
          id: "1",
          name: "New Car",
          targetAmount: 1200000,
          currentAmount: 450000,
          targetDate: "2025-12-31"
        },
        {
          id: "2",
          name: "Emergency Fund",
          targetAmount: 500000,
          currentAmount: 300000,
          targetDate: "2024-06-30"
        }
      ]);
      
      // Mock mutual funds data
      setFunds([
        {
          id: "1",
          name: "Blue Chip Equity Fund",
          category: "Equity",
          returnRate: 12.5,
          risk: "Medium"
        },
        {
          id: "2",
          name: "Fixed Income Fund",
          category: "Debt",
          returnRate: 8.2,
          risk: "Low"
        },
        {
          id: "3",
          name: "High Growth Fund",
          category: "Equity",
          returnRate: 15.8,
          risk: "High"
        }
      ]);
      
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:gap-8 animate-pulse">
        <div className="h-32 rounded-lg bg-gray-200"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="h-64 rounded-lg bg-gray-200"></div>
          <div className="h-64 rounded-lg bg-gray-200"></div>
          <div className="h-64 rounded-lg bg-gray-200"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      {/* Welcome Card */}
      <Card className="bg-gradient-to-r from-finance-primary to-finance-secondary text-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-2">Welcome to Your Financial Dashboard</h2>
              <p className="text-white/90 max-w-2xl">
                Track your goals, get AI-powered financial advice, and discover investment opportunities all in one place.
              </p>
            </div>
            <Button 
              className="mt-4 md:mt-0 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white"
              onClick={() => navigate("/goal-planner")}
            >
              <Target className="mr-2 h-4 w-4" /> Set New Goal
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Financial Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-finance-primary" /> 
              My Financial Goals
            </CardTitle>
            <CardDescription>Track your progress toward financial goals</CardDescription>
          </CardHeader>
          <CardContent>
            {goals.length > 0 ? (
              <div className="space-y-4">
                {goals.map((goal) => (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{goal.name}</span>
                      <span className="text-sm text-gray-500">
                        {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                      </span>
                    </div>
                    <Progress value={(goal.currentAmount / goal.targetAmount) * 100} />
                    <div className="text-xs text-gray-500">
                      Target date: {new Date(goal.targetDate).toLocaleDateString()}
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => navigate("/goal-planner")}
                >
                  View All Goals
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 mb-4">No goals set yet</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/goal-planner")}
                >
                  <Target className="mr-2 h-4 w-4" /> Create Goal
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Financial Coach */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-finance-primary" /> 
              AI Financial Coach
            </CardTitle>
            <CardDescription>Get personalized financial advice</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-sm italic">
                  "Based on your spending patterns, you could save an additional ₹5,000 per month by optimizing your utility bills and subscription services."
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Common questions:</p>
                <ul className="text-sm text-finance-primary space-y-1">
                  <li className="hover:underline cursor-pointer">
                    How can I improve my credit score?
                  </li>
                  <li className="hover:underline cursor-pointer">
                    What's the best way to pay off debt?
                  </li>
                  <li className="hover:underline cursor-pointer">
                    How much should I save for retirement?
                  </li>
                </ul>
              </div>
              <Button
                className="w-full bg-finance-primary hover:bg-finance-primary/90"
                onClick={() => navigate("/ai-coach")}
              >
                <MessageCircle className="mr-2 h-4 w-4" /> Chat with AI Coach
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recommended Mutual Funds */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-finance-primary" /> 
              Recommended Funds
            </CardTitle>
            <CardDescription>Top performing funds for your profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {funds.slice(0, 2).map((fund) => (
                <div key={fund.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{fund.name}</span>
                    <span className="text-green-600 font-medium">{fund.returnRate}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">{fund.category}</span>
                    <span 
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        fund.risk === "Low" 
                          ? "bg-green-100 text-green-800" 
                          : fund.risk === "Medium" 
                          ? "bg-yellow-100 text-yellow-800" 
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {fund.risk} Risk
                    </span>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/mutual-funds")}
              >
                <BarChart3 className="mr-2 h-4 w-4" /> View All Funds
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Risk Assessment */}
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" /> 
              Financial Health Check
            </CardTitle>
            <CardDescription>Quick assessment of your current financial health</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                  <h3 className="font-medium text-amber-800 mb-1">Emergency Fund</h3>
                  <p className="text-sm text-amber-600 mb-2">
                    Your emergency fund covers 4 months of expenses. Aim for 6+ months.
                  </p>
                  <Progress value={65} className="h-2 bg-amber-100" />
                </div>
                <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                  <h3 className="font-medium text-green-800 mb-1">Investment Allocation</h3>
                  <p className="text-sm text-green-600 mb-2">
                    Your investment portfolio is well-diversified across asset classes.
                  </p>
                  <Progress value={90} className="h-2 bg-green-100" />
                </div>
                <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                  <h3 className="font-medium text-red-800 mb-1">Debt-to-Income Ratio</h3>
                  <p className="text-sm text-red-600 mb-2">
                    Your debt payments exceed 35% of your monthly income.
                  </p>
                  <Progress value={40} className="h-2 bg-red-100" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
