import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { BTree, MicroStep } from './types/btree';
import {
  createEmptyBTree,
  calculateTreeLayout,
  traceBTreeInsert,
  traceBTreeSearch,
  traceBTreeDelete,
  resetNodeIdCounter,
} from './core/btreeEngine';
import { MinimalHeader } from './components/MinimalHeader';
import { TreeCanvas } from './components/TreeCanvas';

export function App() {
  const [degree, setDegree] = useState<number>(2);
  const [committedTree, setCommittedTree] = useState<BTree>(() => createEmptyBTree(2));
  const [currentStep, setCurrentStep] = useState<MicroStep | null>(null);
  const [statusText, setStatusText] = useState<string>('Ready');

  // Playback & manual pacing state
  const [speed, setSpeed] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeSteps, setActiveSteps] = useState<MicroStep[]>([]);
  const [stepIndex, setStepIndex] = useState<number>(-1);
  const [targetTree, setTargetTree] = useState<BTree | null>(null);
  const [completionMessage, setCompletionMessage] = useState<string>('');

  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Active tree is either the animated step snapshot or the committed tree
  const activeTree = useMemo(() => {
    return currentStep?.treeSnapshot || committedTree;
  }, [currentStep, committedTree]);

  // Layout coordinates for nodes
  const treeLayout = useMemo(() => {
    return calculateTreeLayout(activeTree);
  }, [activeTree]);

  // Load demo tree
  const loadDemo = useCallback((deg = 2) => {
    if (animationTimerRef.current) clearInterval(animationTimerRef.current);
    resetNodeIdCounter(1);
    let current = createEmptyBTree(deg);
    setDegree(deg);

    const demoKeys = [10, 20, 30, 40, 50, 60, 70];
    for (const k of demoKeys) {
      const res = traceBTreeInsert(current, k);
      current = res.finalTree;
    }

    setCommittedTree(current);
    setCurrentStep(null);
    setActiveSteps([]);
    setStepIndex(-1);
    setTargetTree(null);
    setIsPlaying(false);
    setStatusText('Loaded 2-3-4 demo tree');
  }, []);

  // Initial demo load on mount
  useEffect(() => {
    loadDemo(2);
  }, [loadDemo]);

  // Clear animation on unmount
  useEffect(() => {
    return () => {
      if (animationTimerRef.current) clearInterval(animationTimerRef.current);
    };
  }, []);

  // Automatic step playback timer based on current speed
  useEffect(() => {
    if (!isPlaying) {
      if (animationTimerRef.current) clearInterval(animationTimerRef.current);
      return;
    }

    if (activeSteps.length === 0 || stepIndex >= activeSteps.length - 1) {
      setIsPlaying(false);
      return;
    }

    const intervalMs = Math.round(750 / speed);

    animationTimerRef.current = setInterval(() => {
      setStepIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= activeSteps.length) {
          setIsPlaying(false);
          if (targetTree) {
            setCommittedTree(targetTree);
          }
          if (completionMessage) {
            setStatusText(completionMessage);
          }
          return prevIndex;
        }

        const step = activeSteps[nextIndex];
        setCurrentStep(step);
        setStatusText(step.description);

        if (nextIndex === activeSteps.length - 1) {
          setIsPlaying(false);
          if (targetTree) {
            setCommittedTree(targetTree);
          }
          if (completionMessage) {
            setStatusText(completionMessage);
          }
        }

        return nextIndex;
      });
    }, intervalMs);

    return () => {
      if (animationTimerRef.current) clearInterval(animationTimerRef.current);
    };
  }, [isPlaying, speed, activeSteps, targetTree, completionMessage, stepIndex]);

  // Start a new sequence of micro-steps
  const startSequence = (steps: MicroStep[], finalTree: BTree, message: string) => {
    if (animationTimerRef.current) clearInterval(animationTimerRef.current);

    if (steps.length === 0) {
      setCommittedTree(finalTree);
      setCurrentStep(null);
      setActiveSteps([]);
      setStepIndex(-1);
      setTargetTree(null);
      setStatusText(message);
      setIsPlaying(false);
      return;
    }

    setActiveSteps(steps);
    setTargetTree(finalTree);
    setCompletionMessage(message);
    setStepIndex(0);
    setCurrentStep(steps[0]);
    setStatusText(steps[0].description);

    if (steps.length > 1) {
      setIsPlaying(true);
    } else {
      setCommittedTree(finalTree);
      setIsPlaying(false);
      setStatusText(message);
    }
  };

  // Manual stepping handlers
  const handleStepForward = () => {
    if (isPlaying) {
      setIsPlaying(false);
    }
    if (stepIndex < activeSteps.length - 1) {
      const nextIndex = stepIndex + 1;
      setStepIndex(nextIndex);
      const step = activeSteps[nextIndex];
      setCurrentStep(step);
      setStatusText(step.description);
      if (nextIndex === activeSteps.length - 1 && targetTree) {
        setCommittedTree(targetTree);
        setStatusText(completionMessage);
      }
    }
  };

  const handleStepBack = () => {
    if (isPlaying) {
      setIsPlaying(false);
    }
    if (stepIndex > 0) {
      const prevIndex = stepIndex - 1;
      setStepIndex(prevIndex);
      const step = activeSteps[prevIndex];
      setCurrentStep(step);
      setStatusText(step.description);
    }
  };

  const handleTogglePlay = () => {
    if (activeSteps.length === 0) return;
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (stepIndex >= activeSteps.length - 1) {
        setStepIndex(0);
        setCurrentStep(activeSteps[0]);
        setStatusText(activeSteps[0].description);
      }
      setIsPlaying(true);
    }
  };

  // Operation Handlers
  const handleInsert = (key: number) => {
    if (isPlaying) return;
    setStatusText(`Inserting ${key}...`);
    const { steps, finalTree } = traceBTreeInsert(committedTree, key);
    startSequence(steps, finalTree, `Inserted key ${key}`);
  };

  const handleSearch = (key: number) => {
    if (isPlaying) return;
    setStatusText(`Searching for ${key}...`);
    const steps = traceBTreeSearch(committedTree, key);
    const lastStep = steps[steps.length - 1];
    const found = lastStep?.phase === 'SEARCH_FOUND';
    startSequence(steps, committedTree, found ? `Found key ${key}` : `Key ${key} not in tree`);
  };

  const handleDelete = (key: number) => {
    if (isPlaying) return;
    setStatusText(`Deleting ${key}...`);
    const { steps, finalTree } = traceBTreeDelete(committedTree, key);
    startSequence(steps, finalTree, `Deleted key ${key}`);
  };

  const handleRandom = () => {
    if (isPlaying) return;
    const randomKey = Math.floor(Math.random() * 95) + 5;
    handleInsert(randomKey);
  };

  const handleClear = () => {
    if (animationTimerRef.current) clearInterval(animationTimerRef.current);
    resetNodeIdCounter(1);
    setCommittedTree(createEmptyBTree(degree));
    setCurrentStep(null);
    setActiveSteps([]);
    setStepIndex(-1);
    setTargetTree(null);
    setIsPlaying(false);
    setStatusText('Tree cleared');
  };

  const handleDegreeChange = (newDegree: number) => {
    if (animationTimerRef.current) clearInterval(animationTimerRef.current);
    setDegree(newDegree);
    resetNodeIdCounter(1);
    setCommittedTree(createEmptyBTree(newDegree));
    setCurrentStep(null);
    setActiveSteps([]);
    setStepIndex(-1);
    setTargetTree(null);
    setIsPlaying(false);
    setStatusText(`Degree set to t = ${newDegree}`);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#F8FAFC] text-[#0F172A] overflow-hidden select-none">
      {/* Minimal Header */}
      <MinimalHeader
        degree={degree}
        onDegreeChange={handleDegreeChange}
        onInsert={handleInsert}
        onSearch={handleSearch}
        onDelete={handleDelete}
        onRandom={handleRandom}
        onClear={handleClear}
        statusText={statusText}
        speed={speed}
        onSpeedChange={setSpeed}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onStepForward={handleStepForward}
        onStepBack={handleStepBack}
        canStepForward={activeSteps.length > 0 && stepIndex < activeSteps.length - 1}
        canStepBack={activeSteps.length > 0 && stepIndex > 0}
        currentStepIndex={stepIndex}
        totalSteps={activeSteps.length}
      />

      {/* Main Expansive Canvas */}
      <TreeCanvas
        tree={activeTree}
        layout={treeLayout}
        currentStep={currentStep}
        onQuickDemo={() => loadDemo(degree)}
      />
    </div>
  );
}

export default App;
