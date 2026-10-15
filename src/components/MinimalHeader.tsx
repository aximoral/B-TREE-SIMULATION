import React, { useState } from 'react';
import { Plus, Search, Trash2, Shuffle, RotateCcw, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';

interface MinimalHeaderProps {
  degree: number;
  onDegreeChange: (newDegree: number) => void;
  onInsert: (key: number) => void;
  onSearch: (key: number) => void;
  onDelete: (key: number) => void;
  onRandom: () => void;
  onClear: () => void;
  statusText: string;
  // Playback & manual pacing props
  speed: number;
  onSpeedChange: (newSpeed: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStepForward: () => void;
  onStepBack: () => void;
  canStepForward: boolean;
  canStepBack: boolean;
  currentStepIndex: number;
  totalSteps: number;
}

export const MinimalHeader: React.FC<MinimalHeaderProps> = ({
  degree,
  onDegreeChange,
  onInsert,
  onSearch,
  onDelete,
  onRandom,
  onClear,
  statusText,
  speed,
  onSpeedChange,
  isPlaying,
  onTogglePlay,
  onStepForward,
  onStepBack,
  canStepForward,
  canStepBack,
  currentStepIndex,
  totalSteps,
}) => {
  const [inputValue, setInputValue] = useState<string>('42');

  const handleAction = (action: 'insert' | 'search' | 'delete') => {
    const num = parseInt(inputValue, 10);
    if (isNaN(num)) return;

    if (action === 'insert') onInsert(num);
    if (action === 'search') onSearch(num);
    if (action === 'delete') onDelete(num);

    // Pick next clean random value
    setInputValue(String(Math.floor(Math.random() * 90) + 10));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAction('insert');
    }
  };

  return (
    <header className="h-14 border-b border-slate-200 bg-white/90 backdrop-blur-md px-4 grid grid-cols-[1fr_auto_1fr] items-center select-none z-20 shrink-0 w-full gap-2">
      {/* Left: Brand & Order Selection */}
      <div className="flex items-center gap-3 justify-start min-w-0">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-mono font-bold text-xs">
            B
          </div>
          <span className="text-sm font-semibold text-slate-900 tracking-tight">B-Tree</span>
        </div>

        <div className="h-4 w-[1px] bg-slate-200 shrink-0" />

        <div className="flex items-center gap-1.5 text-xs shrink-0">
          <label htmlFor="degree-select" className="text-slate-500 text-xs font-mono font-medium">Order t:</label>
          <select
            id="degree-select"
            value={degree}
            onChange={(e) => onDegreeChange(parseInt(e.target.value, 10))}
            disabled={isPlaying}
            className="bg-slate-50 border border-slate-200 text-slate-800 rounded px-2 py-1 text-xs font-mono focus:outline-none focus:border-blue-500 cursor-pointer hover:bg-slate-100 transition-colors"
          >
            <option value={2}>t = 2 (2-3-4 tree)</option>
            <option value={3}>t = 3 (max 5 keys)</option>
            <option value={4}>t = 4 (max 7 keys)</option>
            <option value={5}>t = 5 (max 9 keys)</option>
          </select>
        </div>
      </div>

      {/* Center: Core Action Input + Playback & Speed Controls (Dead Center, No Shifting) */}
      <div className="flex items-center justify-center gap-2 shrink-0">
        {/* Key Input & Actions Pill */}
        <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 focus-within:border-blue-500 shadow-xs transition-colors">
          <input
            type="number"
            min="1"
            max="999"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isPlaying}
            placeholder="Key"
            aria-label="Key value"
            className="w-14 bg-transparent text-center font-mono text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none tabular-nums"
          />
          <button
            onClick={() => handleAction('insert')}
            disabled={isPlaying}
            title="Insert key"
            className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1 transition-colors disabled:opacity-40 shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Insert</span>
          </button>
          <button
            onClick={() => handleAction('search')}
            disabled={isPlaying}
            title="Search key"
            className="px-2 py-1 rounded text-slate-700 hover:text-slate-900 hover:bg-slate-100 text-xs font-medium flex items-center gap-1 transition-colors disabled:opacity-40 cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span>Search</span>
          </button>
          <button
            onClick={() => handleAction('delete')}
            disabled={isPlaying}
            title="Delete key"
            className="px-2 py-1 rounded text-slate-700 hover:text-rose-600 hover:bg-rose-50 text-xs font-medium flex items-center gap-1 transition-colors disabled:opacity-40 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Delete</span>
          </button>
        </div>

        <button
          onClick={onRandom}
          disabled={isPlaying}
          title="Insert random key"
          className="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs transition-colors disabled:opacity-40 cursor-pointer"
          aria-label="Insert random key"
        >
          <Shuffle className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-[1px] bg-slate-200 mx-1" />

        {/* Manual Stepping & Play/Pause Controls */}
        <div className="flex items-center gap-0.5 bg-white border border-slate-200 rounded-lg p-0.5 shadow-xs">
          <button
            onClick={onStepBack}
            disabled={!canStepBack}
            title="Step backward (previous micro-step)"
            aria-label="Step backward"
            className="p-1 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onTogglePlay}
            disabled={totalSteps === 0}
            title={isPlaying ? "Pause animation" : "Play animation"}
            aria-label={isPlaying ? "Pause animation" : "Play animation"}
            className="p-1 rounded text-blue-600 hover:text-blue-700 hover:bg-blue-50 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onStepForward}
            disabled={!canStepForward}
            title="Step forward (next micro-step)"
            aria-label="Step forward"
            className="p-1 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <span
            className={`px-1 text-[11px] font-mono tabular-nums min-w-[34px] text-center ${
              totalSteps > 0 ? 'text-slate-600 font-semibold' : 'text-slate-300'
            }`}
          >
            {totalSteps > 0 ? `${currentStepIndex + 1}/${totalSteps}` : '—/—'}
          </span>
        </div>

        {/* Speed Selector: 0.5x | 1x | 2x */}
        <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5 text-xs font-mono">
          {[0.5, 1, 2].map((s) => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              title={`${s}x animation speed`}
              className={`px-1.5 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                speed === s
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Right: Live Status & Reset */}
      <div className="flex items-center justify-end gap-3 min-w-0">
        {statusText && (
          <span
            className="text-xs font-mono text-slate-600 truncate font-medium text-right max-w-[260px]"
            title={statusText}
          >
            {statusText}
          </span>
        )}

        <button
          onClick={onClear}
          disabled={isPlaying}
          title="Clear tree"
          className="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs transition-colors disabled:opacity-40 cursor-pointer shrink-0"
          aria-label="Clear tree"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
