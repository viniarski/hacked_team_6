'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col">
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col">
          {/* Back to home link - Stays at the top left */}
          <div className="self-start mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to home
            </Link>
          </div>

          {/* Centered Sign-In Section */}
          <div className="flex flex-grow justify-center items-center">
            <div className="max-w-md w-full text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                Welcome
              </h1>
              <p className="text-gray-600 mb-8">
                Sign in to access your plant dashboard.
              </p>

              <div className="auth-container w-full flex justify-center">
                <SignIn
                  routing="hash"
                  forceRedirectUrl="/spaces"
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
        </div>

        {/* Right side - Image */}
        <div className="hidden md:flex md:w-1/2 bg-[#2c392f] items-center justify-center p-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">
              Monitor your plant's health in real-time
            </h2>
            <p className="text-gray-200">
              Get insights into your plants' needs and create the perfect
              environment for them to thrive.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
