'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Leaf,
  ChevronRight,
  BarChart2,
  Droplet,
  Sun,
  Shield,
} from 'lucide-react';

export default function WelcomePage() {
  const [email, setEmail] = useState('');

  const features = [
    {
      title: 'Monitor Plant Health',
      description:
        'Track temperature, humidity, and light levels for each of your plants',
      icon: BarChart2,
      color: '#5c8f57',
    },
    {
      title: 'Water Tracking',
      description: 'Never forget to water your plants with smart reminders',
      icon: Droplet,
      color: '#4A90E2',
    },
    {
      title: 'Light Exposure',
      description: 'Ensure your plants get the optimal amount of light',
      icon: Sun,
      color: '#d4b16f',
    },
    {
      title: 'Plant Protection',
      description:
        'Receive alerts when conditions become harmful for your plants',
      icon: Shield,
      color: '#d4846f',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8faf9] to-[#e6f0e9]">
      {/* Navigation */}
      <nav className="pt-6 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="bg-[#5c8f57] bg-opacity-20 p-2 rounded-full">
            <Leaf className="h-6 w-6 text-[#5c8f57]" />
          </div>
          <span className="text-xl font-bold text-gray-800">PlantPal</span>
        </div>

        <Link
          href="/welcome/signin"
          className="px-5 py-2 border border-[#5c8f57] text-[#5c8f57] rounded-full hover:bg-[#5c8f57]/10 transition-colors"
        >
          Sign In
        </Link>
      </nav>

      {/* Hero Section */}
      <div className="px-6 md:px-12 pt-16 md:pt-24 pb-20 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
              Keep Your Plants <span className="text-[#5c8f57]">Thriving</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-lg">
              Monitor and manage your plants' health with precision. Track
              conditions, set reminders, and provide optimal care for your green
              companions.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5c8f57]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Link
                href="/welcome/signup"
                className="px-6 py-3 bg-[#5c8f57] text-white rounded-lg hover:bg-[#4d7a49] transition-colors flex items-center justify-center"
              >
                Get Started
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </div>

            <div className="mt-4 text-sm text-gray-500">
              Start your 14-day free trial. No credit card required.
            </div>
          </div>

          <div className="md:w-1/2 flex justify-center md:justify-end">
            <div className="relative">
              <div className="absolute -left-4 -top-4 w-24 h-24 bg-[#5c8f57]/10 rounded-full"></div>
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#d4b16f]/10 rounded-full"></div>

              <div className="relative w-full max-w-md h-80 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="absolute inset-0 bg-[url('/images/plant-dashboard-preview.jpg')] bg-cover bg-center opacity-90"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 p-4 bg-white/90 backdrop-blur-sm rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#5c8f57]/20 p-2 rounded-full">
                      <Leaf className="h-5 w-5 text-[#5c8f57]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">
                        Monstera Deliciosa
                      </h3>
                      <p className="text-sm text-gray-500">
                        Optimal conditions detected
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              Everything you need for your plants
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Smart monitoring and helpful reminders to keep your plants healthy
              and happy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${feature.color}20` }}
                >
                  <feature.icon
                    className="h-6 w-6"
                    style={{ color: feature.color }}
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="bg-[#2c392f] rounded-2xl p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row md:items-center">
          <div className="md:w-2/3 mb-8 md:mb-0">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to monitor your plants?
            </h2>
            <p className="text-[#a8b3a6] md:max-w-xl">
              Join thousands of plant enthusiasts who are keeping their plants
              thriving with PlantPal.
            </p>
          </div>
          <div className="md:w-1/3 md:text-right">
            <Link
              href="/welcome/signup"
              className="inline-block px-8 py-3 bg-white text-[#2c392f] font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Start for free
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <div className="bg-[#5c8f57] bg-opacity-20 p-2 rounded-full">
                <Leaf className="h-5 w-5 text-[#5c8f57]" />
              </div>
              <span className="text-lg font-bold text-gray-800">PlantPal</span>
            </div>

            <div className="flex gap-8">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Features
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                About
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Contact
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Privacy
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} PlantPal. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
