"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
      return;
    }

    const cursor = cursorRef.current;
    if (!cursor) return;

    // Force cursor none on all elements with highest specificity
    const style = document.createElement("style");
    style.id = "custom-cursor-style";
    style.innerHTML = `
      html, body, *, *::before, *::after,
      a, a:hover, a:active, a:focus,
      button, button:hover, button:active, button:focus,
      [class], [id], [style],
      img, svg, video, canvas,
      div, span, p, h1, h2, h3, h4, h5, h6,
      input, textarea, select, label,
      nav, header, footer, main, section, article {
        cursor: none !important;
      }
      body { cursor: none !important; }
    `;
    document.head.appendChild(style);

    // Continuously enforce cursor none
    const enforceCursor = () => {
      document.documentElement.style.setProperty("cursor", "none", "important");
      document.body.style.setProperty("cursor", "none", "important");
    };

    const intervalId = setInterval(enforceCursor, 100);
    enforceCursor();

    const handleMouseMove = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      cursor.style.opacity = "1";
      enforceCursor();
    };

    const handleMouseLeave = () => {
      cursor.style.opacity = "0";
    };

    // Also handle mousedown/up to catch click states
    const handleMouseDown = () => {
      enforceCursor();
    };

    const handleMouseUp = () => {
      enforceCursor();
      // Delay to catch any cursor changes after click
      setTimeout(enforceCursor, 0);
      setTimeout(enforceCursor, 50);
    };

    // Prevent drag from showing cursor
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      enforceCursor();
    };

    const handleSelectStart = () => {
      enforceCursor();
    };

    // Handle click as well
    const handleClick = () => {
      enforceCursor();
      setTimeout(enforceCursor, 0);
      setTimeout(enforceCursor, 50);
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("click", handleClick);
    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("selectstart", handleSelectStart);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("click", handleClick);
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("selectstart", handleSelectStart);
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-[9999] opacity-0"
      style={{ willChange: "left, top" }}
    >
      <img
        src="/cursor/pigeon_cursor.png"
        alt=""
        width={32}
        height={40}
        className="-translate-x-1 -translate-y-1"
      />
    </div>
  );
}
