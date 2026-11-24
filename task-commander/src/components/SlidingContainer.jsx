import { useRef, useState, useLayoutEffect, useEffect, useCallback } from 'react';

/**
 * Reusable spring-gliding active indicator container.
 * Measures the active child (`activeSelector`) inside the container padding-box
 * and smoothly translates/resizes a GPU-accelerated indicator pill behind it.
 */
export default function SlidingContainer({
  as = 'div',
  activeKey,
  activeSelector = '.active',
  indicatorClassName = 'sliding-pill-indicator',
  className = '',
  style,
  deps = [],
  children,
  ...rest
}) {
  const Component = as;
  const containerRef = useRef(null);
  const initializedRef = useRef(false);
  const rafRef = useRef(0);

  const [rect, setRect] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    visible: false,
  });
  const [animated, setAnimated] = useState(false);

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const activeEl = container.querySelector(activeSelector);
    if (!activeEl) {
      setRect((prev) => (prev.visible ? { ...prev, visible: false } : prev));
      return;
    }

    const cBox = container.getBoundingClientRect();
    const aBox = activeEl.getBoundingClientRect();
    if (aBox.width === 0 && aBox.height === 0) return;

    // Compensate for any parent CSS transform: scale(...) animation (e.g. modalPop)
    const scaleX = container.offsetWidth > 0 ? cBox.width / container.offsetWidth : 1;
    const scaleY = container.offsetHeight > 0 ? cBox.height / container.offsetHeight : 1;
    const safeScaleX = scaleX > 0.1 ? scaleX : 1;
    const safeScaleY = scaleY > 0.1 ? scaleY : 1;

    const x = (aBox.left - cBox.left) / safeScaleX - container.clientLeft + container.scrollLeft;
    const y = (aBox.top - cBox.top) / safeScaleY - container.clientTop + container.scrollTop;
    const width = aBox.width / safeScaleX;
    const height = aBox.height / safeScaleY;

    setRect((prev) => {
      if (
        prev.visible &&
        Math.abs(prev.x - x) < 0.5 &&
        Math.abs(prev.y - y) < 0.5 &&
        Math.abs(prev.width - width) < 0.5 &&
        Math.abs(prev.height - height) < 0.5
      ) {
        return prev;
      }
      return { x, y, width, height, visible: true };
    });

    if (!initializedRef.current) {
      initializedRef.current = true;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = requestAnimationFrame(() => {
          setAnimated(true);
        });
      });
    }
  }, [activeSelector]);

  const depsSignature = deps.map((d) => String(d)).join('|');

  useLayoutEffect(() => {
    measure();
    // Second pass after layout/transition frames (e.g. sidebar collapse width transition)
    const t1 = window.setTimeout(measure, 60);
    const t2 = window.setTimeout(measure, 230);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [activeKey, depsSignature, measure]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let ro = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => measure());
      ro.observe(container);
      const activeEl = container.querySelector(activeSelector);
      if (activeEl) ro.observe(activeEl);
    }

    const onResize = () => measure();
    window.addEventListener('resize', onResize);

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => measure()).catch(() => {});
    }

    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [activeKey, activeSelector, depsSignature, measure]);

  return (
    <Component
      ref={containerRef}
      className={`has-sliding-indicator ${className}`.trim()}
      style={style}
      {...rest}
    >
      <span
        aria-hidden="true"
        className={`${indicatorClassName} ${animated ? 'is-animated' : ''} ${rect.visible ? 'is-visible' : ''}`.trim()}
        style={{
          transform: `translate3d(${rect.x}px, ${rect.y}px, 0)`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
        }}
      />
      {children}
    </Component>
  );
}
