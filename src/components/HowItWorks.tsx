
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, Zap, LightbulbOff } from 'lucide-react';

const HowItWorks = () => {
  const features = [
    {
      icon: Lightbulb,
      title: "AI-Powered Analysis",
      description: "Smart comparison of technical specs and performance metrics",
      gradient: "from-tech-electric to-tech-neon"
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get clear recommendations in seconds, not hours",
      gradient: "from-tech-purple to-tech-purple-light"
    },
    {
      icon: LightbulbOff,
      title: "Clear Verdict",
      description: "Simple yes/no answer with detailed reasoning",
      gradient: "from-tech-electric-dark to-tech-electric"
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-tech-dark mb-4">
          How it works?
        </h2>
        <p className="text-lg text-tech-gray-600 max-w-2xl mx-auto">
          We use artificial intelligence to analyze technical specifications, performance evolution, 
          and value proposition to give you a <span className="text-tech-electric font-semibold">clear verdict</span>.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <Card 
              key={index} 
              className="bg-white/80 backdrop-blur-sm border-tech-gray-200/50 shadow-card hover:shadow-electric transition-all duration-300 group"
            >
              <CardContent className="p-8 text-center">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-neon`}>
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-tech-dark mb-3">
                  {feature.title}
                </h3>
                <p className="text-tech-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center mt-12">
        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-tech-electric/10 to-tech-neon/10 rounded-full border border-tech-electric/30 shadow-neon">
          <span className="text-tech-electric font-semibold mr-2">✨</span>
          <span className="text-tech-gray-700 font-medium">100% Free Service</span>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
