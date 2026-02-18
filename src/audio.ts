import { useEffect, useMemo, useRef, useState } from 'react';

type SoundName = 'start' | 'correct' | 'wrong' | 'win' | 'lose' | 'click';

// Freely available audio resources.
// Background music: Pixabay (royalty free) https://pixabay.com/music/id-147355/
// Sound effects: Google Actions sound library (CC BY 4.0) https://actions.google.com/sounds/
const BACKGROUND_MUSIC_URL = 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=gentle-ambient-piano-147355.mp3';

const SOUND_EFFECTS: Record<SoundName, string> = {
  start: 'https://actions.google.com/sounds/v1/cartoon/concussive_hit_guitar_boing.ogg',
  correct: 'https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg',
  wrong: 'https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg',
  win: 'https://actions.google.com/sounds/v1/crowds/party_crowd_cheer.ogg',
  lose: 'https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg',
  click: 'https://actions.google.com/sounds/v1/cartoon/pop.ogg'
};

const createAudio = (url: string, loop = false, volume = 1): HTMLAudioElement => {
  const audio = new Audio(url);
  audio.loop = loop;
  audio.preload = 'none';
  audio.volume = volume;
  return audio;
};

export const useGameAudio = () => {
  const [isMuted, setIsMuted] = useState(false);
  const backgroundRef = useRef<HTMLAudioElement | null>(null);

  const effects = useMemo(() => {
    const entries = Object.entries(SOUND_EFFECTS).map(([key, url]) => [key, createAudio(url, false, 0.6)]);
    return Object.fromEntries(entries) as Record<SoundName, HTMLAudioElement>;
  }, []);

  useEffect(() => {
    const background = createAudio(BACKGROUND_MUSIC_URL, true, 0.3);
    backgroundRef.current = background;

    return () => {
      background.pause();
      background.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    if (backgroundRef.current) {
      backgroundRef.current.muted = isMuted;
    }

    Object.values(effects).forEach((effect) => {
      effect.muted = isMuted;
    });
  }, [effects, isMuted]);

  const playEffect = (name: SoundName) => {
    if (isMuted) {
      return;
    }

    const sound = effects[name];
    if (!sound) {
      return;
    }

    sound.currentTime = 0;
    void sound.play().catch(() => {
      // Browsers can block playback until a user gesture. Ignore quietly.
    });
  };

  const startMusic = () => {
    if (isMuted || !backgroundRef.current) {
      return;
    }

    void backgroundRef.current.play().catch(() => {
      // Browsers can block playback until a user gesture. Ignore quietly.
    });
  };

  const stopMusic = () => {
    if (!backgroundRef.current) {
      return;
    }

    backgroundRef.current.pause();
    backgroundRef.current.currentTime = 0;
  };

  return {
    isMuted,
    toggleMuted: () => setIsMuted((value) => !value),
    playEffect,
    startMusic,
    stopMusic
  };
};
