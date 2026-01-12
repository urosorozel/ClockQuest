import { useEffect, useMemo, useRef, useState } from "react";
import { useSettings } from "./SettingsProvider";

export type ClockTime = {
  hours: number;
  minutes: number;
};

type AnalogClockProps = {
  time: ClockTime;
  onChange?: (time: ClockTime) => void;
  showHint?: boolean;
  highlightMinute?: number | null;
  showDigitalOverride?: boolean;
};

const clampMinutes = (minutes: number) => ((minutes % 60) + 60) % 60;

const getAngleFromPoint = (x: number, y: number, rect: DOMRect) => {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = x - cx;
  const dy = y - cy;
  const radians = Math.atan2(dy, dx);
  const degrees = (radians * 180) / Math.PI;
  return (degrees + 90 + 360) % 360;
};

const nearestSnap = (minute: number, snapMode: "none" | "5" | "1") => {
  if (snapMode === "none" || snapMode === "1") {
    return clampMinutes(Math.round(minute));
  }
  const snapped = Math.round(minute / 5) * 5;
  return clampMinutes(snapped);
};

const AnalogClock = ({
  time,
  onChange,
  showHint,
  highlightMinute,
  showDigitalOverride
}: AnalogClockProps) => {
  const { settings } = useSettings();
  const clockRef = useRef<SVGSVGElement | null>(null);
  const [activeHand, setActiveHand] = useState<"hour" | "minute">("minute");
  const [isDragging, setIsDragging] = useState(false);
  const lastMinuteRef = useRef<number | null>(null);

  const minuteAngle = useMemo(() => time.minutes * 6, [time.minutes]);
  const hourAngle = useMemo(
    () => (time.hours % 12) * 30 + time.minutes * 0.5,
    [time.hours, time.minutes]
  );

  const updateTime = (next: ClockTime) => {
    if (!onChange) return;
    onChange(next);
  };

  const adjustHours = (hours: number, direction: 1 | -1) => {
    if (direction === 1) {
      return hours === 12 ? 1 : hours + 1;
    }
    return hours === 1 ? 12 : hours - 1;
  };

  const adjustMinutes = (delta: number) => {
    let nextMinutes = time.minutes + delta;
    let nextHours = time.hours;
    while (nextMinutes >= 60) {
      nextMinutes -= 60;
      nextHours = adjustHours(nextHours, 1);
    }
    while (nextMinutes < 0) {
      nextMinutes += 60;
      nextHours = adjustHours(nextHours, -1);
    }
    updateTime({ hours: nextHours, minutes: clampMinutes(nextMinutes) });
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (!clockRef.current) return;
    const rect = clockRef.current.getBoundingClientRect();
    const angle = getAngleFromPoint(event.clientX, event.clientY, rect);

    if (activeHand === "minute") {
      const rawMinutes = angle / 6;
      const snappedMinutes = nearestSnap(rawMinutes, settings.snapMode);
      const newMinutes = clampMinutes(snappedMinutes);
      let newHours = time.hours;
      const lastMinutes = lastMinuteRef.current ?? time.minutes;
      if (lastMinutes > 50 && newMinutes < 10) {
        newHours = adjustHours(time.hours, 1);
      } else if (lastMinutes < 10 && newMinutes > 50) {
        newHours = adjustHours(time.hours, -1);
      }
      lastMinuteRef.current = newMinutes;
      updateTime({ hours: newHours, minutes: newMinutes });
    } else {
      const rawHours = angle / 30;
      const adjustedHours = rawHours - time.minutes / 60;
      const normalized = (adjustedHours + 12) % 12;
      const newHours = Math.round(normalized);
      updateTime({ hours: newHours === 0 ? 12 : newHours, minutes: time.minutes });
    }
  };

  useEffect(() => {
    if (!isDragging) return;
    const handlePointerUp = () => setIsDragging(false);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp, { once: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging, activeHand, time, settings.snapMode]);

  const startDrag = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!onChange) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    if (clockRef.current) {
      const rect = clockRef.current.getBoundingClientRect();
      const angle = getAngleFromPoint(event.clientX, event.clientY, rect);
      const minuteDiff = Math.abs(angle - minuteAngle);
      const hourDiff = Math.abs(angle - hourAngle);
      setActiveHand(minuteDiff <= hourDiff ? "minute" : "hour");
    }
    lastMinuteRef.current = time.minutes;
    setIsDragging(true);
  };

  const tickMarks = Array.from({ length: 60 }, (_, index) => index);

  const isReduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div className="clock-wrapper">
      <svg
        ref={clockRef}
        viewBox="0 0 200 200"
        role="img"
        aria-label="Interactive analog clock"
        className={`clock ${isDragging ? "dragging" : ""}`}
        onPointerDown={startDrag}
      >
        <circle cx="100" cy="100" r="90" className="clock-face" />
        {settings.showTicks &&
          tickMarks.map((tick) => {
            const angle = (tick * 6 * Math.PI) / 180;
            const outer = 88;
            const inner = tick % 5 === 0 ? 78 : 83;
            const x1 = 100 + outer * Math.sin(angle);
            const y1 = 100 - outer * Math.cos(angle);
            const x2 = 100 + inner * Math.sin(angle);
            const y2 = 100 - inner * Math.cos(angle);
            return (
              <line
                key={tick}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className={tick % 5 === 0 ? "tick major" : "tick"}
              />
            );
          })}
        {settings.showNumbers &&
          Array.from({ length: 12 }, (_, index) => index + 1).map((number) => {
            const angle = (number * 30 * Math.PI) / 180;
            const radius = 63;
            const x = 100 + radius * Math.sin(angle);
            const y = 100 - radius * Math.cos(angle) + 6;
            return (
              <text key={number} x={x} y={y} className="clock-number">
                {number}
              </text>
            );
          })}
        {showHint && highlightMinute !== null && (
          <>
            <circle
              cx="100"
              cy="100"
              r="86"
              className="hint-ring"
              strokeDasharray="6 6"
            />
            <circle
              cx={100 + 82 * Math.sin((highlightMinute * 6 * Math.PI) / 180)}
              cy={100 - 82 * Math.cos((highlightMinute * 6 * Math.PI) / 180)}
              r="6"
              className="hint-dot"
            />
          </>
        )}
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="50"
          className="hand minute"
          style={{
            transform: `rotate(${minuteAngle}deg)`,
            transition: isReduceMotion ? "none" : "transform 0.2s ease"
          }}
        />
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="65"
          className="hand hour"
          style={{
            transform: `rotate(${hourAngle}deg)`,
            transition: isReduceMotion ? "none" : "transform 0.2s ease"
          }}
        />
        <circle cx="100" cy="100" r="6" className="clock-center" />
      </svg>
      <div className="clock-controls" role="group" aria-label="Clock controls">
        <div className="hand-selector">
          <button
            type="button"
            className={activeHand === "hour" ? "chip active" : "chip"}
            onClick={() => setActiveHand("hour")}
          >
            Move hour hand
          </button>
          <button
            type="button"
            className={activeHand === "minute" ? "chip active" : "chip"}
            onClick={() => setActiveHand("minute")}
          >
            Move minute hand
          </button>
        </div>
        <div className="stepper">
          <button
            type="button"
            onClick={() => {
              if (!onChange) return;
              if (activeHand === "minute") {
                const step = settings.snapMode === "5" ? 5 : 1;
                adjustMinutes(-step);
              } else {
                updateTime({
                  hours: time.hours === 1 ? 12 : time.hours - 1,
                  minutes: time.minutes
                });
              }
            }}
          >
            -
          </button>
          <button
            type="button"
            onClick={() => {
              if (!onChange) return;
              if (activeHand === "minute") {
                const step = settings.snapMode === "5" ? 5 : 1;
                adjustMinutes(step);
              } else {
                updateTime({
                  hours: time.hours === 12 ? 1 : time.hours + 1,
                  minutes: time.minutes
                });
              }
            }}
          >
            +
          </button>
        </div>
      </div>
      {(showDigitalOverride ?? settings.showDigital) && (
        <div className="digital-helper" aria-live="polite">
          {time.hours}:{String(time.minutes).padStart(2, "0")}
        </div>
      )}
    </div>
  );
};

export default AnalogClock;
