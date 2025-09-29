() => {
  const now = new Date().toISOString();
  const past = lib.utils.modTime(now, -3, 'h');
  
  const builder = lib.pg.builder.build.select()
    .from('Booking')
    .where('datetime', '<=', past)
    .where('state', '=', 'confirmed');

  return builder;
};
