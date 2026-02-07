import type { IncomingHttpHeaders } from 'http';

export function resolveBaseUrl(
  headers: IncomingHttpHeaders,
  fallback?: string
): string | undefined {
  const hostHeader = headers['x-forwarded-host'] ?? headers.host;
  const host = Array.isArray(hostHeader) ? hostHeader[0] : hostHeader;
  if (!host) return fallback;

  const protoHeader = headers['x-forwarded-proto'];
  const proto = Array.isArray(protoHeader) ? protoHeader[0] : protoHeader;
  const isLocal = host.includes('localhost') || host.includes('127.0.0.1');
  const protocol = proto || (isLocal ? 'http' : 'https');

  return `${protocol}://${host}`;
}
