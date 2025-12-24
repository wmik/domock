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
  stream: null;
  videoBitsPerSecond: number;
  ondataavailable: null;
  onerror: null;
  onpause: null;
  onresume: null;
  onstart: null;
  onstop: null;

  constructor(stream: any, options?: MediaRecorderOptions) {
    super();
    this.audioBitrateMode = 'constant';
    this.audioBitsPerSecond = 0;
    this.mimeType = '';
    this.state = 'inactive';
    this.stream = stream;
    this.videoBitsPerSecond = 0;
    this.ondataavailable = null;
    this.onerror = null;
    this.onpause = null;
    this.onresume = null;
    this.onstart = null;
    this.onstop = null;
  }

  static isTypeSupported(mimeType: string) {
    const types = [
      "video/webm",
      "audio/webm",
      "video/webm;codecs=vp8",
      "video/webm;codecs=daala",
      "video/webm;codecs=h264",
      "audio/webm;codecs=opus",
      "video/mp4",
      "video/mp4;codecs=avc1.64003E,mp4a.40.2",
      "video/mp4;codecs=avc1.64003E,opus",
      "video/mp4;codecs=avc3.64003E,mp4a.40.2",
      "video/mp4;codecs=avc3.64003E,opus",
      "video/mp4;codecs=hvc1.1.6.L186.B0,mp4a.40.2",
      "video/mp4;codecs=hvc1.1.6.L186.B0,opus",
      "video/mp4;codecs=hev1.1.6.L186.B0,mp4a.40.2",
      "video/mp4;codecs=hev1.1.6.L186.B0,opus",
      "video/mp4;codecs=av01.0.19M.08,mp4a.40.2",
      "video/mp4;codecs=av01.0.19M.08,opus",
    ];

    return types.includes(mimeType);
  }

  pause() {
    if (this.state === 'inactive') {
      throw new DOMException('InvalidStateError');
    }

    this.state = 'paused';

    let event = new CustomEvent('pause');

    this.dispatchEvent(event);
  }

  requestData() {
    if (this.state === 'inactive') {
      throw new DOMException('InvalidStateError');
    }

    let event = new CustomEvent('dataavailable', {
      detail: new Blob()
    });

    this.dispatchEvent(event);
  }

  resume() {
    if (this.state === 'inactive') {
      throw new DOMException('InvalidStateError');
    }

    this.state = 'recording';

    let event = new CustomEvent('resume');

    this.dispatchEvent(event);
  }

  start(timeSlice?: number) {
    this.state = 'recording';

    let event = new CustomEvent('start');

    this.dispatchEvent(event);
  }

  stop() {
    if (this.state === 'inactive') {
      throw new DOMException('InvalidStateError');
    }

    this.state = 'inactive';

    let dataEvent = new CustomEvent('dataavailable', {
      detail: new Blob()
    });

    this.dispatchEvent(dataEvent);

    let stopEvent = new CustomEvent('stop');

    this.dispatchEvent(stopEvent);
  }
}
