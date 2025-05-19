
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/sonner";
import { Progress } from "@/components/ui/progress";
import { Info, Calculator, FileText, TrendingDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface TaxDeduction {
  section: string;
  name: string;
  maxAmount: number;
  description: string;
  applicable: string[];
  lockInPeriod?: string;
  riskLevel?: "Low" | "Medium" | "High";
}

interface TaxSuggestion {
  section: string;
  title: string;
  description: string;
  savingAmount: number;
  priority: "High" | "Medium" | "Low";
  riskLevel?: "Low" | "Medium" | "High";
  lockInPeriod?: string;
}

// Mock data for tax deductions
const taxDeductions: TaxDeduction[] = [
  {
    section: "80C",
    name: "ELSS (Equity Linked Saving Scheme)",
    maxAmount: 150000,
    description: "Tax-saving mutual funds with potential for higher returns",
    applicable: ["Old Regime", "New Regime"],
    lockInPeriod: "3 years",
    riskLevel: "Medium"
  },
  {
    section: "80C",
    name: "PPF (Public Provident Fund)",
    maxAmount: 150000,
    description: "Government-backed long-term investment scheme",
    applicable: ["Old Regime", "New Regime"],
    lockInPeriod: "15 years",
    riskLevel: "Low"
  },
  {
    section: "80C",
    name: "NPS (National Pension System)",
    maxAmount: 150000,
    description: "Retirement savings scheme with tax benefits",
    applicable: ["Old Regime", "New Regime"],
    lockInPeriod: "Until retirement",
    riskLevel: "Medium"
  },
  {
    section: "80D",
    name: "Health Insurance Premium",
    maxAmount: 25000,
    description: "Premiums paid for health insurance policies",
    applicable: ["Old Regime", "New Regime"],
    riskLevel: "Low"
  },
  {
    section: "80CCD(1B)",
    name: "Additional NPS Contribution",
    maxAmount: 50000,
    description: "Additional contribution to NPS beyond 80C limit",
    applicable: ["Old Regime"],
    lockInPeriod: "Until retirement",
    riskLevel: "Medium"
  },
  {
    section: "80E",
    name: "Education Loan Interest",
    maxAmount: -1, // No limit
    description: "Interest paid on education loan for higher studies",
    applicable: ["Old Regime"],
    riskLevel: "Low"
  }
];

const TaxOptimizer = () => {
  const [annualIncome, setAnnualIncome] = useState<number>(1000000);
  const [currentDeductions, setCurrentDeductions] = useState<number>(0);
  const [employmentType, setEmploymentType] = useState<string>("Salaried");
  const [ageGroup, setAgeGroup] = useState<string>("Below 60");
  const [taxRegime, setTaxRegime] = useState<string>("Old Regime");
  const [investmentPreferences, setInvestmentPreferences] = useState<string[]>([]);
  const [taxBeforeOptimization, setTaxBeforeOptimization] = useState<number | null>(null);
  const [taxAfterOptimization, setTaxAfterOptimization] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<TaxSuggestion[]>([]);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Handle checkbox toggle
  const toggleInvestmentPreference = (preference: string) => {
    setInvestmentPreferences((prev) => 
      prev.includes(preference) 
        ? prev.filter(item => item !== preference) 
        : [...prev, preference]
    );
  };

  // Calculate tax based on income and regime (simplified for demo)
  const calculateTax = (income: number, regime: string, deductions: number = 0) => {
    let taxableIncome = income;
    
    if (regime === "Old Regime") {
      // Apply standard deduction for salaried employees
      if (employmentType === "Salaried") {
        taxableIncome -= 50000;
      }
      
      // Apply existing deductions
      taxableIncome -= deductions;
      
      // Minimum taxable income
      taxableIncome = Math.max(taxableIncome, 0);
    }
    
    // Simplified tax calculation
    let tax = 0;
    
    if (regime === "Old Regime") {
      if (taxableIncome <= 250000) {
        tax = 0;
      } else if (taxableIncome <= 500000) {
        tax = (taxableIncome - 250000) * 0.05;
      } else if (taxableIncome <= 1000000) {
        tax = 12500 + (taxableIncome - 500000) * 0.2;
      } else {
        tax = 112500 + (taxableIncome - 1000000) * 0.3;
      }
    } else {
      // New Regime (FY 2023-24)
      if (taxableIncome <= 300000) {
        tax = 0;
      } else if (taxableIncome <= 600000) {
        tax = (taxableIncome - 300000) * 0.05;
      } else if (taxableIncome <= 900000) {
        tax = 15000 + (taxableIncome - 600000) * 0.1;
      } else if (taxableIncome <= 1200000) {
        tax = 45000 + (taxableIncome - 900000) * 0.15;
      } else if (taxableIncome <= 1500000) {
        tax = 90000 + (taxableIncome - 1200000) * 0.2;
      } else {
        tax = 150000 + (taxableIncome - 1500000) * 0.3;
      }
    }
    
    // Add health and education cess (4%)
    tax = tax * 1.04;
    
    return Math.round(tax);
  };

  const generateTaxSuggestions = () => {
    if (!annualIncome) {
      toast.error("Please enter your annual income");
      return;
    }

    setIsCalculating(true);
    
    // Simulating API call delay
    setTimeout(() => {
      try {
        // Calculate tax before optimization
        const beforeTax = calculateTax(annualIncome, taxRegime, currentDeductions);
        setTaxBeforeOptimization(beforeTax);
        
        let suggestedDeductions: TaxSuggestion[] = [];
        let potentialSavings = 0;
        
        // Generate appropriate suggestions based on regime and income
        if (taxRegime === "Old Regime") {
          // Section 80C suggestions
          if (currentDeductions < 150000) {
            const remainingDeduction = 150000 - currentDeductions;
            suggestedDeductions.push({
              section: "80C",
              title: "Maximize Section 80C Investments",
              description: `Invest ₹${remainingDeduction.toLocaleString()} more in ELSS, PPF, or other 80C instruments to reach the maximum limit.`,
              savingAmount: Math.round(remainingDeduction * 0.3), // Assuming 30% tax bracket
              priority: "High",
              lockInPeriod: "Varies",
              riskLevel: "Low"
            });
            potentialSavings += remainingDeduction * 0.3;
          }
          
          // NPS additional deduction
          if (!currentDeductions || currentDeductions < 200000) {
            suggestedDeductions.push({
              section: "80CCD(1B)",
              title: "Additional NPS Investment",
              description: "Invest up to ₹50,000 in NPS to claim deduction under section 80CCD(1B), over and above the 80C limit.",
              savingAmount: 15000, // Assuming 30% tax bracket
              priority: "Medium",
              lockInPeriod: "Until retirement",
              riskLevel: "Medium"
            });
            potentialSavings += 15000;
          }
          
          // Health insurance suggestion
          if (employmentType === "Self-employed" || employmentType === "Freelancer") {
            suggestedDeductions.push({
              section: "80D",
              title: "Health Insurance Premium",
              description: "Purchase health insurance for yourself and family members to claim deduction up to ₹25,000 (₹50,000 for senior citizens).",
              savingAmount: 7500, // Assuming 30% tax bracket
              priority: "High",
              riskLevel: "Low"
            });
            potentialSavings += 7500;
          }
          
          // Home loan suggestion for high income
          if (annualIncome > 1500000) {
            suggestedDeductions.push({
              section: "24(b)",
              title: "Home Loan Interest Deduction",
              description: "If you're planning to buy a house, you can claim up to ₹2,00,000 as deduction on home loan interest under section 24(b).",
              savingAmount: 60000, // Assuming 30% tax bracket
              priority: "Medium",
              riskLevel: "Medium"
            });
            potentialSavings += 60000;
          }
        } else {
          // New regime has fewer deductions
          suggestedDeductions.push({
            section: "Tax Planning",
            title: "Compare Old vs New Regime",
            description: "The new tax regime offers lower tax rates but fewer deductions. Based on your profile, calculate taxes under both regimes before deciding.",
            savingAmount: Math.round(annualIncome * 0.02), // Rough estimate
            priority: "High",
            riskLevel: "Low"
          });
          
          if (employmentType === "Self-employed" || employmentType === "Freelancer") {
            suggestedDeductions.push({
              section: "Business Expenses",
              title: "Track Business Expenses",
              description: "As a self-employed individual, maintain proper records of all business expenses which can be claimed as deductions.",
              savingAmount: Math.round(annualIncome * 0.05), // Rough estimate
              priority: "High",
              riskLevel: "Low"
            });
            potentialSavings += annualIncome * 0.05;
          }
        }
        
        // Additional suggestions based on age
        if (ageGroup === "60-80" || ageGroup === "80+") {
          suggestedDeductions.push({
            section: "80D",
            title: "Enhanced Medical Benefits for Seniors",
            description: "Senior citizens can claim higher deduction for health insurance premiums and medical expenses.",
            savingAmount: 15000, // Rough estimate
            priority: "High",
            riskLevel: "Low"
          });
          potentialSavings += 15000;
        }
        
        // Sort by priority
        suggestedDeductions.sort((a, b) => {
          const priorityOrder = { "High": 0, "Medium": 1, "Low": 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
        
        // Calculate tax after optimization
        const afterTax = beforeTax - Math.round(potentialSavings);
        setTaxAfterOptimization(afterTax > 0 ? afterTax : 0);
        setSuggestions(suggestedDeductions);
        setShowResults(true);
        
        toast.success("Tax optimization suggestions generated successfully!");
      } catch (error) {
        console.error("Error generating tax suggestions:", error);
        toast.error("Failed to generate tax suggestions. Please try again.");
      } finally {
        setIsCalculating(false);
      }
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tax Optimizer</h1>
        <p className="text-muted-foreground">
          Get personalized tax-saving suggestions based on your income and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-finance-primary" />
              Your Tax Profile
            </CardTitle>
            <CardDescription>Enter your details to get personalized tax suggestions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="annual-income">Annual Income (₹)</Label>
              <Input
                id="annual-income"
                type="number"
                value={annualIncome}
                onChange={(e) => setAnnualIncome(parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="current-deductions">
                Current Deductions (₹) <span className="text-xs text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="current-deductions"
                type="number"
                value={currentDeductions}
                onChange={(e) => setCurrentDeductions(parseInt(e.target.value) || 0)}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">
                Enter deductions you've already claimed (80C, HRA, etc.)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="employment-type">Employment Type</Label>
              <Select value={employmentType} onValueChange={setEmploymentType}>
                <SelectTrigger id="employment-type">
                  <SelectValue placeholder="Select employment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Salaried">Salaried</SelectItem>
                  <SelectItem value="Self-employed">Self-employed</SelectItem>
                  <SelectItem value="Freelancer">Freelancer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="age-group">Age Group</Label>
              <Select value={ageGroup} onValueChange={setAgeGroup}>
                <SelectTrigger id="age-group">
                  <SelectValue placeholder="Select age group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Below 60">Below 60</SelectItem>
                  <SelectItem value="60-80">60 - 80</SelectItem>
                  <SelectItem value="80+">Above 80</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tax-regime">Tax Regime</Label>
              <Select value={taxRegime} onValueChange={setTaxRegime}>
                <SelectTrigger id="tax-regime">
                  <SelectValue placeholder="Select tax regime" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Old Regime">Old Regime</SelectItem>
                  <SelectItem value="New Regime">New Regime</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Old regime allows more deductions but has higher tax rates
              </p>
            </div>

            <div className="space-y-2">
              <Label>Investment Preferences</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="elss" 
                    checked={investmentPreferences.includes("ELSS")}
                    onCheckedChange={() => toggleInvestmentPreference("ELSS")}
                  />
                  <label htmlFor="elss" className="text-sm font-medium leading-none">
                    ELSS (Mutual Fund)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="ppf" 
                    checked={investmentPreferences.includes("PPF")}
                    onCheckedChange={() => toggleInvestmentPreference("PPF")}
                  />
                  <label htmlFor="ppf" className="text-sm font-medium leading-none">
                    PPF
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="nps" 
                    checked={investmentPreferences.includes("NPS")}
                    onCheckedChange={() => toggleInvestmentPreference("NPS")}
                  />
                  <label htmlFor="nps" className="text-sm font-medium leading-none">
                    NPS
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="insurance" 
                    checked={investmentPreferences.includes("Insurance")}
                    onCheckedChange={() => toggleInvestmentPreference("Insurance")}
                  />
                  <label htmlFor="insurance" className="text-sm font-medium leading-none">
                    Insurance
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="health" 
                    checked={investmentPreferences.includes("Health Insurance")}
                    onCheckedChange={() => toggleInvestmentPreference("Health Insurance")}
                  />
                  <label htmlFor="health" className="text-sm font-medium leading-none">
                    80D (Health Insurance)
                  </label>
                </div>
              </div>
            </div>

            <Button
              className="w-full bg-finance-primary hover:bg-finance-primary/90"
              onClick={generateTaxSuggestions}
              disabled={isCalculating}
            >
              {isCalculating ? "Calculating..." : "Get Tax Optimization Suggestions"}
            </Button>
          </CardContent>
        </Card>

        {/* Results/Overview Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-finance-primary" />
              Tax Liability Overview
            </CardTitle>
            <CardDescription>Your current and potential optimized tax liability</CardDescription>
          </CardHeader>
          <CardContent>
            {showResults ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-100 p-4 rounded-md">
                    <p className="text-sm text-gray-500 mb-1">Current Tax Liability</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(taxBeforeOptimization || 0)}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-md">
                    <p className="text-sm text-gray-500 mb-1">After Optimization</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(taxAfterOptimization || 0)}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium">Potential Tax Savings</p>
                    <p className="text-lg font-bold text-finance-primary">
                      {formatCurrency((taxBeforeOptimization || 0) - (taxAfterOptimization || 0))}
                    </p>
                  </div>
                  <Progress 
                    value={Math.round(((taxBeforeOptimization || 0) - (taxAfterOptimization || 0)) / (taxBeforeOptimization || 1) * 100)} 
                    className="h-2 bg-gray-200"
                  />
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                  <div className="flex gap-2">
                    <Info className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-amber-800 mb-1">Tax Regime Analysis</h4>
                      <p className="text-sm text-amber-700">
                        {taxRegime === "Old Regime" 
                          ? "You've chosen the Old Regime which allows more deductions. Make sure to maximize these deductions to lower your tax liability."
                          : "You've chosen the New Regime which has lower tax rates but fewer deductions. Consider comparing both regimes to see which is more beneficial for you."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <TrendingDown className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No tax analysis yet</h3>
                <p className="text-muted-foreground mb-4">
                  Fill in your details and click "Get Tax Optimization Suggestions" to see your potential tax savings.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Suggestions */}
      {showResults && (
        <Card>
          <CardHeader>
            <CardTitle>Personalized Tax Saving Recommendations</CardTitle>
            <CardDescription>
              Tax saving strategies optimized for your profile and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {suggestions.length > 0 ? (
              <div className="space-y-4">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <div className={`px-4 py-3 flex justify-between items-center border-b ${
                      suggestion.priority === "High" ? "bg-green-50" : 
                      suggestion.priority === "Medium" ? "bg-amber-50" : "bg-gray-50"
                    }`}>
                      <div>
                        <h3 className="font-medium">
                          {suggestion.title}
                        </h3>
                        <p className="text-xs text-gray-500">Section {suggestion.section}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        suggestion.priority === "High" ? "bg-green-100 text-green-800" : 
                        suggestion.priority === "Medium" ? "bg-amber-100 text-amber-800" : 
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {suggestion.priority} Priority
                      </span>
                    </div>
                    <div className="p-4 space-y-3">
                      <p className="text-sm">{suggestion.description}</p>
                      
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center">
                          <span className="font-medium mr-1">Estimated Savings:</span> 
                          <span className="text-green-600 font-medium">{formatCurrency(suggestion.savingAmount)}</span>
                        </div>
                        {suggestion.riskLevel && (
                          <div>
                            <span className="font-medium mr-1">Risk:</span> 
                            <span className={
                              suggestion.riskLevel === "Low" ? "text-green-600" :
                              suggestion.riskLevel === "Medium" ? "text-amber-600" : 
                              "text-red-600"
                            }>
                              {suggestion.riskLevel}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {suggestion.lockInPeriod && (
                        <div className="text-xs text-gray-500">
                          <span className="font-medium">Lock-in Period:</span> {suggestion.lockInPeriod}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No suggestions available. Please try with different inputs.</p>
              </div>
            )}

            <Separator className="my-6" />

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium mb-2">Common Tax Deductions in India</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="bg-white border rounded-md p-3">
                  <p className="font-medium">Section 80C (₹1.5 Lakh)</p>
                  <ul className="mt-1 list-disc list-inside text-gray-600 text-xs space-y-1">
                    <li>PPF, ELSS, Life Insurance</li>
                    <li>EPF, NSC, Tax Saving FD</li>
                    <li>Home Loan Principal</li>
                  </ul>
                </div>
                <div className="bg-white border rounded-md p-3">
                  <p className="font-medium">Section 80D (₹25K-₹1L)</p>
                  <ul className="mt-1 list-disc list-inside text-gray-600 text-xs space-y-1">
                    <li>Health Insurance Premium</li>
                    <li>Preventive Health Check-up</li>
                    <li>Medical expense for senior citizens</li>
                  </ul>
                </div>
                <div className="bg-white border rounded-md p-3">
                  <p className="font-medium">Section 24 (₹2 Lakh)</p>
                  <ul className="mt-1 list-disc list-inside text-gray-600 text-xs space-y-1">
                    <li>Home Loan Interest</li>
                    <li>For self-occupied property</li>
                  </ul>
                </div>
                <div className="bg-white border rounded-md p-3">
                  <p className="font-medium">Section 80CCD(1B) (₹50K)</p>
                  <ul className="mt-1 list-disc list-inside text-gray-600 text-xs space-y-1">
                    <li>Additional NPS contribution</li>
                    <li>Over and above 80C limit</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex gap-2 items-start">
                <Info className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium mb-1">Disclaimer</h4>
                  <p className="text-xs text-gray-500">
                    The tax suggestions provided are for educational purposes only and not a substitute for professional tax advice.
                    Tax rules are subject to change, and the applicability may vary based on individual circumstances.
                    Please consult with a tax professional before making financial decisions.
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

export default TaxOptimizer;
