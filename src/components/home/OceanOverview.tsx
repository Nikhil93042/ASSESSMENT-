import React from 'react';
import { oceanCategoryDescriptions } from '../../data/questions';
import { Compass, CheckSquare, Users, HeartHandshake, Shield, Sparkles } from 'lucide-react';

const iconsMap = {
  O: Compass,
  C: CheckSquare,
  E: Users,
  A: HeartHandshake,
  N: Shield,
};

export const OceanOverview: React.FC = () => {
  return (
    <section className="py-20 bg-[#0E172E] border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Big Five Framework</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-jakarta">
            Understanding the OCEAN Model
          </h2>
          <p className="text-slate-300 text-base leading-relaxed">
            The Big Five framework is the gold standard in industrial and organizational psychology, providing an empirical baseline to analyze workplace behaviors and leadership dynamics.
          </p>
        </div>

        {/* 5 Trait Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(Object.keys(oceanCategoryDescriptions) as Array<keyof typeof oceanCategoryDescriptions>).map((key) => {
            const item = oceanCategoryDescriptions[key];
            const Icon = iconsMap[key];

            return (
              <div 
                key={key}
                className="bg-[#131B2E] border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all hover:-translate-y-1 shadow-lg hover:shadow-purple-500/5 group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md"
                    style={{ backgroundColor: `${item.color}20`, border: `1px solid ${item.color}50` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: item.color }} />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                      Dimension {key}
                    </span>
                    <h3 className="text-lg font-bold text-white font-jakarta">
                      {item.title}
                    </h3>
                  </div>
                </div>

                <p className="text-sm font-semibold text-slate-200 mb-2">
                  {item.short}
                </p>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
