
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { ArrowUpRight, Info, TrendingUp, Save, Target } from "lucide-react";
import { EnhancedSlider } from "@/components/EnhancedSlider";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => (currentYear + i).toString());

interface GoalCalculation {
  monthlyInvestment: number;
  targetYear: number;
  totalAmount: number;
  yearlyBreakdown: { year: number; amount: number }[];
  annualReturn: number;
  completed: boolean;
}

const GoalPlanner = () => {
  const { user } = useAuth();
  
  // Goal details
  const [goalName, setGoalName] = useState<string>("");
  const [goalBudget, setGoalBudget] = useState<string>("");
  const [targetYear, setTargetYear] = useState<string>(years[2]); // Default to 3 years from now
  const [monthlyInvestment, setMonthlyInvestment] = useState<number[]>([5000]);
  const [annualReturn, setAnnualReturn] = useState<number>(12);
  const [calculation, setCalculation] = useState<GoalCalculation | null>(null);
  const [savedGoals, setSavedGoals] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Load saved goals
  useEffect(() => {
    if (user) {
      loadSavedGoals();
    }
  }, [user]);

  const loadSavedGoals = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedGoals(data || []);
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  const saveGoal = async () => {
    if (!user || !calculation || !goalName || !goalBudget) {
      toast.error("Please complete the goal calculation first");
      return;
    }

    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('goals')
        .insert({
          user_id: user.id,
          name: goalName,
          target_amount: Number(goalBudget),
          current_amount: 0,
          target_date: `${targetYear}-12-31`,
          monthly_investment: calculation.monthlyInvestment,
          annual_return: calculation.annualReturn
        });

      if (error) throw error;

      // Track user activity
      await supabase
        .from('user_activity')
        .insert({
          user_id: user.id,
          activity_type: 'goal_created',
          activity_data: {
            goal_name: goalName,
            target_amount: Number(goalBudget),
            monthly_investment: calculation.monthlyInvestment,
            annual_return: calculation.annualReturn
          }
        });

      toast.success("Goal saved successfully!");
      loadSavedGoals();
      
      // Reset form
      setGoalName("");
      setGoalBudget("");
      setTargetYear(years[2]);
      setMonthlyInvestment([5000]);
      setAnnualReturn(12);
      setCalculation(null);
      
    } catch (error) {
      console.error('Error saving goal:', error);
      toast.error("Failed to save goal. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate goal progress
  const calculateGoal = () => {
    if (!goalName || !goalBudget || !targetYear) {
      toast.error("Please fill all required fields");
      return;
    }

    const budget = Number(goalBudget);
    const targetYearNum = Number(targetYear);
    const currentYearNum = currentYear;
    const yearsToGoal = targetYearNum - currentYearNum;
    const monthlyAmount = monthlyInvestment[0];
    const ratePercentage = annualReturn / 100;
    
    if (yearsToGoal <= 0) {
      toast.error("Please select a target year in the future");
      return;
    }

    // Calculate using compound interest formula: FV = P * [(1 + r)^n – 1] / r
    const monthlyRate = ratePercentage / 12;
    const totalMonths = yearsToGoal * 12;
    const futureValue = monthlyAmount * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);

    // Create yearly breakdown
    const yearlyBreakdown = [];
    for (let year = currentYearNum; year <= targetYearNum; year++) {
      const yearsElapsed = year - currentYearNum;
      const monthsElapsed = yearsElapsed * 12;
      const amountAtThisPoint = monthlyAmount * ((Math.pow(1 + monthlyRate, monthsElapsed) - 1) / monthlyRate) * (1 + monthlyRate);
      yearlyBreakdown.push({
        year,
        amount: Math.round(amountAtThisPoint)
      });
    }

    setCalculation({
      monthlyInvestment: monthlyAmount,
      targetYear: targetYearNum,
      totalAmount: Math.round(futureValue),
      yearlyBreakdown,
      annualReturn: annualReturn,
      completed: futureValue >= budget
    });

    toast.success("Goal calculation complete");
  };

  // Progress percentage
  const getProgressPercentage = () => {
    if (!calculation) return 0;
    const budget = Number(goalBudget);
    return Math.min(100, Math.round((calculation.totalAmount / budget) * 100));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Goal Planner</h1>
        <p className="text-muted-foreground">Plan your financial goals and track your progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Goal Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Your Goal Details</CardTitle>
            <CardDescription>Tell us what you want to save for</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goal-name">What do you want to buy?</Label>
                <Input 
                  id="goal-name" 
                  placeholder="e.g. Car, Laptop, Vacation" 
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="budget">Budget (₹)</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                  <Input 
                    id="budget" 
                    className="pl-6" 
                    type="number" 
                    placeholder="500000"
                    value={goalBudget}
                    onChange={(e) => setGoalBudget(e.target.value)} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="target-year">Target Year to Buy</Label>
                <Select value={targetYear} onValueChange={setTargetYear}>
                  <SelectTrigger id="target-year">
                    <SelectValue placeholder="Select target year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Monthly Investment (₹)</Label>
                  <span className="text-sm font-medium">{formatCurrency(monthlyInvestment[0])}</span>
                </div>
                <EnhancedSlider
                  min={1000}
                  max={50000}
                  step={500}
                  value={monthlyInvestment}
                  onValueChange={(value) => {
                    if (Array.isArray(value)) {
                      setMonthlyInvestment(value);
                    } else {
                      setMonthlyInvestment([value]);
                    }
                  }}
                  inputPrefix="₹"
                  formatValue={(val) => formatCurrency(val)}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Expected Annual Return (%)</Label>
                  <span className="text-sm font-medium">{annualReturn}%</span>
                </div>
                <EnhancedSlider
                  min={6}
                  max={18}
                  step={0.5}
                  value={[annualReturn]}
                  onValueChange={(value) => {
                    if (Array.isArray(value)) {
                      setAnnualReturn(value[0]);
                    } else {
                      setAnnualReturn(value);
                    }
                  }}
                />
              </div>
            </div>
            
            <Button 
              className="w-full bg-finance-primary hover:bg-finance-primary/90"
              onClick={calculateGoal}
            >
              Calculate Goal
            </Button>
          </CardContent>
        </Card>
        
        {/* Goal Projection */}
        <Card>
          <CardHeader>
            <CardTitle>Goal Projection</CardTitle>
            <CardDescription>See how your investments grow over time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {calculation ? (
              <div className="space-y-6">
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Investment Summary</h3>
                  <p className="text-sm mb-4">
                    {calculation.completed ? (
                      <span className="text-green-600">
                        If you invest {formatCurrency(calculation.monthlyInvestment)} monthly at {calculation.annualReturn}% annual return, 
                        you can afford <strong>{goalName}</strong> by {calculation.targetYear}.
                      </span>
                    ) : (
                      <span className="text-amber-600">
                        If you invest {formatCurrency(calculation.monthlyInvestment)} monthly at {calculation.annualReturn}% annual return, 
                        you will have {formatCurrency(calculation.totalAmount)} by {calculation.targetYear}, 
                        which is not enough to afford <strong>{goalName}</strong>.
                      </span>
                    )}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress toward goal:</span>
                      <span className={calculation.completed ? "text-green-600" : "text-amber-600"}>
                        {getProgressPercentage()}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${calculation.completed ? "bg-green-600" : "bg-amber-500"}`}
                        style={{ width: `${getProgressPercentage()}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Year-by-Year Breakdown</h3>
                  <div className="overflow-auto max-h-64">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="py-2 text-left">Year</th>
                          <th className="py-2 text-right">Total Savings</th>
                          <th className="py-2 text-right">Yearly Growth</th>
                        </tr>
                      </thead>
                      <tbody>
                        {calculation.yearlyBreakdown.map((yearData, index) => {
                          const prevAmount = index > 0 ? calculation.yearlyBreakdown[index - 1].amount : 0;
                          const growth = yearData.amount - prevAmount;
                          const yearlyInvestment = calculation.monthlyInvestment * 12;
                          const returns = index > 0 ? growth - yearlyInvestment : 0;
                          
                          return (
                            <tr key={yearData.year} className="border-b">
                              <td className="py-2">{yearData.year}</td>
                              <td className="py-2 text-right">{formatCurrency(yearData.amount)}</td>
                              <td className="py-2 text-right">
                                {index > 0 && (
                                  <div className="flex items-center justify-end">
                                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                                    {formatCurrency(returns)}
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-2 items-start">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-800 mb-1">Investment Tip</h4>
                      <p className="text-sm text-blue-700">
                        {calculation.completed 
                          ? "You're on track to meet your goal! Consider setting up an automatic monthly investment to stay consistent."
                          : `To meet your goal, try increasing your monthly investment to ${
                              formatCurrency(Math.ceil(calculation.monthlyInvestment * 1.25 / 500) * 500)
                            } or extending your timeline by 1-2 years.`
                        }
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Save Goal Button */}
                {user && (
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={saveGoal}
                    disabled={isSaving}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? "Saving..." : "Save Goal"}
                  </Button>
                )}
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
                      className="text-muted-foreground"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4" />
                      <path d="M12 8h.01" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-medium mb-2">No calculation yet</h3>
                <p className="text-muted-foreground mb-4">
                  Fill in your goal details and click Calculate Goal to see your investment projection.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Saved Goals Section */}
      {user && savedGoals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-finance-primary" />
              Your Saved Goals
            </CardTitle>
            <CardDescription>Track all your financial goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedGoals.map((goal) => (
                <div key={goal.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold">{goal.name}</h3>
                    <span className="text-xs text-muted-foreground">
                      {new Date(goal.target_date).getFullYear()}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Target:</span>
                      <span className="font-medium">{formatCurrency(goal.target_amount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Monthly Investment:</span>
                      <span className="text-finance-primary font-medium">
                        {formatCurrency(goal.monthly_investment)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Expected Return:</span>
                      <span className="text-green-600 font-medium">{goal.annual_return}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-finance-primary h-2 rounded-full"
                      style={{ width: `${Math.min(100, (goal.current_amount / goal.target_amount) * 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    {Math.round((goal.current_amount / goal.target_amount) * 100)}% Complete
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GoalPlanner;
