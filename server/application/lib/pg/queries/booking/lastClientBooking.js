({ clientId }) => {
  const builder = lib.pg.builder.build.select()
    .from('Booking')
    .where('clientId', '=', clientId)
    .where('state', '!=', 'cancelled')
    .orderBy('createdAt', 'DESC')
    .limit(1);

  return builder;
};
