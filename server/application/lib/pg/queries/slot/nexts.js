({ datetime, duration, allDay, profileId }) => {
  const builder = lib.pg.builder.build.select()
    .from('Slot')
    .where('datetime', '>=', datetime)
    .where('profileId', '=', profileId);

  if (!allDay) {
    builder.whereRaw(
      (p) => `"datetime" < ${p.add(datetime)}::timestamp + (${p.add(duration)} * INTERVAL '1 minute')`
    );
  } else {
    const [date] = datetime.toISOString().split('T');
    const end = new Date(date + 'T23:59:59.999Z').toISOString();
    builder.where('datetime', '<=', end)
  }
 
  return builder;
};