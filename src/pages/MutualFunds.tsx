import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { ArrowUpRight, Info, TrendingUp, AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import EnhancedSlider from "@/components/EnhancedSlider";

interface MutualFund {
  id: string;
  name: string;
  category: string;
  riskProfile: "Low" | "Medium" | "High";
  threeYearReturn: number;
  fiveYearReturn: number;
  aum: number; // Assets Under Management in crores
  expenseRatio: number;
  recommendation: string;
}

// Mock mutual fund data
const mutualFundData: MutualFund[] = [
  {
    id: "1",
    name: "Blue Chip Equity Fund",
    category: "Large Cap Equity",
    riskProfile: "Medium",
    threeYearReturn: 14.5,
    fiveYearReturn: 12.8,
    aum: 24500,
    expenseRatio: 1.2,
    recommendation: "This fund invests in established blue-chip companies with strong track records, making it suitable for your medium risk profile and long-term goals."
  },
  {
    id: "2",
    name: "Fixed Income Securities Fund",
    category: "Debt Fund",
    riskProfile: "Low",
    threeYearReturn: 7.2,
    fiveYearReturn: 8.1,
    aum: 15200,
    expenseRatio: 0.6,
    recommendation: "A stable debt fund that offers steady returns with minimal volatility. Ideal for conservative investors or those nearing their financial goals."
  },
  {
    id: "3",
    name: "Growth Opportunities Fund",
    category: "Mid & Small Cap",
    riskProfile: "High",
    threeYearReturn: 18.9,
    fiveYearReturn: 16.2,
    aum: 8900,
    expenseRatio: 1.8,
    recommendation: "This fund targets high-growth potential companies, offering potentially higher returns but with increased volatility. Suitable for aggressive investors with a long time horizon."
  },
  {
    id: "4",
    name: "Balanced Advantage Fund",
    category: "Hybrid",
    riskProfile: "Medium",
    threeYearReturn: 11.5,
    fiveYearReturn: 10.8,
    aum: 12500,
    expenseRatio: 1.4,
    recommendation: "A dynamic asset allocation fund that adjusts equity and debt exposure based on market conditions, providing a good balance of growth and stability."
  },
  {
    id: "5",
    name: "Index Fund - Nifty 50",
    category: "Index Fund",
    riskProfile: "Medium",
    threeYearReturn: 13.2,
    fiveYearReturn: 11.5,
    aum: 18700,
    expenseRatio: 0.3,
    recommendation: "A low-cost way to track the Nifty 50 index, offering market returns with minimal expense ratio. Good for passive investors looking for long-term equity exposure."
  },
  {
    id: "6",
    name: "Tax Saver Fund",
    category: "ELSS",
    riskProfile: "Medium",
    threeYearReturn: 15.8,
    fiveYearReturn: 13.5,
    aum: 9800,
    expenseRatio: 1.5,
    recommendation: "An equity-linked savings scheme offering tax benefits under Section 80C with a 3-year lock-in period. Good for tax planning while building wealth."
  },
  {
    id: "7",
    name: "Short-Term Debt Fund",
    category: "Debt Fund",
    riskProfile: "Low",
    threeYearReturn: 6.5,
    fiveYearReturn: 7.2,
    aum: 7500,
    expenseRatio: 0.5,
    recommendation: "Invests in short-term debt instruments, offering stability and liquidity. Suitable for parking funds for 1-3 years with minimal risk."
  },
  {
    id: "8",
    name: "Small Cap Opportunities Fund",
    category: "Small Cap",
    riskProfile: "High",
    threeYearReturn: 21.5,
    fiveYearReturn: 17.8,
    aum: 5200,
    expenseRatio: 1.9,
    recommendation: "Focuses on small-cap companies with high growth potential. Highly volatile but offers potential for substantial returns over long time periods."
  },
  {
    id: "9",
    name: "Corporate Bond Fund",
    category: "Debt Fund",
    riskProfile: "Low",
    threeYearReturn: 8.1,
    fiveYearReturn: 8.8,
    aum: 11200,
    expenseRatio: 0.7,
    recommendation: "Invests primarily in high-quality corporate bonds, offering better returns than government securities with marginally higher risk."
  }
];

const MutualFunds = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number[]>([5000]);
  const [riskProfile, setRiskProfile] = useState<string>("Medium");
  const [expectedReturn, setExpectedReturn] = useState<number[]>([12]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendedFunds, setRecommendedFunds] = useState<MutualFund[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Function to recommend funds based on user input
  const generateRecommendations = () => {
    // Filter funds based on risk profile
    let filtered = mutualFundData.filter(fund => {
      if (riskProfile === "Low") {
        return fund.riskProfile === "Low";
      } else if (riskProfile === "Medium") {
        return fund.riskProfile === "Low" || fund.riskProfile === "Medium";
      } else {
        return true; // For high risk, include all
      }
    });
    
    // Sort by 5-year return (descending)
    filtered.sort((a, b) => b.fiveYearReturn - a.fiveYearReturn);
    
    // Take top recommendations
    const recommendations = filtered.slice(0, 5);
    
    setRecommendedFunds(recommendations);
    setShowRecommendations(true);
    toast.success("Recommendations generated based on your profile");
  };
  
  // Filter funds based on active tab
  const getFilteredFunds = () => {
    if (activeTab === "all") {
      return recommendedFunds;
    }
    return recommendedFunds.filter(fund => {
      if (activeTab === "equity") {
        return fund.category.includes("Equity") || fund.category.includes("Cap") || fund.category === "ELSS";
      } else if (activeTab === "debt") {
        return fund.category.includes("Debt");
      } else if (activeTab === "hybrid") {
        return fund.category.includes("Hybrid") || fund.category.includes("Balanced");
      }
      return true;
    });
  };

  // Calculate future value for SIP
  const calculateSIP = (monthly: number, years: number, ratePercentage: number) => {
    const monthlyRate = ratePercentage / 100 / 12;
    const months = years * 12;
    const futureValue = monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    return Math.round(futureValue);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mutual Fund Recommendations</h1>
        <p className="text-muted-foreground">Get personalized mutual fund suggestions based on your investment profile.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Your Investment Profile</CardTitle>
            <CardDescription>Tell us about your investment preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Monthly Investment Amount (₹)</Label>
                  <span className="text-sm font-medium">{formatCurrency(monthlyInvestment[0])}</span>
                </div>
                <EnhancedSlider
                  value={monthlyInvestment}
                  min={1000}
                  max={50000}
                  step={1000}
                  onValueChange={(value) => setMonthlyInvestment(Array.isArray(value) ? value : [value])}
                  inputPrefix="₹"
                  formatValue={(val) => `₹${val.toLocaleString()}`}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="risk-profile">Risk Profile</Label>
                <Select value={riskProfile} onValueChange={setRiskProfile}>
                  <SelectTrigger id="risk-profile">
                    <SelectValue placeholder="Select your risk tolerance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Conservative (Low Risk)</SelectItem>
                    <SelectItem value="Medium">Moderate (Medium Risk)</SelectItem>
                    <SelectItem value="High">Aggressive (High Risk)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  {riskProfile === "Low" 
                    ? "Safety-focused with stable returns" 
                    : riskProfile === "Medium" 
                    ? "Balanced approach with moderate risk" 
                    : "Growth-focused with higher volatility"}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Expected Annual Return (%)</Label>
                  <span className="text-sm font-medium">{expectedReturn[0]}%</span>
                </div>
                <EnhancedSlider
                  value={expectedReturn}
                  min={6}
                  max={18}
                  step={0.5}
                  onValueChange={(value) => setExpectedReturn(Array.isArray(value) ? value : [value])}
                  formatValue={(val) => `${val}%`}
                />
              </div>
            </div>
            
            <Button 
              className="w-full bg-finance-primary hover:bg-finance-primary/90"
              onClick={generateRecommendations}
            >
              Get Recommendations
            </Button>
          </CardContent>
        </Card>
        
        {/* Investment Projection */}
        <Card>
          <CardHeader>
            <CardTitle>Your Investment Growth</CardTitle>
            <CardDescription>Projected returns over different time periods</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {showRecommendations ? (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-xs text-gray-500 mb-1">5 Years</div>
                    <div className="text-xl font-bold text-finance-primary">
                      {formatCurrency(calculateSIP(monthlyInvestment[0], 5, expectedReturn[0]))}
                    </div>
                    <div className="text-xs text-gray-500">Total Investment: {formatCurrency(monthlyInvestment[0] * 12 * 5)}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-xs text-gray-500 mb-1">10 Years</div>
                    <div className="text-xl font-bold text-finance-primary">
                      {formatCurrency(calculateSIP(monthlyInvestment[0], 10, expectedReturn[0]))}
                    </div>
                    <div className="text-xs text-gray-500">Total Investment: {formatCurrency(monthlyInvestment[0] * 12 * 10)}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-xs text-gray-500 mb-1">20 Years</div>
                    <div className="text-xl font-bold text-finance-primary">
                      {formatCurrency(calculateSIP(monthlyInvestment[0], 20, expectedReturn[0]))}
                    </div>
                    <div className="text-xs text-gray-500">Total Investment: {formatCurrency(monthlyInvestment[0] * 12 * 20)}</div>
                  </div>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex gap-2 items-start">
                    <Info className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-amber-800 mb-1">Investment Strategy</h4>
                      <p className="text-sm text-amber-700">
                        {riskProfile === "Low"
                          ? "Your conservative profile suggests a portfolio with 20-30% in equity funds and 70-80% in debt funds."
                          : riskProfile === "Medium"
                          ? "Your moderate profile suggests a balanced portfolio with 50-60% in equity funds and 40-50% in debt funds."
                          : "Your aggressive profile suggests a growth-oriented portfolio with 70-80% in equity funds and 20-30% in debt funds."}
                      </p>
                    </div>
                  </div>
                </div>
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
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-medium mb-2">No projection yet</h3>
                <p className="text-muted-foreground mb-4">
                  Fill in your investment details and click Get Recommendations to see your projected returns.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Fund Recommendations */}
      {showRecommendations && (
        <Card>
          <CardHeader>
            <CardTitle>Recommended Funds</CardTitle>
            <CardDescription>Funds that match your risk profile and investment goals</CardDescription>
            <Tabs defaultValue="all" className="mt-2" value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All Funds</TabsTrigger>
                <TabsTrigger value="equity">Equity</TabsTrigger>
                <TabsTrigger value="debt">Debt</TabsTrigger>
                <TabsTrigger value="hybrid">Hybrid</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getFilteredFunds().map((fund) => (
                <div key={fund.id} className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-3 border-b">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{fund.name}</h3>
                        <p className="text-xs text-gray-500">{fund.category}</p>
                      </div>
                      <div 
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          fund.riskProfile === "Low" 
                            ? "bg-green-100 text-green-800" 
                            : fund.riskProfile === "Medium" 
                            ? "bg-yellow-100 text-yellow-800" 
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {fund.riskProfile} Risk
                      </div>
                    </div>
                  </div>
                  <div className="p-3 space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">3Y Returns</p>
                        <p className={`font-medium ${fund.threeYearReturn > 10 ? "text-green-600" : "text-amber-600"}`}>
                          {fund.threeYearReturn}%
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">5Y Returns</p>
                        <p className={`font-medium ${fund.fiveYearReturn > 10 ? "text-green-600" : "text-amber-600"}`}>
                          {fund.fiveYearReturn}%
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">AUM</p>
                        <p className="font-medium">₹{(fund.aum / 1000).toFixed(1)}K Cr</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Expense Ratio</p>
                        <p className="font-medium">{fund.expenseRatio}%</p>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-600 pt-2 border-t">
                      <p><span className="font-medium">Why this fund:</span> {fund.recommendation}</p>
                    </div>
                    
                    
                  </div>
                </div>
              ))}
            </div>
            
            {getFilteredFunds().length === 0 && (
              <div className="text-center p-8 border rounded-lg">
                <AlertTriangle className="mx-auto h-8 w-8 text-amber-500 mb-2" />
                <h3 className="text-lg font-medium mb-1">No matching funds</h3>
                <p className="text-gray-500">
                  There are no {activeTab} funds that match your current filter criteria.
                </p>
              </div>
            )}
            
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <div className="flex gap-2 items-start">
                <Info className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium mb-1">Disclaimer</h4>
                  <p className="text-xs text-gray-500">
                    Past performance is not indicative of future results. Mutual fund investments are subject to market risks.
                    Please read all scheme-related documents carefully before investing. The recommendations provided are
                    for educational purposes only and not a substitute for professional financial advice.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MutualFunds;
