import React, { useEffect, useState } from 'react';
import { Check, Droplets, BookOpen, Dumbbell, Utensils, Camera, Activity, Flame, Trophy, Target } from 'lucide-react';
import { useTrackerState } from '../hooks/useTrackerState';
import confetti from 'canvas-confetti';

const QUOTES = [
  "Discipline equals freedom.",
  "Don't stop when you're tired. Stop when you're done.",
  "It never gets easier, you just get stronger.",
  "You're only one workout away from a good mood.",
  "Small daily improvements are the key to staggering long-term results.",
  "The pain you feel today will be the strength you feel tomorrow.",
  "Every day is a chance to be better than yesterday.",
];

export default function Dashboard() {
  const { state, toggleTask, drinkWater, updateAddon } = useTrackerState();
  const quote = QUOTES[state.currentDay % QUOTES.length];

  const tasksDone = Object.values(state.dailyTasks).filter(Boolean).length;
  const waterDone = state.waterTaps >= 8 ? 1 : 0;
  const metricsDone = tasksDone + waterDone;
  const totalMetrics = 6;
  const progressPercent = Math.round((metricsDone / totalMetrics) * 100);

  const circumference = 2 * Math.PI * 40;
  const strokeDash = circumference - (circumference * progressPercent) / 100;

  const [celebrated, setCelebrated] = useState(false);
  useEffect(() => {
    if (metricsDone === totalMetrics && !celebrated) {
      setCelebrated(true);
      try {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#6366f1', '#10b981', '#3b82f6'] });
      } catch(e) {}
    }
    if (metricsDone < totalMetrics) setCelebrated(false);
  }, [metricsDone]);

  const completionRate = state.currentDay > 1
    ? Math.round((state.stats.completedDays / (state.currentDay - 1)) * 100)
    : 100;

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '2rem 1rem 6rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#111827', margin: 0, letterSpacing: '-0.5px' }}>75 Hard</h1>
          <p style={{ fontSize: '0.85rem', fontWeight: 500, color: '#9ca3af', margin: 0 }}>Navaneeth's Dashboard</p>
        </div>
        <img
          src="https://ui-avatars.com/api/?name=Navaneeth&background=6366f1&color=fff&bold=true&size=96"
          alt="Avatar"
          style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid #e5e7eb' }}
        />
      </header>

      {/* Hero Card */}
      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15), transparent)', pointerEvents: 'none' }} />
        <div style={{ zIndex: 1 }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.25rem' }}>Current Progress</p>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#111827', lineHeight: 1.1, margin: '0 0 0.5rem' }}>
            Day {state.currentDay} <span style={{ fontSize: '1.1rem', fontWeight: 500, color: '#9ca3af' }}>/ 75</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#6b7280', fontStyle: 'italic', maxWidth: 180, margin: 0 }}>"{quote}"</p>
        </div>
        <div style={{ position: 'relative', width: 96, height: 96, flexShrink: 0 }}>
          <svg width="96" height="96" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="40" fill="none"
              stroke={metricsDone === totalMetrics ? '#10b981' : '#6366f1'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDash}
              style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.5s ease' }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827' }}>{progressPercent}%</span>
          </div>
        </div>
      </div>

      {/* Daily Checklist */}
      <section>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827', margin: '0 0 0.75rem 0.25rem' }}>Daily Core</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          <ChecklistItem title="Strict Diet" subtitle="No cheat meals • No alcohol" icon={Utensils} checked={state.dailyTasks.diet} onClick={() => toggleTask('diet')} />
          <ChecklistItem title="Workout 1 — Indoor" subtitle="45 minutes minimum" icon={Dumbbell} checked={state.dailyTasks.workout1} onClick={() => toggleTask('workout1')} />
          <ChecklistItem title="Workout 2 — Outdoor" subtitle="45 minutes minimum" icon={Activity} checked={state.dailyTasks.workout2} onClick={() => toggleTask('workout2')} />
          <ChecklistItem title="Read Non-Fiction" subtitle="10 pages minimum" icon={BookOpen} checked={state.dailyTasks.reading} onClick={() => toggleTask('reading')} />
          <ChecklistItem title="Progress Photo" subtitle="Log daily changes" icon={Camera} checked={state.dailyTasks.photo} onClick={() => toggleTask('photo')} />
        </div>
      </section>

      {/* Water Tracker */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.75rem' }}>
          <div>
            <h3 style={{ fontWeight: 800, color: '#111827', margin: '0 0 0.2rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Droplets size={18} color="#3b82f6" /> Water Intake
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>1 Gallon • 8 taps</p>
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#3b82f6' }}>{state.waterTaps}/8</span>
        </div>
        <div
          onClick={drinkWater}
          style={{ position: 'relative', height: 56, borderRadius: 14, background: '#f3f4f6', overflow: 'hidden', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}
        >
          <div style={{
            position: 'absolute', top: 0, left: 0, bottom: 0,
            width: `${(state.waterTaps / 8) * 100}%`,
            background: 'linear-gradient(90deg, #3b82f6, #06b6d4)',
            transition: 'width 0.4s ease',
            borderRadius: 14
          }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{ flex: 1, borderRight: i < 7 ? '1px solid rgba(255,255,255,0.4)' : 'none' }} />
            ))}
          </div>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: state.waterTaps > 3 ? 'white' : '#6b7280', fontSize: '0.85rem', pointerEvents: 'none' }}>
            {state.waterTaps >= 8 ? '🎉 Fully Hydrated!' : `Tap to drink (${8 - state.waterTaps} left)`}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
        <StatCard label="Streak" value={state.stats.streak} unit=" days" color="#6366f1" icon={<Flame size={16} />} />
        <StatCard label="Best" value={state.stats.longestStreak} unit=" days" color="#f59e0b" icon={<Trophy size={16} />} />
        <StatCard label="Rate" value={`${completionRate}%`} unit="" color="#10b981" icon={<Target size={16} />} />
      </div>

      {/* Personal Goals */}
      <section>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827', margin: '0 0 0.75rem 0.25rem' }}>Personal Goals</h3>
        <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div>
              <p style={{ fontWeight: 800, color: '#111827', margin: '0 0 0.15rem', fontSize: '1rem' }}>LeetCode Grinder</p>
              <a href="https://leetcode.com/u/navaneeth___07_/" target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#6366f1', textDecoration: 'none' }}>@navaneeth___07_</a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#111827' }}>{state.addons.leetcode}</span>
              <button
                onClick={() => updateAddon('leetcode', p => p + 1)}
                style={{ width: 38, height: 38, borderRadius: '50%', background: '#eef2ff', color: '#6366f1', border: 'none', fontWeight: 800, fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', WebkitTapHighlightColor: 'transparent' }}
              >+</button>
            </div>
          </div>
          <div style={{ height: 6, background: '#f3f4f6', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.min(100, (state.addons.leetcode / 500) * 100)}%`, background: 'linear-gradient(90deg, #6366f1, #818cf8)', borderRadius: 99, transition: 'width 0.6s ease' }} />
          </div>
          <p style={{ fontSize: '0.72rem', color: '#9ca3af', textAlign: 'right', margin: '0.4rem 0 0' }}>{state.addons.leetcode} / 500 goal</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <AddonCard title="Aptitude" subtitle="Sessions" value={state.addons.aptitudeSessions} btnLabel="Log +" color="#f59e0b" onClick={() => updateAddon('aptitudeSessions', p => p + 1)} />
          <AddonCard title="Backend" subtitle="Hours studied" value={state.addons.backendHours} btnLabel="+1hr" color="#10b981" onClick={() => updateAddon('backendHours', p => p + 1)} />
        </div>
      </section>

      {/* 75-Day Heatmap */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontWeight: 800, color: '#111827', margin: '0 0 0.75rem', fontSize: '0.95rem' }}>75-Day Journey</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 5 }}>
          {[...Array(75)].map((_, i) => {
            const d = i + 1;
            let bg = '#f3f4f6';
            if (d < state.currentDay) bg = '#bbf7d0';
            if (d === state.currentDay) bg = '#6366f1';
            return (
              <div key={i} title={`Day ${d}`} style={{ aspectRatio: '1', borderRadius: 4, background: bg, border: d === state.currentDay ? '2px solid #4f46e5' : 'none' }} />
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', fontSize: '0.7rem', color: '#9ca3af' }}>
          <span>🟩 Done</span><span>🟦 Today</span><span>⬜ Upcoming</span>
        </div>
      </div>

    </div>
  );
}

function ChecklistItem({ title, subtitle, icon: Icon, checked, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.875rem 1rem',
        background: checked ? 'rgba(209,250,229,0.6)' : 'rgba(255,255,255,0.75)',
        borderRadius: 14, border: checked ? '1px solid #a7f3d0' : '1px solid rgba(255,255,255,0.5)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)', cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
        transition: 'background 0.25s, border-color 0.25s',
      }}
    >
      <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: checked ? '#d1fae5' : '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: checked ? '#059669' : '#9ca3af', transition: 'background 0.25s' }}>
        {checked ? <Check size={22} /> : <Icon size={22} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={{ fontWeight: 700, color: checked ? '#064e3b' : '#111827', margin: '0 0 0.1rem', fontSize: '0.95rem', textDecoration: checked ? 'line-through' : 'none', opacity: checked ? 0.7 : 1 }}>{title}</h4>
        <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{subtitle}</p>
      </div>
      <div style={{ width: 24, height: 24, borderRadius: '50%', border: checked ? '2px solid #10b981' : '2px solid #d1d5db', background: checked ? '#10b981' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.25s' }}>
        {checked && <Check size={14} color="white" strokeWidth={3} />}
      </div>
    </div>
  );
}

function StatCard({ label, value, unit, color, icon }) {
  return (
    <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
      <div style={{ color, marginBottom: 4, display: 'flex', justifyContent: 'center' }}>{icon}</div>
      <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, color: '#9ca3af', margin: '0 0 0.25rem' }}>{label}</p>
      <p style={{ fontSize: '1.5rem', fontWeight: 900, color, margin: 0, lineHeight: 1 }}>{value}<span style={{ fontSize: '0.7rem', fontWeight: 500, color: '#9ca3af' }}>{unit}</span></p>
    </div>
  );
}

function AddonCard({ title, subtitle, value, btnLabel, color, onClick }) {
  return (
    <div className="glass-card" style={{ padding: '1rem' }}>
      <p style={{ fontWeight: 800, color: '#111827', margin: '0 0 0.15rem', fontSize: '0.95rem' }}>{title}</p>
      <p style={{ fontSize: '0.72rem', color: '#9ca3af', margin: '0 0 0.75rem' }}>{subtitle}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#111827' }}>{value}</span>
        <button
          onClick={onClick}
          style={{ padding: '0.35rem 0.75rem', background: color + '20', color, border: 'none', borderRadius: 99, fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}
        >{btnLabel}</button>
      </div>
    </div>
  );
}
