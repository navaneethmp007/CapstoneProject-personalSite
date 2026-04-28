import { useState, useEffect } from 'react';

const INITIAL_STATE = {
  startDate: new Date().toISOString(),
  currentDay: 1, // 1 to 75
  lastUpdatedDate: new Date().toISOString().split('T')[0],
  dailyTasks: {
    diet: false,
    workout1: false,
    workout2: false,
    reading: false,
    photo: false,
  },
  waterTaps: 0,
  stats: {
    streak: 0,
    longestStreak: 0,
    completedDays: 0,
  },
  addons: {
    leetcode: 260,
    aptitudeSessions: 0,
    backendHours: 0,
  },
  heatmap: {} // { "2026-04-28": { status: 'success' | 'partial' | 'missed' } }
};

export function useTrackerState() {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem('75hard-tracker-state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...INITIAL_STATE, ...parsed }; // Merge to handle schema unmatches
      } catch (e) {
        return INITIAL_STATE;
      }
    }
    return INITIAL_STATE;
  });

  // Calculate day turnover
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    if (state.lastUpdatedDate !== todayStr) {
      // It's a new day!
      // Grade previous day
      const isPerfect = Object.values(state.dailyTasks).every(v => v) && state.waterTaps >= 8;
      const isPartial = (Object.values(state.dailyTasks).some(v => v) || state.waterTaps > 0) && !isPerfect;
      
      const prevStatus = isPerfect ? 'success' : (isPartial ? 'partial' : 'missed');

      const nextStreak = isPerfect ? state.stats.streak + 1 : 0;
      
      setState(prev => ({
        ...prev,
        currentDay: Math.min(prev.currentDay + 1, 75),
        lastUpdatedDate: todayStr,
        dailyTasks: INITIAL_STATE.dailyTasks,
        waterTaps: 0,
        stats: {
          streak: nextStreak,
          longestStreak: Math.max(prev.stats.longestStreak, nextStreak),
          completedDays: prev.stats.completedDays + (isPerfect ? 1 : 0)
        },
        heatmap: {
          ...prev.heatmap,
          [prev.lastUpdatedDate]: { status: prevStatus }
        }
      }));
    }
  }, [state.lastUpdatedDate]);

  useEffect(() => {
    localStorage.setItem('75hard-tracker-state', JSON.stringify(state));
  }, [state]);

  const toggleTask = (taskId) => {
    setState(prev => ({
      ...prev,
      dailyTasks: {
        ...prev.dailyTasks,
        [taskId]: !prev.dailyTasks[taskId]
      }
    }));
  };

  const drinkWater = () => {
    setState(prev => ({
      ...prev,
      waterTaps: Math.min(prev.waterTaps + 1, 8)
    }));
  };

  const updateAddon = (addonId, value) => {
    setState(prev => ({
      ...prev,
      addons: {
        ...prev.addons,
        [addonId]: typeof value === 'function' ? value(prev.addons[addonId]) : value
      }
    }));
  };

  const isDayComplete = Object.values(state.dailyTasks).every(v => v) && state.waterTaps >= 8;

  return {
    state,
    toggleTask,
    drinkWater,
    updateAddon,
    isDayComplete
  };
}
