import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  buildPlayFile,
  buildQueueFile,
  createKodiUrl,
  createOriginPattern,
  KodiError,
  sendJsonRpc,
  stop,
} from './kodi';
import type { Connection } from './types';

const connection: Connection = {
  id: '1',
  name: 'Kodi',
  ip: '192.168.1.10',
  port: '8080',
  login: 'kodi',
  pw: 'secret',
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('url helpers', () => {
  it('builds the JSON-RPC endpoint', () => {
    expect(createKodiUrl(connection)).toBe('http://192.168.1.10:8080/jsonrpc');
    expect(createKodiUrl({ ...connection, port: '', secure: true })).toBe('https://192.168.1.10:8080/jsonrpc');
  });

  it('builds a port-independent origin pattern', () => {
    expect(createOriginPattern(connection)).toBe('http://192.168.1.10/*');
  });

  it('passes the play URL unencoded, as expected by the SendToKodi addon', () => {
    expect(buildPlayFile(' https://example.com/watch?v=1&t=2 ')).toBe(
      'plugin://plugin.video.sendtokodi/?https://example.com/watch?v=1&t=2'
    );
  });

  it('encodes queue parameters and omits an empty title', () => {
    expect(buildQueueFile('https://example.com/?a=1&b=2', '  ')).toBe(
      'plugin://plugin.video.sendtokodi/?action=queue&url=https%3A%2F%2Fexample.com%2F%3Fa%3D1%26b%3D2'
    );
    expect(buildQueueFile('https://example.com/', 'My Video')).toContain('&title=My+Video');
  });
});

describe('sendJsonRpc', () => {
  it('sends an authenticated request and returns the result', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ id: 1, jsonrpc: '2.0', result: 'pong' }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(sendJsonRpc(connection, 'JSONRPC.Ping')).resolves.toBe('pong');
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('http://192.168.1.10:8080/jsonrpc');
    expect(init.headers.Authorization).toBe(`Basic ${btoa('kodi:secret')}`);
    expect(JSON.parse(init.body)).toMatchObject({ method: 'JSONRPC.Ping', params: {} });
  });

  it.each([
    ['noHost', () => sendJsonRpc({ ...connection, ip: ' ' }, 'JSONRPC.Ping'), undefined],
    [
      'unauthorized',
      () => sendJsonRpc(connection, 'JSONRPC.Ping'),
      () => new Response('Unauthorized', { status: 401 }),
    ],
    ['http', () => sendJsonRpc(connection, 'JSONRPC.Ping'), () => new Response('oops', { status: 500 })],
    [
      'rpc',
      () => sendJsonRpc(connection, 'Player.Open'),
      () => jsonResponse({ id: 1, error: { code: -32602, message: 'Invalid params' } }),
    ],
    [
      'unreachable',
      () => sendJsonRpc(connection, 'JSONRPC.Ping'),
      () => {
        throw new TypeError('Failed to fetch');
      },
    ],
    [
      'timeout',
      () => sendJsonRpc(connection, 'JSONRPC.Ping'),
      () => {
        throw new DOMException('timed out', 'TimeoutError');
      },
    ],
  ])('maps failures to the %s error code', async (code, call, respond) => {
    if (respond)
      vi.stubGlobal(
        'fetch',
        vi.fn(async () => respond())
      );
    const error = (await call().catch((e: unknown) => e)) as KodiError;
    expect(error).toBeInstanceOf(KodiError);
    expect(error.code).toBe(code);
  });
});

describe('stop', () => {
  it('stops every active player', async () => {
    const methods: unknown[] = [];
    vi.stubGlobal(
      'fetch',
      vi.fn(async (_url: string, init: RequestInit) => {
        const body = JSON.parse(String(init.body));
        methods.push([body.method, body.params]);
        return body.method === 'Player.GetActivePlayers'
          ? jsonResponse({ id: 1, result: [{ playerid: 0 }, { playerid: 1 }] })
          : jsonResponse({ id: 1, result: 'OK' });
      })
    );

    await stop(connection);
    expect(methods).toEqual([
      ['Player.GetActivePlayers', {}],
      ['Player.Stop', { playerid: 0 }],
      ['Player.Stop', { playerid: 1 }],
    ]);
  });
});
