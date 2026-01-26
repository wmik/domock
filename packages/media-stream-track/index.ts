function uuid() {
  return [
    Math.random().toString(16).substring(2, 10),
    Math.random().toString(16).substring(2, 6),
    Math.random().toString(16).substring(2, 6),
    Math.random().toString(16).substring(2, 6),
    Math.random().toString(16).substring(2, 14)
  ].join('-');
}

type BooleanFlags<T> = {
  [P in keyof T]: boolean;
};

type MediaTrackSettings = {
  width?: number;
  height?: number;
  aspectRation?: number;
  frameRate?: number;
  facingMode?: string;
  resizeMode?: string;
  sampleRate?: number;
  sampleSize?: number;
  echoCancellation?: boolean | string;
  autoGainControl?: boolean;
  noiseSuppresssion?: boolean;
  latency?: number;
  channelCount?: number;
  deviceId?: string;
  groupId?: string;
  backgroundBlur?: boolean;
};

type MediaTrackCapabilities = BooleanFlags<MediaTrackSettings>;

type Constrain<T> = {
  exact: T;
  ideal: T;
};

type Range = {
  max: number;
  min: number;
};

type ConstrainBoolean<T = boolean> = Constrain<T> | T;

type ConstrainDOMString<T = string> = Constrain<T> | T;

type ConstrainULong<T = number> = (Constrain<T> & Range) | T;

type ConstrainDouble<T = number> = (Constrain<T> & Range) | T;

type AnyConstraints = {
  deviceId: ConstrainDOMString;
  groupId: ConstrainDOMString;
};

type AudioConstraints = {
  autoGainControl: ConstrainBoolean;
  channelCount: ConstrainULong;
  echoCancellation: ConstrainBoolean | ConstrainDOMString;
  latency: ConstrainDouble;
  noiseSuppresssion: ConstrainBoolean;
  sampleRate: ConstrainULong;
  sampleSize: ConstrainULong;
  volume: ConstrainDouble;
};

type PointOfInterest = {
  x: number;
  y: number;
};

type ImageConstraints = {
  whiteBalanceMode: 'none' | 'manual' | 'single-shot' | 'continuous';
  exposureMode: 'none' | 'manual' | 'single-shot' | 'continuous';
  focusMode: 'none' | 'manual' | 'single-shot' | 'continuous';
  pointOfInterest: PointOfInterest | PointOfInterest[];
  exposureCompensation: ConstrainDouble;
  colorTemperature: ConstrainDouble;
  iso: ConstrainDouble;
  brightness: ConstrainDouble;
  contrast: ConstrainDouble;
  sharpness: ConstrainDouble;
  focusDistance: ConstrainDouble;
  zoom: ConstrainDouble;
  torch: boolean;
};

type VideoConstraints = {
  aspectRatio: ConstrainDouble;
  facingMode: ConstrainDOMString;
  frameRate: ConstrainDouble;
  height: ConstrainULong;
  width: ConstrainULong;
  resizeMode: ConstrainDOMString<'crop-and-scale' | 'none'>;
};

type ScreenShareConstraints = {
  displaySurface: ConstrainDOMString<'browser' | 'monitor' | 'window'>;
  logicalSurface: ConstrainBoolean;
  suppressLocalAudioPlayback: ConstrainBoolean;
  restrictOwnAudio: ConstrainBoolean;
};

type MediaTrackConstraints = AnyConstraints &
  (
    | AudioConstraints
    | ImageConstraints
    | VideoConstraints
    | ScreenShareConstraints
  );

export class MediaStreamTrack extends EventTarget {
  contentHint:
    | ''
    | 'speech'
    | 'speech-recognition'
    | 'music'
    | 'motion'
    | 'detail'
    | 'text';
  enabled: boolean;
  id: string;
  kind: 'audio' | 'video';
  label: string;
  muted: boolean;
  readyState: 'live' | 'ended';
  oncapturehandlechange: null;
  onended: null;
  onmute: null;
  onunmute: null;

  private _constraints: MediaTrackConstraints = {};
  private _settings: MediaTrackSettings = {};

  constructor() {
    super();

    this.contentHint = '';
    this.enabled = true;
    this.id = uuid();
    this.kind = 'audio';
    /* OneOf "Internal microphone" | "External USB Webcam" */
    this.label = '';
    this.muted = false;
    this.readyState = 'live';
    this.oncapturehandlechange = null;
    this.onended = null;
    this.onmute = null;
    this.onunmute = null;
  }

  applyConstraints(constraints: MediaTrackConstraints): Promise<void> {
    if (this.readyState === 'ended') {
      return Promise.resolve();
    }

    this._constraints = { ...constraints };

    // Update settings based on constraints
    this._settings = {};

    if ('width' in constraints) {
      const widthConstraint = constraints.width as any;
      if (typeof widthConstraint === 'number') {
        this._settings.width = widthConstraint;
      } else if (widthConstraint && typeof widthConstraint === 'object') {
        this._settings.width =
          widthConstraint.ideal ||
          widthConstraint.exact ||
          widthConstraint.max ||
          widthConstraint.min;
      }
    }

    if ('height' in constraints) {
      const heightConstraint = constraints.height as any;
      if (typeof heightConstraint === 'number') {
        this._settings.height = heightConstraint;
      } else if (heightConstraint && typeof heightConstraint === 'object') {
        this._settings.height =
          heightConstraint.ideal ||
          heightConstraint.exact ||
          heightConstraint.max ||
          heightConstraint.min;
      }
    }

    if ('frameRate' in constraints) {
      const frameRateConstraint = constraints.frameRate as any;
      if (typeof frameRateConstraint === 'number') {
        this._settings.frameRate = frameRateConstraint;
      } else if (
        frameRateConstraint &&
        typeof frameRateConstraint === 'object'
      ) {
        this._settings.frameRate =
          frameRateConstraint.ideal ||
          frameRateConstraint.exact ||
          frameRateConstraint.max ||
          frameRateConstraint.min;
      }
    }

    if ('deviceId' in constraints) {
      const deviceIdConstraint = constraints.deviceId as any;
      if (typeof deviceIdConstraint === 'string') {
        this._settings.deviceId = deviceIdConstraint;
      } else if (deviceIdConstraint && typeof deviceIdConstraint === 'object') {
        this._settings.deviceId =
          deviceIdConstraint.ideal || deviceIdConstraint.exact;
      }
    }

    if ('sampleRate' in constraints) {
      const sampleRateConstraint = constraints.sampleRate as any;
      if (typeof sampleRateConstraint === 'number') {
        this._settings.sampleRate = sampleRateConstraint;
      } else if (
        sampleRateConstraint &&
        typeof sampleRateConstraint === 'object'
      ) {
        this._settings.sampleRate =
          sampleRateConstraint.ideal ||
          sampleRateConstraint.exact ||
          sampleRateConstraint.max ||
          sampleRateConstraint.min;
      }
    }

    return Promise.resolve();
  }

  clone(): MediaStreamTrack {
    const cloned = new MediaStreamTrack();
    cloned.contentHint = this.contentHint;
    cloned.enabled = this.enabled;
    cloned.kind = this.kind;
    cloned.label = this.label;
    cloned.muted = this.muted;
    cloned.readyState = this.readyState;
    cloned._constraints = { ...this._constraints };
    cloned._settings = { ...this._settings };
    return cloned;
  }

  getCapabilities(): MediaTrackCapabilities {
    return {
      width: true,
      height: true,
      aspectRation: true,
      frameRate: true,
      facingMode: true,
      resizeMode: true,
      sampleRate: true,
      sampleSize: true,
      echoCancellation: true,
      autoGainControl: true,
      noiseSuppresssion: true,
      latency: true,
      channelCount: true,
      deviceId: true,
      groupId: true,
      backgroundBlur: true
    };
  }

  getConstraints(): MediaTrackConstraints {
    return { ...this._constraints };
  }

  getSettings(): MediaTrackSettings {
    return { ...this._settings };
  }

  stop() {
    this.readyState = 'ended';
  }
}
