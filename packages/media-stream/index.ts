import { MediaStreamTrack } from '@mocks/media-stream-track';

function uuid() {
  return [
    Math.random().toString(16).substring(2, 10),
    Math.random().toString(16).substring(2, 6),
    Math.random().toString(16).substring(2, 6),
    Math.random().toString(16).substring(2, 6),
    Math.random().toString(16).substring(2, 14)
  ].join('-');
}

type Track = InstanceType<typeof MediaStreamTrack>;
type TrackList = Track[];
type Handler = (e: Event) => void;

export class MediaStream extends EventTarget {
  active: boolean;
  id: string;
  onactive: null;
  onaddtrack: Handler | null;
  oninactive: null;
  onremovetrack: Handler | null;
  #tracks: Track[];

  constructor(streamOrTracks: MediaStream | TrackList) {
    super();

    this.active = true;
    this.id = uuid();
    this.onactive = null;
    this.onaddtrack = null;
    this.oninactive = null;
    this.onremovetrack = null;
    this.#tracks = [];

    if (Array.isArray(streamOrTracks)) {
      this.#tracks = [...streamOrTracks];
    } else if (streamOrTracks instanceof MediaStream) {
      this.#tracks = streamOrTracks.getTracks();
    }
  }

  addTrack(track: Track) {
    if (!this.#tracks.includes(track)) {
      this.#tracks.push(track);

      let event = new Event('addtrack');

      this.dispatchEvent(event);

      if (typeof this.onaddtrack === 'function') {
        this.onaddtrack(event);
      }
    }
  }

  clone() {
    return new MediaStream(this.getTracks());
  }

  getAudioTracks() {
    return this.#tracks.filter(track => track.kind === 'audio');
  }

  getTrackById(id: string) {
    return this.#tracks.find(track => track.id === id);
  }

  getTracks() {
    return [...this.#tracks];
  }

  getVideoTracks() {
    return this.#tracks.filter(track => track.kind === 'video');
  }

  removeTrack(track: Track) {
    const index = this.#tracks.indexOf(track);
    if (index !== -1) {
      this.#tracks.splice(index, 1);

      let event = new Event('removetrack');

      this.dispatchEvent(event);

      if (typeof this.onremovetrack === 'function') {
        this.onremovetrack(event);
      }
    }
  }
}
