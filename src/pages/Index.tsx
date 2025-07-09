import React, { useState } from 'react';
import Header from '@/components/Header';
import ComparisonForm from '@/components/ComparisonForm';
import HowItWorks from '@/components/HowItWorks';
import Footer from '@/components/Footer';
import MultiCompareButton from '@/components/MultiCompareButton';
import MultiCompare from '@/components/MultiCompare';
import DevLog from '@/components/DevLog';
const Index = () => {
  const [showMultiCompare, setShowMultiCompare] = useState(false);
  return <div className="min-h-screen bg-gradient-to-br from-tech-gray-50 via-white to-tech-neon/5 font-sans">
      <div className="bg-tech-gray-100 text-tech-gray-700 text-center text-sm py-2 border-b border-tech-gray-200">
        Ceci est la maj du 090725-1320
      </div>
      <Header />

      <main className="container mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center pt-16 pb-20 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-tech-dark mb-8 leading-tight">
            Is it{' '}
            <span className="bg-gradient-tech bg-clip-text text-transparent animate-glow">
              Better
            </span>
            ?
          </h1>
          <p className="text-xl md:text-2xl text-tech-gray-600 max-w-4xl mx-auto leading-relaxed mb-4">Compare your current device with a new one using AI and discover which one is better.</p>
          <p className="text-lg text-tech-gray-500 mb-16">
            Get intelligent recommendations powered by <span className="text-tech-electric font-semibold">artificial intelligence</span>.
          </p>
          {import.meta.env.VITE_DEPLOY_DATE && (
            <p className="text-sm text-tech-gray-400 mb-8">
              Last deployed: {import.meta.env.VITE_DEPLOY_DATE}
            </p>
          )}
        </div>

        {/* Comparison Form */}
        <div className="mb-12">
          <ComparisonForm />
        </div>

        {/* Multi Compare Button - Premium Feature */}
        <div className="text-center mb-24">
          <div className="inline-flex flex-col items-center space-y-3">
            <div className="flex items-center space-x-2 text-xs text-tech-gray-500 mb-1">
              <span className="px-2 py-1 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 rounded-full font-medium">
                ✨ Premium Feature
              </span>
            </div>
            <MultiCompareButton onClick={() => setShowMultiCompare(true)} className="hover:scale-105 shadow-lg" />
            <p className="text-xs text-tech-gray-400 max-w-md">
              Compare up to 15 products simultaneously with detailed analysis tables
            </p>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-20">
          <HowItWorks />
        </div>
      </main>

      <Footer />
      
      {/* Multi Compare Modal */}
      {showMultiCompare && <MultiCompare onClose={() => setShowMultiCompare(false)} />}

      <DevLog />
    </div>;
};export default Index;