
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { CheckCircle, ChevronRight, BarChart3, ShieldCheck, Target } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-finance-primary/10 to-finance-secondary/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="w-full lg:w-1/2 mb-10 lg:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Plan Your Financial Future With Confidence
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-lg">
                Take control of your finances with personalized goals, AI-powered advice, 
                and smart investment recommendations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  className="bg-finance-primary hover:bg-finance-primary/90 text-lg"
                  onClick={() => navigate("/signup")}
                >
                  Get Started Free
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="text-lg"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
              </div>
            </div>
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-64 h-64 bg-finance-secondary/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-finance-primary/10 rounded-full blur-3xl" />
                <img 
                  src="https://img.freepik.com/free-vector/finance-financial-performance-concept-illustration_53876-40450.jpg" 
                  alt="Financial Planning" 
                  className="relative z-10 w-full max-w-lg rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Key Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to take control of your financial journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="w-14 h-14 bg-gradient-to-r from-finance-primary to-finance-secondary rounded-full flex items-center justify-center mb-6">
                <Target className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Goal Planner</h3>
              <p className="text-gray-600 mb-4">
                Set personalized financial goals and get a clear roadmap to achieve them with our 
                intelligent calculator and progress tracking.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Personalized goal setting
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Smart investment planning
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Visual progress tracking
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="w-14 h-14 bg-gradient-to-r from-finance-primary to-finance-secondary rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4"/>
                  <path d="M12 8h0"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">AI Financial Coach</h3>
              <p className="text-gray-600 mb-4">
                Get personalized financial advice and answers to your money questions from our 
                intelligent AI assistant, available 24/7.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  24/7 financial guidance
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Personalized recommendations
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Simple, jargon-free advice
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="w-14 h-14 bg-gradient-to-r from-finance-primary to-finance-secondary rounded-full flex items-center justify-center mb-6">
                <BarChart3 className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Mutual Fund Recommender</h3>
              <p className="text-gray-600 mb-4">
                Discover mutual funds that match your risk profile and investment goals, with detailed 
                analysis and performance metrics.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Personalized fund recommendations
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Risk-based filtering
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Performance analysis
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/2">
              <img 
                src="https://img.freepik.com/free-vector/financial-investment-digital-concept_23-2148614305.jpg" 
                alt="Why Choose Us" 
                className="w-full max-w-lg mx-auto rounded-lg shadow-lg"
              />
            </div>
            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Why Choose FinancePro</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-finance-secondary/20 flex items-center justify-center">
                      <ShieldCheck className="h-4 w-4 text-finance-secondary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">Data Security</h3>
                    <p className="text-gray-600">
                      Your financial data is protected with bank-level security and encryption, 
                      ensuring your information stays private.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-finance-primary/20 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-finance-primary">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 16v-4"/>
                        <path d="M12 8h0"/>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">AI-Powered Insights</h3>
                    <p className="text-gray-600">
                      Our advanced algorithms analyze thousands of data points to provide 
                      personalized recommendations tailored to your financial situation.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-finance-accent/20 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-finance-accent">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">Educational Approach</h3>
                    <p className="text-gray-600">
                      We believe in empowering you with knowledge. Our platform explains 
                      concepts clearly, helping you become financially savvy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-finance-primary to-finance-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Financial Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of people who are taking control of their financial future with FinancePro.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-finance-primary hover:bg-white/90 text-lg"
              onClick={() => navigate("/signup")}
            >
              Create Free Account
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-white border-white hover:bg-white/10 text-lg"
              onClick={() => navigate("/login")}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-finance-primary to-finance-secondary rounded-full p-2 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                    <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 01-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004zM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 01-.921.42z" />
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.816a3.836 3.836 0 00-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 01-.921-.421l-.879-.66a.75.75 0 00-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 001.5 0v-.81a4.124 4.124 0 001.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 00-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 00.933-1.175l-.415-.33a3.836 3.836 0 00-1.719-.755V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">FinancePro</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Your companion for a secure financial future.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Features</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Goal Planner</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">AI Financial Coach</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Mutual Funds</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Financial Education</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Learning Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">FAQs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} FinancePro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
