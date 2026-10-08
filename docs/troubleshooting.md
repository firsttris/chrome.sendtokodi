---
description: Fix SendToKodi extension errors. Kodi not reachable, did not respond in time, wrong username or password, access not granted, "is the SendToKodi addon installed?", status Unknown, video doesn't play on Kodi, shortcuts don't work.
---

# Troubleshooting

Every message the extension shows is listed here with its cause. The first group concerns the connection between
browser and Kodi; the second group concerns playback on Kodi, which is the Kodi add-on's job.

## Connection errors

### "Connection failed – Kodi not reachable"

The browser could not open a connection to the address at all.

- Is Kodi running, and are the computer and the Kodi device on the same network?
- Check the IP address and the port in the connection settings. The IP can change after a router restart; give the
  Kodi device a fixed IP in the router.
- Is **Allow remote control via HTTP** on in Kodi (*Settings → Services → Control*)? Is **Allow remote control from
  applications on other systems** on?
- Is **Use HTTPS** off? Kodi itself only speaks HTTP; HTTPS only works behind a reverse proxy with a certificate.
- A firewall on the Kodi device (Windows Defender Firewall, ufw) may block the port.
- Test from a browser tab: `http://<ip>:<port>/jsonrpc` should ask for the username and password and then show
  Kodi's JSON-RPC page.

### "Kodi did not respond in time – check IP address and port"

The connection opened but nothing answered within eight seconds. Usually a wrong IP address that belongs to another
device, a port that is open but not Kodi's, or a Kodi device in standby. Check the address and whether Kodi is awake.

### "Wrong username or password"

Kodi answered *401 Unauthorized*. Use exactly the username and password from Kodi's *Settings → Services → Control*;
both are case-sensitive. Behind a reverse proxy, make sure the proxy forwards the `Authorization` header to Kodi.

### "Access to Kodi was not granted. Please allow access when asked."

The extension asks the browser once for permission to talk to your Kodi's address, and the prompt was dismissed or
denied. Open the popup or the settings page and click **Test Connection** (or **Play**) again; choose **Allow** in the
prompt.

The context menu and the keyboard shortcuts cannot show this prompt (browsers only allow it after a click inside the
extension), so test the connection once from the popup or the settings page. In Firefox, the permission can also be
checked under `about:addons` → SendToKodi → *Permissions*.

### "No IP address configured – please set up the connection in the settings"

The active connection has no address. Open the settings and enter it, or select another connection in the dropdown.

### "Kodi responded with an error (…)"

Kodi answered with an HTTP status other than 200 or 401. A `403` usually means Kodi's web server denies the request;
a `404` means the address is a web server, but not Kodi's JSON-RPC endpoint (a reverse proxy path, for example).

### The status badge says "Unknown"

The reachability check runs only after you have granted access to that Kodi once. Click **Test Connection**.

## Playback errors

### "Kodi error: … – is the SendToKodi addon installed?"

Kodi received the request and refused it with a JSON-RPC error. In almost all cases the
[SendToKodi Kodi add-on](https://github.com/firsttris/plugin.video.sendtokodi) is missing, disabled or outdated:
Kodi does not know `plugin.video.sendtokodi`. Install or update it following its
[installation guide](https://firsttris.github.io/plugin.video.sendtokodi/installation.html) and enable it under
*Add-ons → My add-ons → Video add-ons*.

### Kodi shows "Could not resolve the url" or starts but doesn't play

The extension did its job: Kodi accepted the URL. Resolving the website is done by yt-dlp inside the Kodi add-on, and
websites change often. In this order:

1. Update yt-dlp in Kodi: *SendToKodi → Configure → yt-dlp → Update yt-dlp now*, and switch the release channel to
   *Nightly* if the stable release doesn't help yet.
2. For YouTube, check that the JavaScript runtime (Deno) is installed in the same settings.
3. Read the Kodi add-on's [troubleshooting page](https://firsttris.github.io/plugin.video.sendtokodi/troubleshooting.html),
   which covers the yt-dlp error messages one by one.
4. If it still fails, report it in the
   [Kodi add-on's issues](https://github.com/firsttris/plugin.video.sendtokodi/issues) with the URL and Kodi's log.

### The video plays on Kodi, but in low quality

Quality is chosen on the Kodi side. Check *Maximum resolution* and the DASH manifest builder in the Kodi add-on's
[settings](https://firsttris.github.io/plugin.video.sendtokodi/settings.html#adaptive).

## Other problems

### The shortcuts don't work

- Another extension or the browser itself may use `Alt+Shift+K` or `Alt+Shift+Q`. Assign other keys as described in
  [Usage](usage.md#keyboard-shortcuts).
- The shortcuts act on the active tab; a browser-internal page (`chrome://`, `about:`) has no URL to send.
- In Firefox, a shortcut only works after the extension was granted access to the Kodi address once from the popup.

### The context menu entries are missing

The entries are created when the extension is installed or the browser starts. After an update, restart the browser
once. Both entries sit in a *SendToKodi* submenu of the context menu, not at its top level.

### Settings are gone after reinstalling or on another computer

Connections are stored in the browser's extension storage. Removing the extension deletes them. They sync to other
computers only with browser sync turned on for extensions, and only within the same browser (Chrome does not sync to
Firefox).

### The popup is empty or shows only a spinner

Reload the extension (`chrome://extensions` → reload, or `about:addons` → disable and enable) and open the popup
again. If it persists, [open an issue](https://github.com/firsttris/chrome.sendtokodi/issues) with the browser's
version and the errors from the extension's console (`chrome://extensions` → *Details* → *Inspect views*).

## Reporting a bug

[Open an issue](https://github.com/firsttris/chrome.sendtokodi/issues) with the browser and its version, the Kodi
version, the exact error message and, for connection problems, what `http://<ip>:<port>/jsonrpc` shows in a browser
tab. Playback problems belong to the [Kodi add-on's issues](https://github.com/firsttris/plugin.video.sendtokodi/issues).
