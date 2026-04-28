import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Droplets, BookOpen, Dumbbell, Utensils, Camera, Activity } from 'lucide-react';
import { useTrackerState } from '../hooks/useTrackerState';
import { cn } from '../lib/utils';
import confetti from 'canvas-confetti';

const QUOTES = [
  "Discipline equals freedom.",
  "Don't stop when you're tired. Stop when you're done.",
  "It never gets easier, you just get stronger.",
  "You're only one workout away from a good mood.",
  "Small daily improvements are the key to staggering long-term results."
];

export default function Dashboard() {
  const { state, toggleTask, drinkWater, updateAddon, isDayComplete } = useTrackerState();
  const quote = QUOTES[state.currentDay % QUOTES.length];

  // Calculate completion percentage for today
  const tasksDone = Object.values(state.dailyTasks).filter(Boolean).length;
  const totalTasks = 5; // photo, diet, workout1, workout2, reading
  const waterDone = state.waterTaps >= 8 ? 1 : 0;
  const metricsDone = tasksDone + waterDone;
  const totalMetrics = 6;
  const progressPercent = Math.round((metricsDone / totalMetrics) * 100);

  useEffect(() => {
    if (metricsDone === totalMetrics) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#10b981', '#3b82f6']
      });
    }
  }, [metricsDone]);

  return (
    <div className="max-w-md mx-auto min-h-screen px-4 pt-10 pb-20 space-y-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">75 Hard</h1>
          <p className="text-sm font-medium text-gray-500">Navaneeth's Dashboard</p>
        </div>
        <div className="h-12 w-12 rounded-full overflow-hidden border border-gray-200">
          <img src="https://ui-avatars.com/api/?name=Navaneeth&background=0D8ABC&color=fff" alt="Avatar" />
        </div>
      </header>

      {/* Hero Section */}
      <section className="glass-card p-6 flex items-center justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />
        <div className="z-10">
          <h2 className="text-xs font-semibold text-indigo-500 uppercase tracking-widest mb-1">Current Progress</h2>
          <div className="text-4xl font-black text-gray-900 mb-2">Day {state.currentDay} <span className="text-lg text-gray-400 font-medium tracking-normal">/ 75</span></div>
          <p className="text-sm text-gray-500 italic max-w-[200px]">"{quote}"</p>
        </div>
        
        {/* Circular Progress */}
        <div className="relative w-24 h-24 flex items-center justify-center shrink-0 z-10">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" className="text-gray-100 stroke-current" strokeWidth="8" fill="none" />
            <motion.circle 
              cx="50" cy="50" r="40" 
              className={cn("stroke-current transition-colors duration-500", metricsDone === totalMetrics ? 'text-emerald-500' : 'text-indigo-500')} 
              strokeWidth="8" fill="none" 
              strokeDasharray="251.2" 
              initial={{ strokeDashoffset: 251.2 }}
              animate={{ strokeDashoffset: 251.2 - (251.2 * progressPercent) / 100 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              strokeLinecap="round" 
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-lg font-bold text-gray-900">{progressPercent}%</span>
          </div>
        </div>
      </section>

      {/* Daily Checklist */}
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-gray-900 px-1">Daily Core</h3>
        <div className="space-y-3">
          <ChecklistItem title="Strict Diet" subtitle="No cheat meals, no alcohol" icon={Utensils} checked={state.dailyTasks.diet} onClick={() => toggleTask('diet')} />
          <ChecklistItem title="Workout 1 (Indoor)" subtitle="45 minutes minimum" icon={Dumbbell} checked={state.dailyTasks.workout1} onClick={() => toggleTask('workout1')} />
          <ChecklistItem title="Workout 2 (Outdoor)" subtitle="45 minutes minimum" icon={Activity} checked={state.dailyTasks.workout2} onClick={() => toggleTask('workout2')} />
          <ChecklistItem title="Read Non-Fiction" subtitle="10 pages" icon={BookOpen} checked={state.dailyTasks.reading} onClick={() => toggleTask('reading')} />
          <ChecklistItem title="Progress Photo" subtitle="Log daily changes" icon={Camera} checked={state.dailyTasks.photo} onClick={() => toggleTask('photo')} />
        </div>
      </section>

      {/* Water Tracker */}
      <section className="glass-card p-6">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Droplets className="w-5 h-5 text-blue-500" /> Water Intake
            </h3>
            <p className="text-sm text-gray-500">1 Gallon • 8 Taps</p>
          </div>
          <div className="text-2xl font-black text-blue-500">{state.waterTaps}/8</div>
        </div>
        
        <div className="relative h-16 bg-gray-100 rounded-2xl overflow-hidden cursor-pointer" onClick={drinkWater}>
          <motion.div 
            className="absolute bottom-0 left-0 top-0 bg-gradient-to-r from-blue-400 to-cyan-400"
            initial={{ width: '0%' }}
            animate={{ width: `${(state.waterTaps / 8) * 100}%` }}
            transition={{ type: 'spring', stiffness: 50 }}
          />
          {/* Tap segments overlay */}
          <div className="absolute inset-0 flex">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex-1 border-r border-white/30 last:border-0" />
            ))}
          </div>
          <div className="absolute inset-0 flex items-center justify-center font-bold text-white mix-blend-difference pointer-events-none">
            {state.waterTaps >= 8 ? 'Hydrated!' : 'Tap to drink'}
          </div>
        </div>
      </section>

      {/* Stats Panel */}
      <section className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4 flex flex-col items-center justify-center text-center">
          <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-1">Current Streak</p>
          <div className="text-3xl font-black text-indigo-500">{state.stats.streak} <span className="text-base text-gray-400">days</span></div>
        </div>
        <div className="glass-card p-4 flex flex-col items-center justify-center text-center">
          <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-1">Completion</p>
          <div className="text-3xl font-black text-emerald-500">
            {state.currentDay > 1 ? Math.round((state.stats.completedDays / (state.currentDay - 1)) * 100) : 100}%
          </div>
        </div>
      </section>

      {/* Personal Goals Add-ons */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 px-1">Personal Goals</h3>
        
        {/* LeetCode */}
        <div className="glass-card p-5">
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="font-bold text-gray-900">LeetCode Grinder</p>
              <a href="https://leetcode.com/u/navaneeth___07_/" target="_blank" rel="noreferrer" className="text-xs text-indigo-500 hover:underline">@navaneeth___07_</a>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-gray-900">{state.addons.leetcode}</span>
              <motion.button 
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg hover:bg-indigo-100"
                onClick={() => updateAddon('leetcode', prev => prev + 1)}
              >
                +
              </motion.button>
            </div>
          </div>
          <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-indigo-500"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (state.addons.leetcode / 500) * 100)}%` }} 
            />
          </div>
          <p className="text-xs text-right text-gray-400 mt-1 mt-2">Goal: 500 problems</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-5">
            <p className="font-bold text-gray-900 mb-1">Aptitude</p>
            <p className="text-xs text-gray-500 mb-3">Total Sessions</p>
            <div className="flex justify-between items-end">
              <span className="text-2xl font-black text-gray-900">{state.addons.aptitudeSessions}</span>
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => updateAddon('aptitudeSessions', p => p + 1)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-full"
              >
                Log +
              </motion.button>
            </div>
          </div>

          <div className="glass-card p-5">
            <p className="font-bold text-gray-900 mb-1">Backend</p>
            <p className="text-xs text-gray-500 mb-3">Hours Studied</p>
            <div className="flex justify-between items-end">
              <span className="text-2xl font-black text-gray-900">{state.addons.backendHours}</span>
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => updateAddon('backendHours', p => p + 1)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-full"
              >
                +1hr
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* Basic Heatmap Placeholder */}
      <section className="glass-card p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-4">75-Day Journey</h3>
        <div className="grid grid-cols-10 gap-1 sm:gap-2">
          {[...Array(75)].map((_, i) => {
            // Find past days
            const dayNum = i + 1;
            let statusColor = "bg-gray-100";
            if (dayNum < state.currentDay) {
              statusColor = "bg-emerald-500/20"; // Just a placeholder, ideally read from heatmap state
            } else if (dayNum === state.currentDay) {
              statusColor = "bg-indigo-500 border border-indigo-600";
            }
            return (
              <div key={i} className={cn("w-full aspect-square rounded-[4px] sm:rounded-md", statusColor)} title={`Day ${dayNum}`} />
            )
          })}
        </div>
      </section>

    </div>
  );
}

function ChecklistItem({ title, subtitle, icon: Icon, checked, onClick }) {
  return (
    <motion.div 
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "glass-card p-4 flex items-center gap-4 cursor-pointer transition-all duration-200",
        checked ? "bg-emerald-50/50 border-emerald-100" : "hover:bg-white/90"
      )}
    >
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
        checked ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500"
      )}>
        {checked ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className={cn("font-bold transition-colors", checked ? "text-emerald-900 line-through opacity-70" : "text-gray-900")}>
          {title}
        </h4>
        <p className="text-sm text-gray-500 truncate">{subtitle}</p>
      </div>
      <div className="shrink-0 pl-2">
        <div className={cn(
          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
          checked ? "bg-emerald-500 border-emerald-500" : "border-gray-300"
        )}>
          {checked && <Check className="w-4 h-4 text-white" />}
        </div>
      </div>
    </motion.div>
  );
}
