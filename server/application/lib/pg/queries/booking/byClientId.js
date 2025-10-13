({ clientId, count = false }) => {
  const builder = lib.pg.builder.build.select()
    .from('Booking')
    .where('clientId', '=', clientId);

  if (count) builder.count();
  else builder.orderBy('datetime', 'ASC');
  return builder;
};
