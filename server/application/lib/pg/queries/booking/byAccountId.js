({ accountId, profileId, kind, limit, offset }) => {
  const op = kind === 'past' ? '<=' : '>=';
  const builder = lib.pg.builder.build.select()
    .from('Booking')
    .whereIn(
      'clientId',
      (b) => b.select('clientId').from('Client').where('accountId', '=', accountId)
    )
    .where('state', '!=', 'cancelled');
  
  if (profileId) builder.where('profileId', '=', profileId);
  if (limit) builder.limit(limit);
  if (offset) builder.offset(offset);

  return builder.orderBy('createdAt', 'DESC');
};
