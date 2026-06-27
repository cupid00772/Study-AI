import wave
import numpy as np
import matplotlib.pyplot as plt

wav_path = r'test_06.16.wav'

with wave.open(wav_path, 'rb') as wf:
    params = wf.getparams()
    nchannels, sampwidth, framerate, nframes = params[:4]
    str_data = wf.readframes(nframes)
    
if sampwidth == 2:
    data = np.frombuffer(str_data, dtype=np.short)
elif sampwidth == 4:
    data = np.frombuffer(str_data, dtype=np.int32)
else:
    data = np.frombuffer(str_data, dtype=np.uint8)

if nchannels == 2:
    data = data[::2] # Take left channel only

# Time array
t = np.arange(0, len(data)) / framerate

# Plot time domain
plt.figure(figsize=(10, 4))
plt.plot(t, data, color='blue')
plt.title("Time Domain Signal")
plt.xlabel("Time (s)")
plt.ylabel("Amplitude")
plt.grid(True)
plt.savefig('time_domain.png')
plt.close()

# Amplitude max time
max_amp_idx = np.argmax(np.abs(data))
max_amp_time = t[max_amp_idx]
print(f"Max amplitude is at time: {max_amp_time:.2f} s")

# FFT
N = len(data)
freqs = np.fft.rfftfreq(N, 1/framerate)
fft_data = np.fft.rfft(data)
magnitude = np.abs(fft_data) / N * 2 # Normalize

# Plot frequency domain
plt.figure(figsize=(10, 4))
plt.plot(freqs, magnitude, color='red')
plt.title("Frequency Domain Signal (FFT)")
plt.xlabel("Frequency (Hz)")
plt.ylabel("Magnitude")
plt.xlim(0, max(freqs) / 2) # Show up to half Nyquist or full
plt.grid(True)
plt.savefig('freq_domain.png')

# Plot zoomed frequency domain (0-2000Hz)
plt.xlim(0, 2000)
plt.savefig('freq_domain_zoomed.png')
plt.close()

# Analysis
max_mag_idx = np.argmax(magnitude)
max_freq = freqs[max_mag_idx]
print(f"Max frequency peak: {max_freq:.2f} Hz")

# Energy in different bands
band1 = magnitude[(freqs >= 0) & (freqs <= 1000)]
band2 = magnitude[freqs > 1000]

print(f"Mean magnitude (0-1000 Hz): {np.mean(band1):.2f}")
if len(band2) > 0:
    print(f"Mean magnitude (>1000 Hz): {np.mean(band2):.2f}")
else:
    print("No frequencies > 1000 Hz")

