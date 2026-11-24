// ============================================================================
// Task Commander — Alert Sound Synthesizer, Custom Audio Player & Alarm Loop
// ============================================================================

export const BUILTIN_ALERT_SOUNDS = [
  {
    id: 'classic-chime',
    label: '清脆警報（經典預設）',
    desc: '緊急時三短音、一般提醒雙短音，清晰不刺耳',
  },
  {
    id: 'digital-alarm',
    label: '經典電子鬧鐘',
    desc: '滴滴滴滴節奏感強，適合考前與急迫作業催繳',
  },
  {
    id: 'urgent-radar',
    label: '雷達急促警示',
    desc: '高辨識度上升雙脈衝，最不容易忽略',
  },
  {
    id: 'soft-bell',
    label: '柔和叮咚鐘聲',
    desc: '溫潤泛音和弦，適合夜間讀書督促',
  },
  {
    id: 'retro-arcade',
    label: '明快跳音提示',
    desc: '清亮上揚旋律音階，精神提振',
  },
];

export const DEFAULT_ALERT_SOUND_CONFIG = {
  volume: 0.75,
  repeatIntervalMs: 2500,
  shakeEnabled: true,
  separateCriticalSound: false,
  normalSound: { type: 'preset', id: 'classic-chime', label: '清脆警報（經典預設）' },
  criticalSound: { type: 'preset', id: 'urgent-radar', label: '雷達急促警示' },
};

export function normalizeSoundConfig(raw) {
  const src = raw && typeof raw === 'object' ? raw : {};
  return {
    volume: Math.min(1, Math.max(0.05, Number(src.volume ?? DEFAULT_ALERT_SOUND_CONFIG.volume) || 0.75)),
    repeatIntervalMs: Math.min(10000, Math.max(1200, Number(src.repeatIntervalMs ?? DEFAULT_ALERT_SOUND_CONFIG.repeatIntervalMs) || 2500)),
    shakeEnabled: src.shakeEnabled !== false,
    separateCriticalSound: Boolean(src.separateCriticalSound),
    normalSound: src.normalSound?.type
      ? { ...src.normalSound }
      : { ...DEFAULT_ALERT_SOUND_CONFIG.normalSound },
    criticalSound: src.criticalSound?.type
      ? { ...src.criticalSound }
      : { ...DEFAULT_ALERT_SOUND_CONFIG.criticalSound },
  };
}

export function resolveActiveSoundSpec(soundConfig, isCritical) {
  const cfg = normalizeSoundConfig(soundConfig);
  if (cfg.separateCriticalSound && isCritical) {
    return cfg.criticalSound;
  }
  return cfg.normalSound;
}

const dataUrlCache = new Map();

export function clearCachedAlertSound(fileName) {
  if (fileName) dataUrlCache.delete(fileName);
  else dataUrlCache.clear();
}

function getPresetTones(presetId, isCritical) {
  switch (presetId) {
    case 'digital-alarm':
      return [
        { freq: 1480, start: 0.0, duration: 0.09, gain: 0.24, type: 'square' },
        { freq: 1480, start: 0.13, duration: 0.09, gain: 0.24, type: 'square' },
        { freq: 1480, start: 0.26, duration: 0.09, gain: 0.24, type: 'square' },
        { freq: 1760, start: 0.39, duration: 0.14, gain: 0.26, type: 'square' },
      ];
    case 'urgent-radar':
      return [
        { freq: 880, freqEnd: 1320, start: 0.0, duration: 0.16, gain: 0.28, type: 'sawtooth' },
        { freq: 988, freqEnd: 1568, start: 0.2, duration: 0.18, gain: 0.3, type: 'sawtooth' },
        { freq: 1175, freqEnd: 1760, start: 0.42, duration: 0.24, gain: 0.3, type: 'triangle' },
      ];
    case 'soft-bell':
      return [
        { freq: 659.25, start: 0.0, duration: 0.32, gain: 0.24, type: 'sine' },
        { freq: 987.77, start: 0.02, duration: 0.28, gain: 0.14, type: 'sine' },
        { freq: 783.99, start: 0.24, duration: 0.42, gain: 0.24, type: 'sine' },
        { freq: 1318.51, start: 0.26, duration: 0.36, gain: 0.12, type: 'sine' },
      ];
    case 'retro-arcade':
      return [
        { freq: 587.33, start: 0.0, duration: 0.09, gain: 0.22, type: 'triangle' },
        { freq: 783.99, start: 0.1, duration: 0.09, gain: 0.23, type: 'triangle' },
        { freq: 987.77, start: 0.2, duration: 0.09, gain: 0.24, type: 'triangle' },
        { freq: 1174.66, start: 0.3, duration: 0.19, gain: 0.26, type: 'triangle' },
      ];
    case 'classic-chime':
    default:
      return isCritical
        ? [
            { freq: 987.77, start: 0.0, duration: 0.11, gain: 0.26, type: 'triangle' },
            { freq: 987.77, start: 0.14, duration: 0.11, gain: 0.26, type: 'triangle' },
            { freq: 1318.51, start: 0.28, duration: 0.2, gain: 0.3, type: 'triangle' },
          ]
        : [
            { freq: 880.0, start: 0.0, duration: 0.12, gain: 0.24, type: 'sine' },
            { freq: 1108.73, start: 0.15, duration: 0.2, gain: 0.26, type: 'triangle' },
          ];
  }
}

function playSynthesizedPreset(presetId, isCritical, volume) {
  let stopped = false;
  let ctx = null;
  let endTimer = null;

  const stop = () => {
    stopped = true;
    if (endTimer) {
      window.clearTimeout(endTimer);
      endTimer = null;
    }
    if (ctx) {
      const c = ctx;
      ctx = null;
      c.close().catch(() => {});
    }
  };

  const finished = new Promise((resolve) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) {
        resolve();
        return;
      }
      ctx = new AudioCtx();
      const startPlayback = async () => {
        try {
          if (ctx.state === 'suspended') {
            await ctx.resume();
          }
          if (stopped || !ctx) {
            resolve();
            return;
          }

          const tones = getPresetTones(presetId, isCritical);
          const now = ctx.currentTime + 0.02;
          const vol = Math.min(1, Math.max(0.05, Number(volume) || 0.75));
          let maxEnd = 0;

          for (const tone of tones) {
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();
            osc.type = tone.type || 'triangle';
            const startAt = now + tone.start;
            const endAt = startAt + tone.duration;
            maxEnd = Math.max(maxEnd, tone.start + tone.duration);

            osc.frequency.setValueAtTime(tone.freq, startAt);
            if (tone.freqEnd) {
              osc.frequency.exponentialRampToValueAtTime(tone.freqEnd, endAt);
            }

            const peakGain = Math.min(0.65, tone.gain * vol * 1.35);
            gainNode.gain.setValueAtTime(0.0001, startAt);
            gainNode.gain.linearRampToValueAtTime(peakGain, startAt + 0.014);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, endAt);

            osc.connect(gainNode);
            gainNode.connect(ctx.destination);
            osc.start(startAt);
            osc.stop(endAt + 0.03);
          }

          endTimer = window.setTimeout(() => {
            stop();
            resolve();
          }, Math.round((maxEnd + 0.14) * 1000));
        } catch {
          stop();
          resolve();
        }
      };
      startPlayback();
    } catch {
      stop();
      resolve();
    }
  });

  return { stop, finished };
}

async function resolveCustomDataUrl(soundSpec, readCustomSoundDataFn) {
  if (soundSpec?.dataUrl) return soundSpec.dataUrl;
  const fileName = soundSpec?.fileName;
  if (!fileName) return null;
  if (dataUrlCache.has(fileName)) return dataUrlCache.get(fileName);

  const reader = readCustomSoundDataFn || window.electronAPI?.readAlertSoundData;
  if (typeof reader !== 'function') return null;

  try {
    const res = await reader(fileName);
    if (res?.success && res.dataUrl) {
      dataUrlCache.set(fileName, res.dataUrl);
      return res.dataUrl;
    }
  } catch {
    // Fallback to synthesized sound
  }
  return null;
}

export function playAlertSoundOnce({
  soundSpec,
  isCritical = false,
  volume = 0.75,
  readCustomSoundDataFn,
} = {}) {
  let stopped = false;
  let activeAudio = null;
  let fallbackHandle = null;

  const stop = () => {
    stopped = true;
    if (activeAudio) {
      try {
        activeAudio.pause();
        activeAudio.currentTime = 0;
        activeAudio.src = '';
      } catch {}
      activeAudio = null;
    }
    if (fallbackHandle) {
      fallbackHandle.stop();
      fallbackHandle = null;
    }
  };

  const finished = (async () => {
    if (soundSpec?.type === 'custom') {
      const dataUrl = await resolveCustomDataUrl(soundSpec, readCustomSoundDataFn);
      if (stopped) return;
      if (dataUrl) {
        try {
          await new Promise((resolve, reject) => {
            const audio = new Audio(dataUrl);
            activeAudio = audio;
            audio.volume = Math.min(1, Math.max(0.05, Number(volume) || 0.75));
            audio.onended = () => resolve();
            audio.onerror = () => reject(new Error('Audio decode error'));
            const playPromise = audio.play();
            if (playPromise && typeof playPromise.catch === 'function') {
              playPromise.catch(reject);
            }
          });
          return;
        } catch {
          if (stopped) return;
          // Fall through to synthesized preset
        }
      }
    }

    if (stopped) return;
    fallbackHandle = playSynthesizedPreset(
      soundSpec?.type === 'preset' ? soundSpec.id : 'classic-chime',
      isCritical,
      volume
    );
    await fallbackHandle.finished;
  })();

  return { stop, finished };
}

/**
 * Starts a repeating alarm loop (audio + pulse callback) until `stop()` is called.
 * Short sounds repeat every `repeatIntervalMs`; long custom tracks play continuously
 * while visual/window shake pulses keep firing every `repeatIntervalMs`.
 */
export function createAlertAlarmLoop({
  soundSpec,
  isCritical = false,
  volume = 0.75,
  repeatIntervalMs = 2500,
  playSound = true,
  onPulse,
  readCustomSoundDataFn,
} = {}) {
  let stopped = false;
  let currentSoundHandle = null;
  let nextSoundTimer = null;
  let pulseInterval = null;
  const interval = Math.max(1200, Number(repeatIntervalMs) || 2500);

  const scheduleSoundCycle = () => {
    if (stopped || !playSound) return;
    const startedAt = Date.now();
    currentSoundHandle = playAlertSoundOnce({
      soundSpec,
      isCritical,
      volume,
      readCustomSoundDataFn,
    });
    currentSoundHandle.finished.then(() => {
      if (stopped) return;
      const elapsed = Date.now() - startedAt;
      const waitMs = elapsed < interval ? Math.max(450, interval - elapsed) : 650;
      nextSoundTimer = window.setTimeout(scheduleSoundCycle, waitMs);
    });
  };

  // Immediate first pulse & sound
  if (typeof onPulse === 'function') {
    onPulse();
    pulseInterval = window.setInterval(() => {
      if (!stopped) onPulse();
    }, interval);
  }

  if (playSound) {
    scheduleSoundCycle();
  }

  return {
    stop() {
      stopped = true;
      if (pulseInterval) {
        window.clearInterval(pulseInterval);
        pulseInterval = null;
      }
      if (nextSoundTimer) {
        window.clearTimeout(nextSoundTimer);
        nextSoundTimer = null;
      }
      if (currentSoundHandle) {
        currentSoundHandle.stop();
        currentSoundHandle = null;
      }
    },
  };
}
