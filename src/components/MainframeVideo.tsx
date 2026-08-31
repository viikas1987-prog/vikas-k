import React, { useRef, useEffect } from 'react';

export const MainframeVideo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const prevXRef = useRef<number | null>(null);
  const targetTimeRef = useRef<number>(0);
  const isSeekingRef = useRef<boolean>(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const SENSITIVITY = 0.8;

    const handleMouseMove = (e: MouseEvent) => {
      if (prevXRef.current === null) {
        prevXRef.current = e.clientX;
        return;
      }

      const delta = e.clientX - prevXRef.current;
      prevXRef.current = e.clientX;

      if (!video.duration || isNaN(video.duration)) return;

      const timeOffset = (delta / window.innerWidth) * SENSITIVITY * video.duration;
      targetTimeRef.current = Math.max(0, Math.min(video.duration, targetTimeRef.current + timeOffset));

      if (!isSeekingRef.current) {
        isSeekingRef.current = true;
        video.currentTime = targetTimeRef.current;
      }
    };

    const handleMouseLeave = () => {
      prevXRef.current = null;
    };

    const handleSeeked = () => {
      if (Math.abs(video.currentTime - targetTimeRef.current) > 0.04) {
        video.currentTime = targetTimeRef.current;
      } else {
        isSeekingRef.current = false;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        if (prevXRef.current === null) {
          prevXRef.current = touch.clientX;
          return;
        }
        const delta = touch.clientX - prevXRef.current;
        prevXRef.current = touch.clientX;
        if (!video.duration || isNaN(video.duration)) return;
        const timeOffset = (delta / window.innerWidth) * SENSITIVITY * video.duration;
        targetTimeRef.current = Math.max(0, Math.min(video.duration, targetTimeRef.current + timeOffset));
        if (!isSeekingRef.current) {
          isSeekingRef.current = true;
          video.currentTime = targetTimeRef.current;
        }
      }
    };

    const handleTouchEnd = () => {
      prevXRef.current = null;
    };

    const handleScroll = () => {
      if (!video.duration || isNaN(video.duration)) return;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        const scrollProgress = window.scrollY / maxScroll;
        targetTimeRef.current = scrollProgress * video.duration;
        if (!isSeekingRef.current) {
          isSeekingRef.current = true;
          video.currentTime = targetTimeRef.current;
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('scroll', handleScroll, { passive: true });
    video.addEventListener('seeked', handleSeeked);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('scroll', handleScroll);
      video.removeEventListener('seeked', handleSeeked);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4"
      muted
      playsInline
      preload="auto"
      className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none"
      style={{ objectPosition: '70% center' }}
    />
  );
};
