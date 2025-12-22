export class MediaStream extends EventTarget {
  active: boolean;
  id: string;
  onactive: null;
  onaddtrack: null;
  oninactive: null;
  onremovetrack: null;

  constructor() {
    super();

    this.active = true;
    this.id = Math.random().toString(16).substring(2);
    this.onactive = null;
    this.onaddtrack = null;
    this.oninactive = null;
    this.onremovetrack = null;
  }

  addTrack() {}

  clone() {}

  getAudioTracks() {}

  getTrackById() {}

  getTracks() {}

  getVideoTracks() {}

  removeTrack() {}
}
