// Planetscale config.
const planetscaleConfig = {
  // ReferenceError: Deno is not defined (?!)
  /*
  host: Deno.env.get('DB_HOST') || '',
  username: Deno.env.get('DB_USER') || '',
  password: Deno.env.get('DB_PASS') || ''
  */
  // Hard-coding, for now.
  host: 'us-east.connect.psdb.cloud',
  username: 'j2zi60vl5robjixlngfe',
  password: 'pscale_pw_PDrp8X9RTqSz01JEqsGwfnUxK1e48ESp7sqKTXOj6Yi'
};

export { planetscaleConfig };
