import type { Connection } from './types';

const PLUGIN_BASE = 'plugin://plugin.video.sendtokodi/';
const REQUEST_TIMEOUT_MS = 8000;

export type KodiErrorCode = 'noHost' | 'permission' | 'timeout' | 'unreachable' | 'unauthorized' | 'http' | 'rpc';

export class KodiError extends Error {
  constructor(
    public readonly code: KodiErrorCode,
    public readonly detail = ''
  ) {
    super(detail ? `${code}: ${detail}` : code);
    this.name = 'KodiError';
  }
}

type JsonRpcResponse<T> = { id: number; result?: T; error?: { code: number; message: string } };

export const createKodiUrl = (connection: Connection) =>
  `${connection.secure ? 'https' : 'http'}://${connection.ip.trim()}:${connection.port.trim() || '8080'}/jsonrpc`;

/** Match pattern used for the optional host permission of this connection (ports are ignored by match patterns). */
export const createOriginPattern = (connection: Connection) =>
  `${connection.secure ? 'https' : 'http'}://${connection.ip.trim()}/*`;

// The SendToKodi addon reads everything after "?" as the media URL, so it must not be encoded.
export const buildPlayFile = (mediaUrl: string) => `${PLUGIN_BASE}?${mediaUrl.trim()}`;

export const buildQueueFile = (mediaUrl: string, title?: string) => {
  const params = new URLSearchParams({ action: 'queue', url: mediaUrl.trim() });
  const trimmedTitle = title?.trim();
  if (trimmedTitle) params.set('title', trimmedTitle);
  return `${PLUGIN_BASE}?${params.toString()}`;
};

export const sendJsonRpc = async <T = unknown>(
  connection: Connection,
  method: string,
  params: Record<string, unknown> = {}
): Promise<T> => {
  if (!connection.ip.trim()) throw new KodiError('noHost');

  let response: Response;
  try {
    response = await fetch(createKodiUrl(connection), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${connection.login}:${connection.pw || ''}`)}`,
      },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'TimeoutError') throw new KodiError('timeout');
    throw new KodiError('unreachable', (error as Error)?.message);
  }

  if (response.status === 401) throw new KodiError('unauthorized');
  if (!response.ok) throw new KodiError('http', String(response.status));

  let json: JsonRpcResponse<T>;
  try {
    json = await response.json();
  } catch {
    throw new KodiError('http', 'invalid JSON');
  }
  if (json.error) throw new KodiError('rpc', json.error.message);
  return json.result as T;
};

export const ping = (connection: Connection) => sendJsonRpc<string>(connection, 'JSONRPC.Ping');

export const play = (connection: Connection, mediaUrl: string) =>
  sendJsonRpc(connection, 'Player.Open', { item: { file: buildPlayFile(mediaUrl) } });

export const queue = (connection: Connection, mediaUrl: string, title?: string) =>
  sendJsonRpc(connection, 'Player.Open', { item: { file: buildQueueFile(mediaUrl, title) } });

export const stop = async (connection: Connection) => {
  const players = await sendJsonRpc<{ playerid: number }[]>(connection, 'Player.GetActivePlayers');
  await Promise.all((players ?? []).map(({ playerid }) => sendJsonRpc(connection, 'Player.Stop', { playerid })));
};

/**
 * Requests the host permission for the Kodi instance. Must be the first async call inside a
 * user-gesture handler, otherwise Firefox rejects the request.
 */
export const requestHostPermission = async (connection: Connection) => {
  if (!connection.ip.trim()) return false;
  try {
    return await chrome.permissions.request({ origins: [createOriginPattern(connection)] });
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const hasHostPermission = async (connection: Connection) => {
  if (!connection.ip.trim()) return false;
  try {
    return await chrome.permissions.contains({ origins: [createOriginPattern(connection)] });
  } catch {
    return false;
  }
};
