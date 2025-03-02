// src/app/signup/page.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Leaf, ArrowLeft } from 'lucide-react';
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col">
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to home
            </Link>
          </div>

          <div className="flex items-center mb-8">
            <div className="bg-[#5c8f57] bg-opacity-20 p-2 rounded-full mr-2">
              <Leaf className="h-5 w-5 text-[#5c8f57]" />
            </div>
            <span className="text-xl font-bold text-gray-800">Flaura</span>
          </div>

          <div className="max-w-md mx-auto md:mx-0 w-full flex-1 flex flex-col justify-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Get Started
            </h1>
            <p className="text-gray-600 mb-8">
              Create your account to track your plants' health.
            </p>

            <div className="auth-container">
              <SignUp
                routing="path"
                path="/signup"
                fallbackRedirectUrl="/spaces"
                appearance={{
                  elements: {
                    formButtonPrimary: 'bg-[#5c8f57] hover:bg-[#4d7a49]',
                    card: 'shadow-none',
                    footer: 'hidden',
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="hidden md:block md:w-1/2 bg-[#2c392f] relative">
          <div className="absolute inset-0 bg-[url('/images/plants-signin-bg.jpg')] bg-cover bg-center opacity-40"></div>
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-md">
              <h2 className="text-2xl font-bold text-white mb-4">
                Start your plant care journey
              </h2>
              <p className="text-gray-200">
                Create a personalized dashboard for every plant in your home and
                never miss a watering day again.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
