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
});
