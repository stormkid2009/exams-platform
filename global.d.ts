import type { Response } from 'node-fetch';

declare global {
  function fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
  var fetch: typeof fetch;
}

export {};