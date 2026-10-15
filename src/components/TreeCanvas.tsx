import React, { useRef, useState, useEffect } from 'react';
import { BTree, TreeLayout, MicroStep } from '../types/btree';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface TreeCanvasProps {
  tree: BTree;
  layout: TreeLayout;
  currentStep: MicroStep | null;
  onQuickDemo: () => void;
}

export const TreeCanvas: React.FC<TreeCanvasProps> = ({
  tree,
  layout,
  currentStep,
  onQuickDemo,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Center tree on layout change or manual reset
  const centerTree = () => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    if (layout.contentWidth > 0 && layout.contentHeight > 0) {
      // Tree has actual nodes: calculate 2D bounds to prevent vertical or horizontal clipping
      const availableWidth = clientWidth - 100;
      const availableHeight = clientHeight - 140;

      const scaleX = layout.contentWidth <= availableWidth ? 1.0 : availableWidth / layout.contentWidth;
      const scaleY = layout.contentHeight <= availableHeight ? 1.0 : availableHeight / layout.contentHeight;
      const targetScale = Math.max(0.35, Math.min(1.0, Math.min(scaleX, scaleY)));

      const treeCenterX = layout.minX + layout.contentWidth / 2;
      setScale(targetScale);
      setPan({
        x: clientWidth / 2 - treeCenterX * targetScale,
        y: Math.max(48, (clientHeight - layout.contentHeight * targetScale) / 3),
      });
    } else if (layout.canvasWidth > 0) {
      setScale(1.0);
      setPan({
        x: (clientWidth - layout.canvasWidth) / 2,
        y: 60,
      });
    }
  };

  useEffect(() => {
    centerTree();
  }, [layout.contentWidth, layout.contentHeight, layout.minX]);

  // Unified Pointer events for pan (mouse & touch)
  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('.btree-node')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    const newScale = Math.min(2.5, Math.max(0.4, scale * zoomFactor));

    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setPan({
      x: mouseX - (mouseX - pan.x) * (newScale / scale),
      y: mouseY - (mouseY - pan.y) * (newScale / scale),
    });
    setScale(newScale);
  };

  const maxKeys = 2 * tree.degree - 1;

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      className="relative flex-1 w-full h-full bg-[#F8FAFC] overflow-hidden select-none cursor-grab active:cursor-grabbing touch-none"
      style={{
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0.07) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* Minimal Floating Zoom Controls (Bottom Right) */}
      <div className="absolute bottom-5 right-5 z-10 flex items-center gap-1 bg-white/90 border border-slate-200 shadow-xs backdrop-blur-md p-1 rounded-lg">
        <button
          onClick={() => setScale((s) => Math.min(2.5, s * 1.15))}
          title="Zoom in"
          aria-label="Zoom in"
          className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setScale((s) => Math.max(0.35, s * 0.85))}
          title="Zoom out"
          aria-label="Zoom out"
          className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <div className="w-[1px] h-3.5 bg-slate-200 mx-0.5" />
        <button
          onClick={() => setScale(1.0)}
          title="Reset zoom to 100%"
          className="px-1.5 py-0.5 text-[11px] font-mono text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors tabular-nums cursor-pointer font-medium"
        >
          {Math.round(scale * 100)}%
        </button>
        <div className="w-[1px] h-3.5 bg-slate-200 mx-0.5" />
        <button
          onClick={centerTree}
          title="Auto-frame tree"
          aria-label="Auto-frame tree"
          className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Empty State */}
      {(!tree.rootId || Object.keys(tree.nodes).length === 0) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-center p-6 max-w-sm pointer-events-auto">
            <p className="text-xs text-slate-500 mb-3">Tree is empty. Insert a key above or load a demo to start.</p>
            <button
              onClick={onQuickDemo}
              className="px-3 py-1.5 rounded-md bg-white hover:bg-slate-50 border border-slate-200 shadow-xs text-slate-700 text-xs font-medium transition-colors cursor-pointer"
            >
              Load Demo Tree
            </button>
          </div>
        </div>
      )}

      {/* Zoomable / Pannable Stage */}
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          width: `${layout.canvasWidth}px`,
          height: `${layout.canvasHeight}px`,
          transition: isDragging ? 'none' : 'transform 75ms ease-out',
        }}
      >
        {/* SVG Edge Connectors */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ width: layout.canvasWidth, height: layout.canvasHeight }}
        >
          {Object.values(tree.nodes).map((node) => {
            if (node.isLeaf || node.children.length === 0) return null;
            const parentLayout = layout.nodes[node.id];
            if (!parentLayout) return null;

            return node.children.map((childId, childIdx) => {
              const childLayout = layout.nodes[childId];
              if (!childLayout) return null;

              const numChildren = node.children.length;
              const socketX = parentLayout.x + ((childIdx + 0.5) / numChildren) * parentLayout.width;
              const socketY = parentLayout.y + parentLayout.height;

              const targetX = childLayout.x + childLayout.width / 2;
              const targetY = childLayout.y;

              const isChildActive =
                currentStep?.activeNodeId === childId ||
                currentStep?.secondaryNodeId === childId;
              const isParentActive =
                currentStep?.activeNodeId === node.id ||
                currentStep?.secondaryNodeId === node.id;
              const isActiveEdge = isParentActive && isChildActive;

              const controlY1 = socketY + (targetY - socketY) * 0.45;
              const controlY2 = socketY + (targetY - socketY) * 0.55;
              const pathD = `M ${socketX} ${socketY} C ${socketX} ${controlY1}, ${targetX} ${controlY2}, ${targetX} ${targetY}`;

              return (
                <path
                  key={`edge-${node.id}-${childId}`}
                  d={pathD}
                  fill="none"
                  stroke={isActiveEdge ? '#2563EB' : '#CBD5E1'}
                  strokeWidth={isActiveEdge ? 2.2 : 1.5}
                  strokeLinecap="round"
                  className="transition-all duration-300 ease-out"
                />
              );
            });
          })}
        </svg>

        {/* Tree Nodes with Smooth Spatial Coordinates */}
        {Object.values(tree.nodes).map((node) => {
          const nodeLayout = layout.nodes[node.id];
          if (!nodeLayout) return null;

          const isActive = currentStep?.activeNodeId === node.id;
          const isSecondary = currentStep?.secondaryNodeId === node.id;
          const isFull = node.keys.length === maxKeys;

          let borderColor = 'border-slate-300';
          if (isActive) {
            if (currentStep?.highlightType === 'found') {
              borderColor = 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm';
            } else if (currentStep?.highlightType === 'split') {
              borderColor = 'border-amber-500 ring-2 ring-amber-500/20 shadow-sm';
            } else if (currentStep?.highlightType === 'insert') {
              borderColor = 'border-blue-600 ring-2 ring-blue-500/20 shadow-sm';
            } else if (currentStep?.highlightType === 'delete') {
              borderColor = 'border-rose-500 ring-2 ring-rose-500/20 shadow-sm';
            } else {
              borderColor = 'border-amber-500 ring-2 ring-amber-500/20 shadow-sm';
            }
          } else if (isSecondary) {
            borderColor = 'border-cyan-500 ring-2 ring-cyan-500/20 shadow-sm';
          }

          return (
            <div
              key={node.id}
              className={`btree-node absolute rounded-lg bg-slate-100 border ${borderColor} shadow-xs transition-all duration-300 ease-out flex flex-col justify-center`}
              style={{
                left: `${nodeLayout.x}px`,
                top: `${nodeLayout.y}px`,
                width: `${nodeLayout.width}px`,
                height: `${nodeLayout.height}px`,
              }}
            >
              {/* Minimal Node Header Indicator */}
              <div className="h-4 px-2 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <span>{node.isLeaf ? 'leaf' : 'node'}</span>
                {isFull && <span className="text-amber-600 font-semibold">full</span>}
              </div>

              {/* Key Cells Row */}
              <div className="p-1.5 flex items-center justify-center gap-1">
                {node.keys.map((key, keyIdx) => {
                  const isKeyActive = isActive && currentStep?.activeKeyIndex === keyIdx;
                  const isElevated = currentStep?.elevatedKey === key;

                  let cellStyle = 'bg-white text-slate-900 border-slate-200/90 shadow-2xs';
                  if (isKeyActive) {
                    if (currentStep?.highlightType === 'found') {
                      cellStyle = 'bg-emerald-50 text-emerald-800 border-emerald-500 font-bold';
                    } else if (currentStep?.highlightType === 'split') {
                      cellStyle = 'bg-amber-50 text-amber-900 border-amber-500 font-bold';
                    } else if (currentStep?.highlightType === 'insert') {
                      cellStyle = 'bg-blue-50 text-blue-800 border-blue-500 font-bold';
                    } else {
                      cellStyle = 'bg-amber-50 text-amber-900 border-amber-400 font-bold';
                    }
                  } else if (isElevated) {
                    cellStyle = 'bg-cyan-50 text-cyan-800 border-cyan-500 font-bold';
                  }

                  return (
                    <div
                      key={`${node.id}-k-${keyIdx}`}
                      className={`h-8 min-w-9 px-2 rounded border flex items-center justify-center font-mono text-xs font-semibold tabular-nums tracking-tight transition-all duration-200 ${cellStyle}`}
                    >
                      {key}
                    </div>
                  );
                })}

                {node.keys.length === 0 && (
                  <div className="text-[10px] font-mono text-slate-400 italic py-0.5">empty</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
