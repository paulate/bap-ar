# BAP Artwork

TODOS
- [ ] loading bar (try fetch api?)
- [ ] transparency? 

# Development

## Setup

### macOS setup

`brew install pango`

_Note_: This may be required for `npm install` to succeed.

### Install dependencies
`npm install`

## Running locally
`npm run start`

## Running locally over HTTPS (required for AR on mobile)

Camera access on mobile browsers requires HTTPS, even on a local network. Do this once to set up:

### One-time setup

1. Install mkcert:
   ```
   brew install mkcert
   mkcert -install
   ```
   `mkcert -install` adds a trusted root CA to your Mac's keychain. Safari and Chrome will trust certs signed by it.

2. Find your local IP:
   ```
   ipconfig getifaddr en0
   ```

3. Generate a cert for your local IP (replace with your actual IP):
   ```
   cd /path/to/bap-ar
   mkcert 10.35.30.4 localhost 127.0.0.1
   ```
   This creates `10.35.30.4+2.pem` and `10.35.30.4+2-key.pem` in the project folder. These are gitignored (`*.pem`).

### Start the HTTPS server

```
npx http-server -S -C "10.35.30.4+2.pem" -K "10.35.30.4+2-key.pem" -p 8080 --cors
```

Then visit `https://localhost:8080` on your Mac or `https://10.35.30.4:8080` on your phone (must be on the same WiFi).

### Trusting the cert on your phone

Your phone needs to trust the mkcert root CA too:

**iPhone:**
1. Run `mkcert -CAROOT` on your Mac to find the CA file location
2. AirDrop `rootCA.pem` to your iPhone
3. Go to Settings → Profile Downloaded → Install
4. Go to Settings → General → About → Certificate Trust Settings → enable the mkcert CA

**Android:**
1. Transfer `rootCA.pem` to your phone
2. Go to Settings → Security → Install from storage (exact path varies by device)

### Note on IP changes

Your local IP may change when you switch networks. If that happens, regenerate the cert with the new IP and update the server start command.
