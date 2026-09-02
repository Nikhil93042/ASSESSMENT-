import React from 'react';
import { Hero } from '../components/home/Hero';
import { OceanOverview } from '../components/home/OceanOverview';
import { HowItWorks } from '../components/home/HowItWorks';
import { PsychologyValue } from '../components/home/PsychologyValue';
import { FAQ } from '../components/home/FAQ';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-0">
      <Hero />
      <OceanOverview />
      <HowItWorks />
      <PsychologyValue />
      <FAQ />
    </div>
  );
};
