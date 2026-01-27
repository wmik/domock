import { MediaStreamTrack } from '@domock/media-stream-track';
import { MediaStream } from '@domock/media-stream';
import { MediaRecorder } from './index';

describe('unit tests', () => {
  it('should export properties correctly', () => {
    let stream = new MediaStream([new MediaStreamTrack()]);
    let mediaRecorder = new MediaRecorder(stream);

    expect(mediaRecorder).toHaveProperty('addEventListener');
    expect(mediaRecorder).toHaveProperty('removeEventListener');
    expect(mediaRecorder).toHaveProperty('dispatchEvent');
    expect(mediaRecorder).toHaveProperty('audioBitrateMode');
    expect(mediaRecorder).toHaveProperty('audioBitsPerSecond');
    expect(mediaRecorder).toHaveProperty('mimeType');
    expect(mediaRecorder).toHaveProperty('state');
    expect(mediaRecorder).toHaveProperty('stream');
    expect(mediaRecorder).toHaveProperty('videoBitsPerSecond');
    expect(mediaRecorder).toHaveProperty('pause');
    expect(mediaRecorder).toHaveProperty('requestData');
    expect(mediaRecorder).toHaveProperty('resume');
    expect(mediaRecorder).toHaveProperty('start');
    expect(mediaRecorder).toHaveProperty('stop');
  });

  it('should cycle through states correctly', () => {
    let stream = new MediaStream([new MediaStreamTrack()]);
    let mediaRecorder = new MediaRecorder(stream);

    expect(mediaRecorder.state).toBe('inactive');

    mediaRecorder.start();
    expect(mediaRecorder.state).toBe('recording');

    mediaRecorder.pause();
    expect(mediaRecorder.state).toBe('paused');

    mediaRecorder.resume();
    expect(mediaRecorder.state).toBe('recording');

    mediaRecorder.stop();
    expect(mediaRecorder.state).toBe('inactive');
  });

  it('should dispatch events correctly', async () => {
    let stream = new MediaStream([new MediaStreamTrack()]);
    let mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

    expect(mediaRecorder.state).toBe('inactive');

    let startHandler = vi.fn();

    mediaRecorder.addEventListener('start', startHandler);
    mediaRecorder.onstart = startHandler;
    mediaRecorder.start();

    expect(startHandler).toHaveBeenCalledTimes(2);

    let pauseHandler = vi.fn();

    mediaRecorder.addEventListener('pause', pauseHandler);
    mediaRecorder.onpause = pauseHandler;
    mediaRecorder.pause();

    expect(pauseHandler).toHaveBeenCalledTimes(2);

    let resumeHandler = vi.fn();

    mediaRecorder.addEventListener('resume', resumeHandler);
    mediaRecorder.onresume = resumeHandler;
    mediaRecorder.resume();

    expect(resumeHandler).toHaveBeenCalledTimes(2);

    let stopHandler = vi.fn();
    let dataHandler = vi.fn();

    mediaRecorder.addEventListener('dataavailable', dataHandler);
    mediaRecorder.ondataavailable = dataHandler;
    mediaRecorder.addEventListener('stop', stopHandler);
    mediaRecorder.onstop = stopHandler;
    mediaRecorder.requestData();
    mediaRecorder.stop();

    expect(stopHandler).toHaveBeenCalledTimes(2);
    expect(dataHandler).toHaveBeenCalledTimes(4);
    expect(dataHandler).toHaveBeenCalledWith(expect.any(BlobEvent));

    let [call] = dataHandler.mock.calls;
    let [event] = call;
    let blob = event.data;

    const BYTES_PER_ITEM = 4;
    let sampleRate = 44100;
    let duration = 1;
    const length = sampleRate * duration * BYTES_PER_ITEM;

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('audio/webm');
    expect(blob.size).toBe(length);
  });

  it('throws Exceptions correctly', () => {
    let stream = new MediaStream([new MediaStreamTrack()]);
    let mediaRecorder = new MediaRecorder(stream);

    expect(() => mediaRecorder.pause()).toThrowError('InvalidStateError');
    expect(() => mediaRecorder.resume()).toThrowError('InvalidStateError');
    expect(() => mediaRecorder.requestData()).toThrowError('InvalidStateError');
    expect(() => mediaRecorder.stop()).toThrowError('InvalidStateError');
  });

  it('validates the correct mime type', () => {
    expect(MediaRecorder.isTypeSupported('audio/webm')).toBe(true);
    expect(MediaRecorder.isTypeSupported('audio/mp3')).toBe(false);
  });
});
