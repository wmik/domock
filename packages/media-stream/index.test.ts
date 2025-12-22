import { MediaStream } from './index';

describe('unit tests', () => {
  it('should export properties correctly', () => {
    let mediaStream = new MediaStream();

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
