import React from 'react';
import Header from '@/components/Header';
import ComparisonForm from '@/components/ComparisonForm';
import HowItWorks from '@/components/HowItWorks';
import Footer from '@/components/Footer';
const Index = () => {
  return <div className="min-h-screen bg-gradient-to-br from-tech-gray-50 via-white to-tech-neon/5 font-sans">
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

        {/* How It Works Section */}
        <div className="mb-20">
          <HowItWorks />
        </div>
      </main>

      <Footer />
    </div>;
};
export default Index;