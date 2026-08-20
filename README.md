# local-file-server

A small Express server for testing file downloads and HTTP requests over your local network. It serves a file from the `files/` folder and has a few mock endpoints for trying out GET and POST calls from another device, an app, or a microcontroller.

## Tech stack

| | |
|---|---|
| Runtime | Node.js |
| Web framework | Express 5 |
| Dev server | nodemon (restarts on file changes) |
| Language | JavaScript (CommonJS) |

## Getting started

### Requirements

- Node.js 18 or newer
- npm

### Install and run

```bash
git clone <repo-url>
cd local-file-server
npm install
npm start
```

`npm start` runs `nodemon app.js`. The server listens on port 3000 and prints its local and network URLs on startup:

```
✅ Server running at:
   Local:   http://localhost:3000
   Network: http://192.168.x.x:3000
```

Use the Network URL from any other device on the same Wi-Fi or LAN.

## Serving a file

Put the file you want to serve in the `files/` folder. The `/download` route serves one file, currently `verified-badge-profile-icon-png.webp`. To serve a different one, change the filename in the `/download` route in `app.js`:

```js
const filePath = path.join(__dirname, "files", "your-file.bin");
```

## API

| Method | Path | What it does |
| ------ | ---- | ------------ |
| GET | `/` | Returns `Hello World!` |
| POST | `/` | Returns `Hello World!, Im a post req` |
| GET | `/download` | Downloads the file from `files/` |
| GET | `/links` | Returns JSON with two links (`link1`, `link2`) |
| POST | `/echo` | Returns the `message` field it was sent, as `{ "received": … }` |
| POST | `/login` | Mock login, see below |
| POST | `/firmware` | Logs `deviceId` and `version`, returns `{ "status": "Queued for update", … }` |

POST bodies can be JSON or URL-encoded form data.

### Examples

```bash
curl -O -J http://localhost:3000/download

curl http://localhost:3000/links

curl -X POST http://localhost:3000/echo \
  -H "Content-Type: application/json" \
  -d '{"message":"hi"}'

curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"secret"}'

curl -X POST http://localhost:3000/firmware \
  -H "Content-Type: application/json" \
  -d '{"deviceId":"device-01","version":"20"}'
```

### Mock login

`POST /login` accepts only `username: admin` and `password: secret`, and returns a fixed fake token. Anything else gets a 401. This is a stand-in for testing client code, not real authentication.

## Project structure

```
app.js      The server and all routes
files/      Files available for download
```

## Notes

- `/links` returns placeholder text. Replace `link1` and `link2` in `app.js` with your own URLs.
- `/firmware` only logs the request; it does not queue or perform an update.
- The port (3000) is hardcoded in `app.js`.
- The server has no authentication and is reachable by anyone on your network while it runs. Use it for local testing only.
