({ clientId, count = false, today = false }) => {
  const [date] = new Date().toISOString().split('T');
  const start = new Date(date + 'T00:00:00.000Z').toISOString();
  const end = new Date(date + 'T23:59:59.999Z').toISOString();
  const builder = lib.pg.builder.build.select()
    .from('Booking')
    .where('clientId', '=', clientId);
  if (today) {
    builder
      .where('datetime', '>=', start)
      .where('datetime', '<=', end)
      .whereIn('state', ['confirmed', 'pending']);
  }
  if (count) builder.count();
  else builder.orderBy('datetime', 'ASC');
  return builder;
};
