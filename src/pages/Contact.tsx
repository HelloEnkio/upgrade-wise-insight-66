
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, MessageSquare, Send } from 'lucide-react';

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle contact form submission
    console.log('Contact form submitted');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-tech-gray-50 via-white to-tech-neon/5 font-sans">
      <Helmet>
        <title>Contact Us - Is it Better?</title>
        <meta
          name="description"
          content="Have a question or feedback? Reach out to the Is it Better? team and we'll respond quickly."
        />
        <meta property="og:title" content="Contact Us - Is it Better?" />
        <meta
          property="og:description"
          content="Have a question or feedback? Reach out to the Is it Better? team and we'll respond quickly."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://isitbetter.com/contact" />
      </Helmet>
      <Header />

      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-tech-dark mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-tech-gray-600 max-w-2xl mx-auto">
              Have a question or feedback? Don't hesitate to reach out, we'll get back to you quickly.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="shadow-lg border-tech-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-tech-electric" />
                  <span>Send us a message</span>
                </CardTitle>
                <CardDescription>
                  Fill out this form and we'll respond as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="Your first name" required />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Your last name" required />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="your@email.com" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="Message subject" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Describe your question or feedback..."
                      rows={5}
                      required 
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-gradient-tech hover:opacity-90">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-8">
              <Card className="shadow-lg border-tech-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mail className="h-5 w-5 text-tech-electric" />
                    <span>Contact Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-tech-dark mb-2">Email</h3>
                    <p className="text-tech-gray-600">contact@isitbetter.com</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-tech-dark mb-2">Response Time</h3>
                    <p className="text-tech-gray-600">We typically respond within 24 hours</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-tech-dark mb-2">Support</h3>
                    <p className="text-tech-gray-600">
                      For technical questions or feature suggestions
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-tech-gray-200 bg-gradient-to-r from-tech-electric/5 to-tech-neon/5">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-tech-dark mb-3">Frequently Asked Questions</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-medium text-tech-dark">How does the comparison work?</p>
                      <p className="text-tech-gray-600">Our AI analyzes technical specifications and provides personalized recommendations.</p>
                    </div>
                    <div>
                      <p className="font-medium text-tech-dark">Is the service free?</p>
                      <p className="text-tech-gray-600">Yes, Is it Better? is completely free to use.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
