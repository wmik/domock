import { MediaStreamTrack } from './index';

describe('unit tests', () => {
  it('should export properties correctly', () => {
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
    expect(mediaStreamTrack).toHaveProperty('onmute');
    expect(mediaStreamTrack).toHaveProperty('onunmute');
    expect(mediaStreamTrack).toHaveProperty('applyConstraints');
    expect(mediaStreamTrack).toHaveProperty('clone');
    expect(mediaStreamTrack).toHaveProperty('getCapabilities');
    expect(mediaStreamTrack).toHaveProperty('getConstraints');
    expect(mediaStreamTrack).toHaveProperty('getSettings');
    expect(mediaStreamTrack).toHaveProperty('stop');
  });
});
