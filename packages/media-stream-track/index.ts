export class MediaStreamTrack extends EventTarget {
  contentHint: '' | 'speech' | 'speech-recognition' | 'music' | 'motion' | 'detail' | 'text';
  enabled: boolean;
  id: string;
  kind: 'audio' | 'video';
  label: string;
  muted: boolean;
  readyState: 'live' | 'ended';
  oncapturehandlechange: null
  onended: null
  onmute: null
  onunmute: null

  constructor() {
    super();

    this.contentHint = '';
    this.enabled = true;
    this.id = Math.random().toString(16).substring(2);
    this.kind = 'audio';
    this.label = '';
    this.muted = false;
    this.readyState = 'live'
    this.oncapturehandlechange = null
    this.onended = null
    this.onmute = null
    this.onunmute = null
  }

  applyConstraints() {}
  
  clone() {}
  
  getCapabilities() {}
  
  getConstraints() {}
  
  getSettings() {}
  
  stop() {}
}
