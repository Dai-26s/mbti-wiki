"use client";

import { useMemo } from "react";

interface RadarChartProps {
  data: {
    EI: number; // E percentage
    SN: number; // S percentage
    TF: number; // T percentage
    JP: number; // J percentage
  };
  size?: number;
  className?: string;
}

export default function RadarChart({ data, size = 200, className = "" }: RadarChartProps) {
  const points = useMemo(() => {
    // 8 axes: E, S, T, J, I, N, F, P
    // Order them to make a nice shape. 
    // Let's alternate opposites? No, usually radar charts group related or circle around.
    // Let's go clockwise: E, S, T, J, I, N, F, P is weird because I is opposite to E.
    // Standard circular layout often places opposites on opposite sides.
    // Top: E, Bottom: I. Right: S, Left: N?
    // Let's use 8 distinct axes evenly spaced.
    // 0: E, 1: S, 2: T, 3: J, 4: I, 5: N, 6: F, 7: P -- wait, E and I are mutually exclusive in sum, but here we show magnitude.
    // If E is 70%, I is 30%.
    // Axis 0 (Top): E
    // Axis 4 (Bottom): I
    // Axis 2 (Right): S
    // Axis 6 (Left): N
    // Axis 1 (Top-Right): T
    // Axis 5 (Bottom-Left): F
    // Axis 3 (Bottom-Right): J
    // Axis 7 (Top-Left): P
    
    // Let's try a different ordering for visual balance, maybe standard MBTI order pairs?
    // Let's just do 8 points in a circle.
    // 0: E, 1: S, 2: T, 3: J, 4: I, 5: N, 6: F, 7: P
    // But E vs I is the same dimension.
    // If we want a "shape", we represent the 8 poles.
    
    const radius = size / 2;
    const center = size / 2;
    const scale = 0.8; // Leave some padding

    // Values normalized 0-1
    const values = [
      data.EI / 100,      // E
      data.SN / 100,      // S
      data.TF / 100,      // T
      data.JP / 100,      // J
      (100 - data.EI) / 100, // I
      (100 - data.SN) / 100, // N
      (100 - data.TF) / 100, // F
      (100 - data.JP) / 100, // P
    ];
    
    // Labels corresponding to values
    const labels = ["E", "S", "T", "J", "I", "N", "F", "P"];

    // Calculate polygon points
    const polyPoints = values.map((val, i) => {
      const angle = (Math.PI * 2 * i) / 8 - Math.PI / 2; // Start from top
      const r = val * radius * scale;
      const x = center + Math.cos(angle) * r;
      const y = center + Math.sin(angle) * r;
      return `${x},${y}`;
    }).join(" ");

    // Calculate axis lines and labels
    const axes = labels.map((label, i) => {
      const angle = (Math.PI * 2 * i) / 8 - Math.PI / 2;
      const x2 = center + Math.cos(angle) * radius * scale;
      const y2 = center + Math.sin(angle) * radius * scale;
      
      // Label position (slightly further out)
      const labelR = radius * 0.95;
      const lx = center + Math.cos(angle) * labelR;
      const ly = center + Math.sin(angle) * labelR;

      return { x1: center, y1: center, x2, y2, lx, ly, label };
    });

    return { polyPoints, axes };
  }, [data, size]);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* Background Circles (Grid) */}
        {[0.25, 0.5, 0.75, 1].map((r, i) => (
          <circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={(size / 2) * 0.8 * r}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.1}
            strokeDasharray="4 4"
          />
        ))}

        {/* Axes */}
        {points.axes.map((axis, i) => (
          <g key={i}>
            <line
              x1={axis.x1}
              y1={axis.y1}
              x2={axis.x2}
              y2={axis.y2}
              stroke="currentColor"
              strokeOpacity={0.1}
            />
            <text
              x={axis.lx}
              y={axis.ly}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[10px] font-bold fill-zinc-400"
            >
              {axis.label}
            </text>
          </g>
        ))}

        {/* Data Polygon */}
        <polygon
          points={points.polyPoints}
          fill="currentColor"
          fillOpacity={0.2}
          stroke="currentColor"
          strokeWidth={2}
          className="text-emerald-400"
        />
        
        {/* Data Points */}
        {points.axes.map((axis, i) => {
            // Re-calculate point position for dots
            const val = i < 4 
                ? [data.EI, data.SN, data.TF, data.JP][i] / 100 
                : [100 - data.EI, 100 - data.SN, 100 - data.TF, 100 - data.JP][i - 4] / 100;
            const angle = (Math.PI * 2 * i) / 8 - Math.PI / 2;
            const r = val * (size / 2) * 0.8;
            const x = (size / 2) + Math.cos(angle) * r;
            const y = (size / 2) + Math.sin(angle) * r;
            return (
                <circle key={i} cx={x} cy={y} r={3} className="fill-emerald-400" />
            )
        })}
      </svg>
    </div>
  );
}
