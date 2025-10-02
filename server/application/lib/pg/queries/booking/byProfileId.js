({ profileId, kind, limit, offset, count = false }) => {
  const [today] = new Date().toISOString().split('T');
  const start = new Date(today + 'T00:00:00.000Z').toISOString();
  const op = kind === 'past' ? '<=' : '>=';
  
  const builder = lib.pg.builder.build.select()
    .from('Booking')
    .where('profileId', '=', profileId)
    .where('datetime', op, start)
    .limit(limit)
    .offset(offset);
  
  if (count) builder.count();
  if (kind === 'future') builder.where('state', '!=', 'cancelled');

  return builder;
};
