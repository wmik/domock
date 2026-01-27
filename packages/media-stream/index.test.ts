import { MediaStreamTrack } from '@domock/media-stream-track';
import { MediaStream } from './index';

describe('MediaStream', () => {
  describe('constructor', () => {
    it('should create MediaStream with track array', () => {
      const track = new MediaStreamTrack();
      const mediaStream = new MediaStream([track]);

      expect(mediaStream).toBeInstanceOf(MediaStream);
      expect(mediaStream.active).toBe(true);
      expect(mediaStream.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
      );
    });

    it('should create MediaStream with another MediaStream', () => {
      const originalStream = new MediaStream([new MediaStreamTrack()]);
      const clonedStream = new MediaStream(originalStream);

      expect(clonedStream).toBeInstanceOf(MediaStream);
      expect(clonedStream.active).toBe(true);
      expect(clonedStream.id).not.toBe(originalStream.id);
    });

    it('should initialize with default values', () => {
      const mediaStream = new MediaStream([]);

      expect(mediaStream.active).toBe(true);
      expect(mediaStream.id).toBeDefined();
      expect(mediaStream.onactive).toBe(null);
      expect(mediaStream.onaddtrack).toBe(null);
      expect(mediaStream.oninactive).toBe(null);
      expect(mediaStream.onremovetrack).toBe(null);
    });
  });

  describe('addTrack', () => {
    it('should add a track to the stream', () => {
      const mediaStream = new MediaStream([]);
      const track = new MediaStreamTrack();

      mediaStream.addTrack(track);

      expect(mediaStream.getTracks()).toContain(track);
    });

    it('should dispatch addtrack event', () => {
      const mediaStream = new MediaStream([]);
      const track = new MediaStreamTrack();
      const spy = vi.fn();

      mediaStream.addEventListener('addtrack', spy);
      mediaStream.addTrack(track);

      expect(spy).toHaveBeenCalledWith(expect.any(Event));
    });

    it('should call onaddtrack handler if set', () => {
      const mediaStream = new MediaStream([]);
      const track = new MediaStreamTrack();
      const spy = vi.fn();

      mediaStream.onaddtrack = spy;
      mediaStream.addTrack(track);

      expect(spy).toHaveBeenCalledWith(expect.any(Event));
    });
  });

  describe('removeTrack', () => {
    it('should remove a track from the stream', () => {
      const mediaStream = new MediaStream([]);
      const track = new MediaStreamTrack();

      mediaStream.addTrack(track);
      mediaStream.removeTrack(track);

      expect(mediaStream.getTracks()).not.toContain(track);
    });

    it('should dispatch removetrack event', () => {
      const mediaStream = new MediaStream([]);
      const track = new MediaStreamTrack();
      const spy = vi.fn();

      mediaStream.addTrack(track);
      mediaStream.addEventListener('removetrack', spy);
      mediaStream.removeTrack(track);

      expect(spy).toHaveBeenCalledWith(expect.any(Event));
    });

    it('should call onremovetrack handler if set', () => {
      const mediaStream = new MediaStream([]);
      const track = new MediaStreamTrack();
      const spy = vi.fn();

      mediaStream.addTrack(track);
      mediaStream.onremovetrack = spy;
      mediaStream.removeTrack(track);

      expect(spy).toHaveBeenCalledWith(expect.any(Event));
    });

    it('should handle removing non-existent track', () => {
      const mediaStream = new MediaStream([]);
      const track = new MediaStreamTrack();

      expect(() => mediaStream.removeTrack(track)).not.toThrow();
    });
  });

  describe('getTracks methods', () => {
    it('should return all tracks', () => {
      const mediaStream = new MediaStream([]);
      const audioTrack = new MediaStreamTrack();
      const videoTrack = new MediaStreamTrack();

      audioTrack.kind = 'audio';
      videoTrack.kind = 'video';

      mediaStream.addTrack(audioTrack);
      mediaStream.addTrack(videoTrack);

      const allTracks = mediaStream.getTracks();
      expect(allTracks).toHaveLength(2);
      expect(allTracks).toContain(audioTrack);
      expect(allTracks).toContain(videoTrack);
    });

    it('should return only audio tracks', () => {
      const mediaStream = new MediaStream([]);
      const audioTrack = new MediaStreamTrack();
      const videoTrack = new MediaStreamTrack();

      audioTrack.kind = 'audio';
      videoTrack.kind = 'video';

      mediaStream.addTrack(audioTrack);
      mediaStream.addTrack(videoTrack);

      const audioTracks = mediaStream.getAudioTracks();
      expect(audioTracks).toHaveLength(1);
      expect(audioTracks).toContain(audioTrack);
      expect(audioTracks).not.toContain(videoTrack);
    });

    it('should return only video tracks', () => {
      const mediaStream = new MediaStream([]);
      const audioTrack = new MediaStreamTrack();
      const videoTrack = new MediaStreamTrack();

      audioTrack.kind = 'audio';
      videoTrack.kind = 'video';

      mediaStream.addTrack(audioTrack);
      mediaStream.addTrack(videoTrack);

      const videoTracks = mediaStream.getVideoTracks();
      expect(videoTracks).toHaveLength(1);
      expect(videoTracks).toContain(videoTrack);
      expect(videoTracks).not.toContain(audioTrack);
    });

    it('should return empty arrays when no tracks', () => {
      const mediaStream = new MediaStream([]);

      expect(mediaStream.getTracks()).toEqual([]);
      expect(mediaStream.getAudioTracks()).toEqual([]);
      expect(mediaStream.getVideoTracks()).toEqual([]);
    });
  });

  describe('getTrackById', () => {
    it('should return track by id', () => {
      const mediaStream = new MediaStream([]);
      const track = new MediaStreamTrack();

      mediaStream.addTrack(track);
      const foundTrack = mediaStream.getTrackById(track.id);

      expect(foundTrack).toBe(track);
    });

    it('should return undefined for non-existent id', () => {
      const mediaStream = new MediaStream([]);

      const foundTrack = mediaStream.getTrackById('non-existent-id');
      expect(foundTrack).toBeUndefined();
    });
  });

  describe('clone', () => {
    it('should create a clone with same tracks', () => {
      const originalStream = new MediaStream([]);
      const track = new MediaStreamTrack();

      originalStream.addTrack(track);
      const clonedStream = originalStream.clone();

      expect(clonedStream).not.toBe(originalStream);
      expect(clonedStream.id).not.toBe(originalStream.id);
      expect(clonedStream.getTracks()).toEqual(originalStream.getTracks());
    });
  });

  describe('active property', () => {
    it('should initialize as active', () => {
      const mediaStream = new MediaStream([]);
      expect(mediaStream.active).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle adding the same track multiple times', () => {
      const mediaStream = new MediaStream([]);
      const track = new MediaStreamTrack();
      const spy = vi.fn();

      mediaStream.addEventListener('addtrack', spy);
      mediaStream.addTrack(track);
      mediaStream.addTrack(track);

      expect(mediaStream.getTracks()).toHaveLength(1);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should handle removing the same track multiple times', () => {
      const mediaStream = new MediaStream([]);
      const track = new MediaStreamTrack();
      const spy = vi.fn();

      mediaStream.addTrack(track);
      mediaStream.addEventListener('removetrack', spy);
      mediaStream.removeTrack(track);
      mediaStream.removeTrack(track);

      expect(mediaStream.getTracks()).toHaveLength(0);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should handle null/undefined track in removeTrack', () => {
      const mediaStream = new MediaStream([]);

      expect(() => mediaStream.removeTrack(null as any)).not.toThrow();
      expect(() => mediaStream.removeTrack(undefined as any)).not.toThrow();
    });

    it('should handle empty constructor args', () => {
      const mediaStream = new MediaStream([] as any);
      expect(mediaStream).toBeInstanceOf(MediaStream);
      expect(mediaStream.getTracks()).toEqual([]);
    });
  });

  describe('EventTarget interface', () => {
    it('should export properties correctly', () => {
      let mediaStream = new MediaStream([new MediaStreamTrack()]);

      expect(mediaStream).toHaveProperty('addEventListener');
      expect(mediaStream).toHaveProperty('removeEventListener');
      expect(mediaStream).toHaveProperty('dispatchEvent');
      expect(mediaStream).toHaveProperty('active');
      expect(mediaStream).toHaveProperty('id');
      expect(mediaStream).toHaveProperty('addTrack');
      expect(mediaStream).toHaveProperty('clone');
      expect(mediaStream).toHaveProperty('getAudioTracks');
      expect(mediaStream).toHaveProperty('getTrackById');
      expect(mediaStream).toHaveProperty('getTracks');
      expect(mediaStream).toHaveProperty('getVideoTracks');
      expect(mediaStream).toHaveProperty('removeTrack');
    });
  });
});
