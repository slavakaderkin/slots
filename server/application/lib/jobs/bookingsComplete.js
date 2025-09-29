async () => {
  console.info('lib/jobs/bookingsComplete');

  const query = lib.pg.queries.jobs.bookingsComplete();
  const bookings = await lib.pg.builder.query(query);
  for (const booking of bookings) domain.booking.complete({ booking });
}