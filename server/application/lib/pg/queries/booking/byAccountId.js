({ accountId, profileId, limit, offset }) => {

  const builder = lib.pg.builder.build.select()
    .from('Booking')
    .whereIn(
      'clientId',
      (b) => b.select('clientId').from('Client').where('accountId', '=', accountId)
    )
  
  if (!profileId) builder.where('state', '!=', 'cancelled');
  if (profileId) builder.where('profileId', '=', profileId);
  if (limit) builder.limit(limit);
  if (offset) builder.offset(offset);

  return builder.orderBy('datetime', 'DESC');
};
