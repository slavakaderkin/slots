({
  json: { metadata: { pg: 'jsonb' } },
  ip: { js: 'string', metadata: { pg: 'inet' } },
  datetime: { js: 'string', metadata: { pg: 'timestamp with time zone' } },
  date: { js: 'string', metadata: { pg: 'date' } },
  money: { js: 'string', metadata: { pg: 'bigint' } },
  text: { js: 'string', metadata: { pg: 'text' } },
  array: { js: 'array', metadata: { pg: 'text[]' } }
});
