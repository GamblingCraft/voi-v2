"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./site-audio.module.css";

type SiteAudio = { soundOn: boolean; play: () => void; toggle: () => void };
const AudioContext = createContext<SiteAudio | null>(null);
const fadeDuration = 4000;
const targetVolume = 0.45;

export function useSiteAudio() {
  const audio = useContext(AudioContext);
  if (!audio) throw new Error("useSiteAudio requires SiteAudioProvider");
  return audio;
}

export function SiteAudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [soundOn, setSoundOn] = useState(false);
  const fadeRef = useRef<number | null>(null);
  const requestRef = useRef(0);
  const pendingRef = useRef(false);
  const automaticRequested = useRef(false);
  const userDisabled = useRef(false);

  const stopFade = useCallback(() => {
    if (fadeRef.current !== null) cancelAnimationFrame(fadeRef.current);
    fadeRef.current = null;
  }, []);

  const start = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const request = ++requestRef.current;
    stopFade();
    pendingRef.current = false;
    if (audio.ended) audio.currentTime = 0;
    audio.muted = false;
    audio.volume = 0;
    void audio
      .play()
      .then(() => {
        if (request !== requestRef.current) return;
        setSoundOn(true);
        const began = performance.now();
        const fade = (now: number) => {
          const progress = Math.max(
            0,
            Math.min((now - began) / fadeDuration, 1),
          );
          audio.volume =
            targetVolume * progress * progress * (3 - 2 * progress);
          fadeRef.current = progress < 1 ? requestAnimationFrame(fade) : null;
        };
        fadeRef.current = requestAnimationFrame(fade);
      })
      .catch((error: unknown) => {
        if (request !== requestRef.current) return;
        pendingRef.current =
          error instanceof DOMException && error.name === "NotAllowedError";
        setSoundOn(false);
      });
  }, [stopFade]);

  // Request playback once per page load; hero calls share the same guard.
  const play = useCallback(() => {
    if (automaticRequested.current || userDisabled.current) return;
    automaticRequested.current = true;
    start();
  }, [start]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (soundOn) {
      userDisabled.current = true;
      pendingRef.current = false;
      requestRef.current += 1;
      stopFade();
      audio.pause();
      setSoundOn(false);
    } else {
      userDisabled.current = false;
      automaticRequested.current = true;
      start();
    }
  };
  useEffect(() => {
    const audio = audioRef.current;
    const retry = (event: Event) => {
      if (
        event.target instanceof Element &&
        event.target.closest("[data-site-sound-toggle]")
      )
        return;
      if (pendingRef.current && !userDisabled.current) start();
    };
    window.addEventListener("pointerdown", retry);
    window.addEventListener("keydown", retry);
    play();
    return () => {
      window.removeEventListener("pointerdown", retry);
      window.removeEventListener("keydown", retry);
      requestRef.current += 1;
      pendingRef.current = false;
      automaticRequested.current = false;
      stopFade();
      audio?.pause();
    };
  }, [play, start, stopFade]);
  const sync = () => {
    const audio = audioRef.current;
    setSoundOn(!!audio && !audio.paused && !audio.muted && !audio.ended);
  };
  return (
    <AudioContext.Provider value={{ soundOn, play, toggle }}>
      <audio
        ref={audioRef}
        src="/media/hero/backaudio.mp3"
        preload="auto"
        onPlaying={sync}
        onPause={sync}
        onEnded={() => {
          stopFade();
          pendingRef.current = false;
          setSoundOn(false);
        }}
        onError={() => {
          stopFade();
          pendingRef.current = false;
          setSoundOn(false);
        }}
      />
      {children}
    </AudioContext.Provider>
  );
}

export function SoundToggle({ className = "" }: { className?: string }) {
  const { soundOn, toggle } = useSiteAudio();
  const label = soundOn ? "Выключить звук" : "Включить звук";
  return (
    <button
      type="button"
      data-site-sound-toggle
      className={`${styles.control} ${className}`}
      onClick={toggle}
      aria-label={label}
      title={label}
      aria-pressed={soundOn}
    >
      <span className={styles.wave} aria-hidden="true">
        {[0, 1, 2, 3, 4].map((index) => (
          <i key={index} />
        ))}
      </span>
    </button>
  );
}
