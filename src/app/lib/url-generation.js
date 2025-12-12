export function getBaseUrl(req) {
  const proto = req.headers.get('x-forwarded-proto') || 'http';
  const host = req.headers.get('host');
  return `${proto}://${host}`;
}
