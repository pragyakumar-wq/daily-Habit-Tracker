import React, { useState, useEffect, useMemo } from 'react';

const INITIAL_HABITS = [
  { id: 1, name: '💧 Drink 8 glasses of water', category: 'Health', target: 8, count: 5, completed: false, note: 'Keep water bottle on desk', history: [true, 'frozen', true, true, true, true] },
  { id: 2, name: '📖 Read for 15 minutes', category: 'Mind', target: 1, count: 1, completed: true, note: 'Reading Chapter 4 of Atomic Habits', history: [false, true, true, true, true, true] },
  { id: 3, name: '💻 Code 2 Pomodoro sessions', category: 'Work', target: 2, count: 1, completed: false, note: '', history: [true, true, false, false, true, true] }
];

function computeStreak(habit) {
  let count = habit.completed ? 1 : 0;
  for (let i = habit.history.length - 1; i >= 0; i--) {
    if (habit.history[i] === true) count += 1;
    else if (habit.history[i] === 'frozen') continue;
    else break;
  }
  return count;
}

export default function App() {
  const [habits, setHabits] = useState(INITIAL_HABITS);
  const [shields, setShields] = useState(2);
  const [activeCategory, setActiveCategory] = useState('All');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Health');
  const [newTarget, setNewTarget] = useState(1);

  const visibleHabits = useMemo(() => {
    return activeCategory === 'All'
      ? habits
      : habits.filter((h) => h.category === activeCategory);
  }, [habits, activeCategory]);

  const stepHabit = (id) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const nextCount = h.completed ? 0 : h.count + 1;
        return { ...h, count: nextCount, completed: nextCount >= h.target };
      })
    );
  };

  const addHabit = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setHabits((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: newName.trim(),
        category: newCategory,
        target: Math.max(1, Number(newTarget) || 1),
        count: 0,
        completed: false,
        note: '',
        history: [false, false, false, false, false, false]
      }
    ]);
    setNewName('');
    setNewTarget(1);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-slate-900">Habit Tracker (React Edition)</h1>
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800">
          🧊 {shields}/3 Shields
        </span>
      </div>
      <form onSubmit={addHabit} className="flex gap-2 mb-4">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New habit..."
          className="flex-1 px-3 py-2 text-sm border rounded-xl"
        />
        <input
          type="number"
          min="1"
          max="50"
          value={newTarget}
          onChange={(e) => setNewTarget(e.target.value)}
          className="w-16 px-2 py-2 text-sm border rounded-xl text-center"
        />
        <select
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="px-3 py-2 text-sm border rounded-xl"
        >
          <option value="Health">Health</option>
          <option value="Mind">Mind</option>
          <option value="Work">Work</option>
          <option value="Life">Life</option>
        </select>
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl">
          + Add
        </button>
      </form>
      <ul className="space-y-2.5">
        {visibleHabits.map((h) => (
          <li
            key={h.id}
            onClick={() => stepHabit(h.id)}
            className="p-3.5 rounded-xl border border-slate-200 flex justify-between items-center cursor-pointer"
          >
            <div>
              <span className={h.completed ? 'line-through text-slate-400 font-medium' : 'font-medium text-slate-800'}>
                {h.name}
              </span>
              {h.note && <p className="text-xs text-slate-400 italic mt-0.5">📝 {h.note}</p>}
            </div>
            <div className="flex items-center gap-2">
              {h.target > 1 && (
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {h.count}/{h.target}
                </span>
              )}
              <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                🔥 {computeStreak(h)}d
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
