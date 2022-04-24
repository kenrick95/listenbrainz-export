# listenbrainz-export

CLI to export ListenBrainz listening data to a file. [ListenBrainz](https://listenbrainz.org/) is an FOSS alternative to Last.fm. 

Inspired by [seanbreckenridge/listenbrainz_export](https://github.com/seanbreckenridge/listenbrainz_export)

## Installation

Requires Node/npm/npx version that supports ES Module.

### via npm globally

```
npm install -g listenbrainz-export
```

```
listenbrainz-export <username> --output [output.json]
```

### via npx

```
npx listenbrainz-export <username> --output [output.json]
```

## Usage

```
Usage: listenbrainz-export [options] <username>

CLI to export listenbrainz listening data

Options:
  -o, --output [fileName]  output file name (default: "output.json")
  -h, --help               display help for command
```
