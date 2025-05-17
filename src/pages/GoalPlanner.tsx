
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Progress } from "@/components/ui/progress";

const GoalPlanner = () => {
  const [goalName, setGoalName] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [targetYear, setTargetYear] = useState("");
  const [monthlyInvestment, setMonthlyInvestment] = useState<number[]>([10000]);
  const [expectedReturn, setExpectedReturn] = useState<number[]>([8]);
  const [showResults, setShowResults] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [canAchieve, setCanAchieve] = useState(false);
  const [achievementYear, setAchievementYear] = useState<number | null>(null);
  const [finalAmount, setFinalAmount] = useState(0);

  // Calculate results using compound interest
  const calculateResults = () => {
    if (!goalName || !goalAmount || !targetYear) {
      toast.error("Please fill in all fields");
      return;
    }

    const principal = monthlyInvestment[0];
    const rateDecimal = expectedReturn[0] / 100;
    const currentYear = new Date().getFullYear();
    const yearsToTarget = parseInt(targetYear) - currentYear;
    
    if (yearsToTarget <= 0) {
      toast.error("Target year must be in the future");
      return;
    }

    // Calculate future value with monthly compounding
    const months = yearsToTarget * 12;
    const monthlyRate = rateDecimal / 12;
    const futureValue = principal * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);

    const goalAmountNum = parseFloat(goalAmount);
    const canReachGoal = futureValue >= goalAmountNum;
    setCanAchieve(canReachGoal);
    setFinalAmount(Math.round(futureValue));
    
    // If can't reach goal in target year, calculate when they can
    if (!canReachGoal) {
      // Calculate how many months needed to reach goal
      const monthsNeeded = Math.log(goalAmountNum * monthlyRate / principal + 1) / Math.log(1 + monthlyRate);
      const yearsNeeded = Math.ceil(monthsNeeded / 12);
      setAchievementYear(currentYear + yearsNeeded);
    } else {
      setAchievementYear(parseInt(targetYear));
    }

    // Generate chart data
    const data = [];
    let accumulated = 0;
    for (let year = 0; year <= yearsToTarget; year++) {
      const currentYear = new Date().getFullYear() + year;
      const months = year * 12;
      if (months === 0) {
        accumulated = 0;
      } else {
        accumulated = principal * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
      }
      
      data.push({
        year: currentYear,
        value: Math.round(accumulated),
      });
    }
    
    setChartData(data);
    setShowResults(true);
  };

  // Format currency
  const formatCurrency = (amount: number | string) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(typeof amount === "string" ? parseFloat(amount) || 0 : amount);
  };

  // Generate year options from current year to 2035
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let year = currentYear + 1; year <= 2035; year++) {
    yearOptions.push(year.toString());
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Goal Planner</h1>
        <p className="text-muted-foreground">Calculate how to achieve your financial goals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create Your Financial Goal</CardTitle>
            <CardDescription>Set a target and we'll help you plan how to achieve it</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="goal-name">What do you want to buy?</Label>
              <Input
                id="goal-name"
                placeholder="e.g., Car, House, Vacation"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="goal-amount">Budget (₹)</Label>
              <Input
                id="goal-amount"
                type="number"
                placeholder="e.g., 500000"
                value={goalAmount}
                onChange={(e) => setGoalAmount(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="target-year">Target Year to Buy</Label>
              <Select value={targetYear} onValueChange={setTargetYear}>
                <SelectTrigger id="target-year">
                  <SelectValue placeholder="Select a target year" />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Monthly Investment (₹)</Label>
                  <span className="text-sm font-medium">{formatCurrency(monthlyInvestment[0])}</span>
                </div>
                <Slider
                  value={monthlyInvestment}
                  min={1000}
                  max={50000}
                  step={1000}
                  onValueChange={setMonthlyInvestment}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>₹1,000</span>
                  <span>₹50,000</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Expected Annual Return (%)</Label>
                  <span className="text-sm font-medium">{expectedReturn[0]}%</span>
                </div>
                <Slider
                  value={expectedReturn}
                  min={5}
                  max={15}
                  step={0.5}
                  onValueChange={setExpectedReturn}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>5%</span>
                  <span>15%</span>
                </div>
              </div>
            </div>
            
            <Button 
              className="w-full bg-finance-primary hover:bg-finance-primary/90"
              onClick={calculateResults}
            >
              Calculate
            </Button>
          </CardContent>
        </Card>
        
        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>Your Investment Projection</CardTitle>
            <CardDescription>See how your investment will grow over time</CardDescription>
          </CardHeader>
          <CardContent>
            {showResults ? (
              <div className="space-y-6">
                <div className="p-4 rounded-lg border">
                  <h3 className="font-semibold text-lg mb-1">
                    {canAchieve
                      ? `Congratulations! You can achieve your goal.`
                      : `You'll need more time or money to achieve your goal.`}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {canAchieve
                      ? `If you invest ${formatCurrency(monthlyInvestment[0])} monthly at ${expectedReturn[0]}% annual return, you can afford ${goalName} by ${targetYear}.`
                      : `With your current plan, you'll reach your goal by ${achievementYear}. Consider increasing your monthly investment.`}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress to goal:</span>
                      <span className="font-medium">
                        {formatCurrency(finalAmount)} / {formatCurrency(goalAmount)}
                      </span>
                    </div>
                    <Progress 
                      value={Math.min(100, (finalAmount / parseFloat(goalAmount || "0")) * 100)} 
                      className="h-2"
                    />
                  </div>
                </div>
                
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{
                        top: 5,
                        right: 10,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="year" 
                        tickFormatter={(tick) => tick.toString().substring(2)}
                      />
                      <YAxis 
                        tickFormatter={(tick) => (
                          new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                            notation: "compact",
                            maximumFractionDigits: 1
                          }).format(tick)
                        )}
                      />
                      <Tooltip
                        formatter={(value) => [formatCurrency(value), "Accumulated"]}
                        labelFormatter={(label) => `Year: ${label}`}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        name="Accumulated Value"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Investment Summary</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="text-gray-500">Total Investment</div>
                      <div className="font-medium">
                        {formatCurrency(monthlyInvestment[0] * 12 * (parseInt(targetYear) - currentYear))}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="text-gray-500">Returns Generated</div>
                      <div className="font-medium text-green-600">
                        {formatCurrency(finalAmount - (monthlyInvestment[0] * 12 * (parseInt(targetYear) - currentYear)))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowResults(false)}
                >
                  Recalculate
                </Button>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="mb-4">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="text-finance-primary"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4" />
                      <path d="M12 8h.01" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-medium mb-2">No projection yet</h3>
                <p className="text-muted-foreground mb-4">
                  Fill in your goal details and click Calculate to see your investment projection.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Tips Section */}
      <Card>
        <CardHeader>
          <CardTitle>Investment Tips</CardTitle>
          <CardDescription>Maximize your investment success with these strategies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Start Early</h3>
              <p className="text-sm text-gray-500">
                The earlier you start investing, the more time your money has to grow through compound interest.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Diversify Your Portfolio</h3>
              <p className="text-sm text-gray-500">
                Spread your investments across different asset classes to reduce risk and potentially increase returns.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Consistency is Key</h3>
              <p className="text-sm text-gray-500">
                Regular investments, even in small amounts, can lead to significant wealth over time through dollar-cost averaging.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalPlanner;
