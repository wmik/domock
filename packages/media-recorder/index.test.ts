import { MediaRecorder } from './index';

describe('unit tests', () => {
  it('should export properties correctly', () => {
    let mediaRecorder = new MediaRecorder();

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
    let mediaRecorder = new MediaRecorder();

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
    let mediaRecorder = new MediaRecorder(undefined, {
      mimeType: 'audio/webm'
    });

    expect(mediaRecorder.state).toBe('inactive');

    let startHandler = vi.fn();

    mediaRecorder.addEventListener('start', startHandler);
    mediaRecorder.start();

    expect(startHandler).toHaveBeenCalled();

    let pauseHandler = vi.fn();

    mediaRecorder.addEventListener('pause', pauseHandler);
    mediaRecorder.pause();

    expect(pauseHandler).toHaveBeenCalled();

    let resumeHandler = vi.fn();

    mediaRecorder.addEventListener('resume', resumeHandler);
    mediaRecorder.resume();

    expect(resumeHandler).toHaveBeenCalled();

    let stopHandler = vi.fn();
    let dataHandler = vi.fn();

    mediaRecorder.addEventListener('dataavailable', dataHandler);
    mediaRecorder.addEventListener('stop', stopHandler);
    mediaRecorder.requestData();
    mediaRecorder.stop();

    expect(stopHandler).toHaveBeenCalled();
    expect(dataHandler).toHaveBeenCalledTimes(2);
    expect(dataHandler).toHaveBeenCalledWith(expect.any(BlobEvent));

    let [call] = dataHandler.mock.calls;
    let [event] = call;
    let blob = event.data;

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('audio/webm');
    expect(blob.size).toBe('test'.length);
  });

  it('throws Exceptions correctly', () => {
    let mediaRecorder = new MediaRecorder();

    expect(() => mediaRecorder.pause()).toThrowError('InvalidStateError');
  });

  it('validates the correct mime type', () => {
    expect(MediaRecorder.isTypeSupported('audio/webm')).toBe(true);
    expect(MediaRecorder.isTypeSupported('audio/mp3')).toBe(false);
  });
});
