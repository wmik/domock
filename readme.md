# domocks

> Custom API mocks for testing WebRTC media APIs.

A monorepo containing mock implementations of WebRTC media APIs for testing purposes. These mocks provide a predictable and controllable environment for testing applications that use media streams, media stream tracks, and media recorders.

## Packages

This monorepo contains the following packages:

- **[@mocks/media-stream](packages/media-stream)** - Mock implementation of the MediaStream API
- **[@mocks/media-stream-track](packages/media-stream-track)** - Mock implementation of the MediaStreamTrack API
- **[@mocks/media-recorder](packages/media-recorder)** - Mock implementation of the MediaRecorder API

## Installation

Install individual packages as needed:

```bash
npm install @domock/media-stream
npm install @domock/media-stream-track
npm install @domock/media-recorder
```

## Usage

Each package provides mock implementations that can be used in test environments. The mocks are designed to behave like their browser counterparts while providing additional testing utilities.

```javascript
import { MediaStream } from '@domock/media-stream';
import { MediaStreamTrack } from '@domock/media-stream-track';
import { MediaRecorder } from '@domock/media-recorder';

// Use in your tests
const track = new MediaStreamTrack();
const stream = new MediaStream([track]);
const recorder = new MediaRecorder(stream);
```

## Development

This is a monorepo using npm workspaces.

```bash
# Install dependencies
npm install  # or bun/yarn/pnpm

# Build all packages
npm run build  # or bun/yarn/pnpm

# Run tests
npm test  # or bun/yarn/pnpm

# Format code
npm run format  # or bun/yarn/pnpm
```

## License

MIT &copy;2026
