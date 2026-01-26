import { MediaStreamTrack } from './index';

describe('MediaStreamTrack', () => {
  it('should have all required properties', () => {
    let mediaStreamTrack = new MediaStreamTrack();

    expect(mediaStreamTrack).toHaveProperty('addEventListener');
    expect(mediaStreamTrack).toHaveProperty('removeEventListener');
    expect(mediaStreamTrack).toHaveProperty('dispatchEvent');
    expect(mediaStreamTrack).toHaveProperty('contentHint');
    expect(mediaStreamTrack).toHaveProperty('enabled');
    expect(mediaStreamTrack).toHaveProperty('id');
    expect(mediaStreamTrack).toHaveProperty('kind');
    expect(mediaStreamTrack).toHaveProperty('label');
    expect(mediaStreamTrack).toHaveProperty('muted');
    expect(mediaStreamTrack).toHaveProperty('readyState');
    expect(mediaStreamTrack).toHaveProperty('oncapturehandlechange');
    expect(mediaStreamTrack).toHaveProperty('onended');
    expect(mediaStreamTrack).toHaveProperty('onmute');
    expect(mediaStreamTrack).toHaveProperty('onunmute');
    expect(mediaStreamTrack).toHaveProperty('applyConstraints');
    expect(mediaStreamTrack).toHaveProperty('clone');
    expect(mediaStreamTrack).toHaveProperty('getCapabilities');
    expect(mediaStreamTrack).toHaveProperty('getConstraints');
    expect(mediaStreamTrack).toHaveProperty('getSettings');
    expect(mediaStreamTrack).toHaveProperty('stop');
  });

  describe('constructor', () => {
    it('should initialize with default values', () => {
      const track = new MediaStreamTrack();

      expect(track.contentHint).toBe('');
      expect(track.enabled).toBe(true);
      expect(track.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
      );
      expect(track.kind).toBe('audio');
      expect(track.label).toBe('');
      expect(track.muted).toBe(false);
      expect(track.readyState).toBe('live');
      expect(track.oncapturehandlechange).toBe(null);
      expect(track.onended).toBe(null);
      expect(track.onmute).toBe(null);
      expect(track.onunmute).toBe(null);
    });

    it('should generate unique IDs for each instance', () => {
      const track1 = new MediaStreamTrack();
      const track2 = new MediaStreamTrack();

      expect(track1.id).not.toBe(track2.id);
    });
  });

  describe('applyConstraints', () => {
    it('should resolve when track is live', async () => {
      const track = new MediaStreamTrack();

      const result = track.applyConstraints({} as any);
      expect(result).toBeInstanceOf(Promise);
      await expect(result).resolves.toBeUndefined();
    });

    it('should resolve when track is ended', async () => {
      const track = new MediaStreamTrack();
      track.stop();

      const result = track.applyConstraints({} as any);
      expect(result).toBeInstanceOf(Promise);
      await expect(result).resolves.toBeUndefined();
    });

    it('should update constraints and settings', async () => {
      const track = new MediaStreamTrack();
      const constraints = { width: 800, height: 600, deviceId: 'camera123' };

      await track.applyConstraints(constraints);

      expect(track.getConstraints()).toEqual(constraints);
      expect(track.getSettings()).toEqual({
        width: 800,
        height: 600,
        deviceId: 'camera123'
      });
    });
  });

  describe('clone', () => {
    it('should return a new MediaStreamTrack instance with copied properties', () => {
      const track = new MediaStreamTrack();
      track.contentHint = 'speech';
      track.enabled = false;
      track.kind = 'video';
      track.label = 'Test Camera';
      track.muted = true;

      const cloned = track.clone();

      expect(cloned).toBeInstanceOf(MediaStreamTrack);
      expect(cloned).not.toBe(track);
      expect(cloned.id).not.toBe(track.id);
      expect(cloned.contentHint).toBe(track.contentHint);
      expect(cloned.enabled).toBe(track.enabled);
      expect(cloned.kind).toBe(track.kind);
      expect(cloned.label).toBe(track.label);
      expect(cloned.muted).toBe(track.muted);
      expect(cloned.readyState).toBe(track.readyState);
    });
  });

  describe('getCapabilities', () => {
    it('should return capabilities object with all boolean flags', () => {
      const track = new MediaStreamTrack();
      const capabilities = track.getCapabilities();

      expect(capabilities).toEqual({
        width: true,
        height: true,
        aspectRation: true,
        frameRate: true,
        facingMode: true,
        resizeMode: true,
        sampleRate: true,
        sampleSize: true,
        echoCancellation: true,
        autoGainControl: true,
        noiseSuppresssion: true,
        latency: true,
        channelCount: true,
        deviceId: true,
        groupId: true,
        backgroundBlur: true
      });
    });
  });

  describe('getConstraints', () => {
    it('should return empty object initially', () => {
      const track = new MediaStreamTrack();

      expect(track.getConstraints()).toEqual({});
    });

    it('should return applied constraints', async () => {
      const track = new MediaStreamTrack();
      const constraints = { width: 640, height: 480 };

      await track.applyConstraints(constraints);

      expect(track.getConstraints()).toEqual(constraints);
    });
  });

  describe('getSettings', () => {
    it('should return empty object initially', () => {
      const track = new MediaStreamTrack();

      expect(track.getSettings()).toEqual({});
    });

    it('should return settings based on applied constraints', async () => {
      const track = new MediaStreamTrack();
      const constraints = { width: 640, height: 480, frameRate: 30 };

      await track.applyConstraints(constraints);

      expect(track.getSettings()).toEqual({
        width: 640,
        height: 480,
        frameRate: 30
      });
    });

    it('should handle constraint objects with ideal values', async () => {
      const track = new MediaStreamTrack();
      const constraints = {
        width: { ideal: 1280, max: 1920 },
        sampleRate: { exact: 44100 }
      };

      await track.applyConstraints(constraints);

      expect(track.getSettings()).toEqual({
        width: 1280,
        sampleRate: 44100
      });
    });
  });

  describe('stop', () => {
    it('should change readyState to ended', () => {
      const track = new MediaStreamTrack();

      expect(track.readyState).toBe('live');

      track.stop();

      expect(track.readyState).toBe('ended');
    });
  });

  describe('event handling', () => {
    it('should add and trigger event listeners', () => {
      const track = new MediaStreamTrack();
      const mockListener = vi.fn();

      track.addEventListener('test', mockListener);
      track.dispatchEvent(new Event('test'));

      expect(mockListener).toHaveBeenCalled();
    });

    it('should remove event listeners', () => {
      const track = new MediaStreamTrack();
      const mockListener = vi.fn();

      track.addEventListener('test', mockListener);
      track.removeEventListener('test', mockListener);
      track.dispatchEvent(new Event('test'));

      expect(mockListener).not.toHaveBeenCalled();
    });
  });

  describe('property mutations', () => {
    it('should allow changing enabled property', () => {
      const track = new MediaStreamTrack();

      track.enabled = false;
      expect(track.enabled).toBe(false);

      track.enabled = true;
      expect(track.enabled).toBe(true);
    });

    it('should allow changing muted property', () => {
      const track = new MediaStreamTrack();

      track.muted = true;
      expect(track.muted).toBe(true);

      track.muted = false;
      expect(track.muted).toBe(false);
    });

    it('should allow changing contentHint property', () => {
      const track = new MediaStreamTrack();

      track.contentHint = 'speech';
      expect(track.contentHint).toBe('speech');

      track.contentHint = 'music';
      expect(track.contentHint).toBe('music');
    });

    it('should allow changing label property', () => {
      const track = new MediaStreamTrack();

      track.label = 'Test Label';
      expect(track.label).toBe('Test Label');
    });
  });

  describe('edge cases', () => {
    it('should handle multiple stop calls', () => {
      const track = new MediaStreamTrack();

      track.stop();
      expect(track.readyState).toBe('ended');

      track.stop();
      expect(track.readyState).toBe('ended');
    });

    it('should maintain properties after stop', () => {
      const track = new MediaStreamTrack();
      const originalId = track.id;

      track.stop();

      expect(track.id).toBe(originalId);
      expect(track.kind).toBe('audio');
    });
  });
});
