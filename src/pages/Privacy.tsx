
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, Lock, Database } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-tech-gray-50 via-white to-tech-neon/5 font-sans">
      <Header />
      
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-tech-dark mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-tech-gray-600 max-w-2xl mx-auto">
              Your privacy is important to us. Learn how we protect and handle your data.
            </p>
          </div>

          <div className="space-y-8">
            <Card className="shadow-lg border-tech-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-tech-electric" />
                  <span>Data Collection</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p className="text-tech-gray-700 mb-4">
                  Is it Better? collects only the information necessary to provide our comparison service:
                </p>
                <ul className="text-tech-gray-700 space-y-2">
                  <li>• Product names and specifications for the two devices you compare</li>
                  <li>• Technical data submitted through our forms</li>
                  <li>• Essential cookies for website functionality</li>
                  <li>• Anonymous usage analytics to improve our service</li>
                  <li>• IP addresses for security and fraud prevention</li>
                </ul>
                <p className="text-tech-gray-700 mt-4">
                  We do not collect personal information unless you voluntarily provide it through our contact form.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-tech-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-tech-electric" />
                  <span>How We Use Your Data</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-tech-gray-700 mb-4">
                  We use your data exclusively for:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-tech-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-tech-dark mb-2">Device Comparison</h4>
                    <p className="text-sm text-tech-gray-600">
                      Analyzing and comparing technical specifications of two devices
                    </p>
                  </div>
                  <div className="bg-tech-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-tech-dark mb-2">Service Improvement</h4>
                    <p className="text-sm text-tech-gray-600">
                      Optimizing our AI for more accurate recommendations
                    </p>
                  </div>
                  <div className="bg-tech-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-tech-dark mb-2">Communication</h4>
                    <p className="text-sm text-tech-gray-600">
                      Responding to your inquiries and support requests
                    </p>
                  </div>
                  <div className="bg-tech-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-tech-dark mb-2">Legal Compliance</h4>
                    <p className="text-sm text-tech-gray-600">
                      Meeting our legal obligations and preventing misuse
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-tech-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="h-5 w-5 text-tech-electric" />
                  <span>Data Protection & Security</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-tech-electric rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-tech-dark">Encryption</h4>
                      <p className="text-tech-gray-700">All data is encrypted in transit using TLS and at rest using industry-standard encryption</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-tech-electric rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-tech-dark">Access Control</h4>
                      <p className="text-tech-gray-700">Only authorized personnel have access to data, with regular access reviews</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-tech-electric rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-tech-dark">Data Minimization</h4>
                      <p className="text-tech-gray-700">We collect only the minimum data necessary and delete it when no longer needed</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-tech-electric rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-tech-dark">Regular Audits</h4>
                      <p className="text-tech-gray-700">We conduct regular security audits and vulnerability assessments</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-tech-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-tech-electric" />
                  <span>Your Rights (GDPR & International)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-tech-gray-700 mb-4">
                  Under GDPR, CCPA, and other privacy laws, you have the following rights:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-tech-dark">Right of Access</h4>
                    <p className="text-sm text-tech-gray-600">Know what personal data we have about you</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-tech-dark">Right to Rectification</h4>
                    <p className="text-sm text-tech-gray-600">Correct inaccurate or incomplete information</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-tech-dark">Right to Erasure</h4>
                    <p className="text-sm text-tech-gray-600">Request deletion of your personal data</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-tech-dark">Right to Portability</h4>
                    <p className="text-sm text-tech-gray-600">Receive your data in a structured, machine-readable format</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-tech-dark">Right to Object</h4>
                    <p className="text-sm text-tech-gray-600">Object to processing based on legitimate interests</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-tech-dark">Right to Restrict</h4>
                    <p className="text-sm text-tech-gray-600">Limit how we process your personal data</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-tech-gray-200">
              <CardHeader>
                <CardTitle>International Transfers & Data Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-tech-dark mb-2">Data Transfers</h4>
                    <p className="text-tech-gray-700">
                      We may transfer data internationally using appropriate safeguards such as Standard Contractual Clauses (SCCs) 
                      or adequacy decisions recognized by relevant authorities.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-tech-dark mb-2">Retention Period</h4>
                    <p className="text-tech-gray-700">
                      We retain data only as long as necessary for the purposes outlined in this policy, 
                      typically no longer than 3 years unless required by law.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-tech-gray-200 bg-gradient-to-r from-tech-electric/5 to-tech-neon/5">
              <CardContent className="p-6">
                <h3 className="font-semibold text-tech-dark mb-3">Contact & Complaints</h3>
                <p className="text-tech-gray-700 mb-3">
                  For privacy-related questions or to exercise your rights, contact our Data Protection Officer at: 
                  <span className="font-semibold text-tech-electric"> privacy@isitbetter.com</span>
                </p>
                <p className="text-tech-gray-700 mb-3">
                  You also have the right to lodge a complaint with your local supervisory authority if you believe 
                  we have not handled your personal data in accordance with applicable law.
                </p>
                <p className="text-sm text-tech-gray-600">
                  Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
