export class MediaRecorder extends EventTarget {
  audioBitrateMode: null;
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

  constructor() {
    super();
    this.audioBitrateMode = null;
    this.audioBitsPerSecond = 0;
    this.mimeType = '';
    this.state = 'inactive';
    this.stream = null;
    this.videoBitsPerSecond = 0;
    this.ondataavailable = null;
    this.onerror = null;
    this.onpause = null;
    this.onresume = null;
    this.onstart = null;
    this.onstop = null;
  }

  static isTypeSupported() {}

  pause() {}

  requestData() {}

  resume() {}

  start() {}

  stop() {}
}
