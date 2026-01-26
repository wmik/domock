import { MediaStream } from '@mocks/media-stream';

type Handler = (e: Event) => void;

type MediaRecorderOptions = {
  mimeType?: string;
  audioBitsPerSecond?: number;
  videoBitsPerSecond?: number;
  bitsPerSecond?: number;
  audioBitrateMode?: 'constant' | 'variable';
  videoKeyFrameIntervalDuration?: number;
  videoKeyFrameIntervalCount?: number;
};

export class MediaRecorder extends EventTarget {
  audioBitrateMode: 'constant' | 'variable';
  audioBitsPerSecond: number;
  mimeType: string;
  state: 'inactive' | 'recording' | 'paused';
  stream: MediaStream | null;
  videoBitsPerSecond: number;
  ondataavailable: Handler | null;
  onerror: Handler | null;
  onpause: Handler | null;
  onresume: Handler | null;
  onstart: Handler | null;
  onstop: Handler | null;

  constructor(stream: MediaStream, options?: MediaRecorderOptions) {
    super();
    this.audioBitrateMode = options?.audioBitrateMode ?? 'variable';
    this.audioBitsPerSecond = options?.audioBitsPerSecond ?? 0;
    this.mimeType = options?.mimeType ?? '';
    this.state = 'inactive';
    this.stream = stream;
    this.videoBitsPerSecond = options?.videoBitsPerSecond ?? 0;
    this.ondataavailable = null;
    this.onerror = null;
    this.onpause = null;
    this.onresume = null;
    this.onstart = null;
    this.onstop = null;
  }

  static isTypeSupported(mimeType: string) {
    const types = [
      'video/webm',
      'audio/webm',
      'video/webm;codecs=vp8',
      'video/webm;codecs=daala',
      'video/webm;codecs=h264',
      'audio/webm;codecs=opus',
      'video/mp4',
      'video/mp4;codecs=avc1.64003E,mp4a.40.2',
      'video/mp4;codecs=avc1.64003E,opus',
      'video/mp4;codecs=avc3.64003E,mp4a.40.2',
      'video/mp4;codecs=avc3.64003E,opus',
      'video/mp4;codecs=hvc1.1.6.L186.B0,mp4a.40.2',
      'video/mp4;codecs=hvc1.1.6.L186.B0,opus',
      'video/mp4;codecs=hev1.1.6.L186.B0,mp4a.40.2',
      'video/mp4;codecs=hev1.1.6.L186.B0,opus',
      'video/mp4;codecs=av01.0.19M.08,mp4a.40.2',
      'video/mp4;codecs=av01.0.19M.08,opus'
    ];

    return types.includes(mimeType);
  }

  pause() {
    if (this.state === 'inactive') {
      throw new DOMException('InvalidStateError');
    }

    this.state = 'paused';

    let event = new Event('pause');

    this.dispatchEvent(event);

    if (typeof this.onpause === 'function') {
      this.onpause(event);
    }
  }

  requestData() {
    if (this.state === 'inactive') {
      throw new DOMException('InvalidStateError');
    }

    let event = new BlobEvent('dataavailable', {
      data: new Blob([noiseGenerator()], { type: this.mimeType }),
      timecode: Date.now()
    });

    this.dispatchEvent(event);

    if (typeof this.ondataavailable === 'function') {
      this.ondataavailable(event);
    }
  }

  resume() {
    if (this.state === 'inactive') {
      throw new DOMException('InvalidStateError');
    }

    this.state = 'recording';

    let event = new Event('resume');

    this.dispatchEvent(event);

    if (typeof this.onresume === 'function') {
      this.onresume(event);
    }
  }

  start(timeSlice?: number) {
    this.state = 'recording';

    let event = new Event('start');

    this.dispatchEvent(event);

    if (typeof this.onstart === 'function') {
      this.onstart(event);
    }
  }

  stop() {
    if (this.state === 'inactive') {
      throw new DOMException('InvalidStateError');
    }

    this.state = 'inactive';

    let dataEvent = new BlobEvent('dataavailable', {
      data: new Blob(['test'], { type: this.mimeType }),
      timecode: Date.now()
    });

    this.dispatchEvent(dataEvent);

    if (typeof this.ondataavailable === 'function') {
      this.ondataavailable(dataEvent);
    }

    let stopEvent = new Event('stop');

    this.dispatchEvent(stopEvent);

    if (typeof this.onstop === 'function') {
      this.onstop(stopEvent);
    }
  }
}

function noiseGenerator() {
  let sampleRate = 44100;
  let duration = 1; //seconds
  let bufferSize = sampleRate * duration;
  let noiseData = new Float32Array(bufferSize)

  for(let i = 0; i < bufferSize; i++) {
    noiseData[i] = Math.random() * 2 - 1
  }

  return noiseData.buffer;
}