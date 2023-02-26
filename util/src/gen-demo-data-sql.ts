/* Run with:
 *  DB_USER=... DB_PASS=... DB_HOST=... deno run -A gen-demo-data-sql.ts
 */
import { handles } from './mockedHandles.js';
import { connect } from 'https://esm.sh/*@planetscale/database@1.4.0';

// Planetscale config.
// Env vars are expected to be defined in the Deno Deploy project.
const pConfig = {
  host: Deno.env.get('DB_HOST') || '',
  username: Deno.env.get('DB_USER') || '',
  password: Deno.env.get('DB_PASS') || ''
};

const conn = connect(pConfig);

console.log('Deleting existing users and handles...');
await conn.execute(`DROP TABLE IF EXISTS user`);
await conn.execute(`DROP TABLE IF EXISTS handles`);

console.log(`Creating the 'user' and 'handles'...`);
const createUserTable = `
CREATE TABLE IF NOT EXISTS user (
  id INT UNIQUE AUTO_INCREMENT,
  name VARCHAR(255) UNIQUE NOT NULL,
  employmentStatus TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY(id)
) CHARACTER SET utf8mb4;
`;

const createHandlesTable = `
-- Planetscale does not support FK constraints, because Vitess does not.
-- foreign key constraints are not allowed, see https://vitess.io/blog/2021-06-15-online-ddl-why-no-fk/
CREATE TABLE IF NOT EXISTS handles (
  id INT UNIQUE AUTO_INCREMENT,
  user_id INT NOT NULL,
  handle VARCHAR(255) NOT NULL,
  handleType VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY(id),
  UNIQUE KEY uniq_user_handle (user_id, handle, handleType)
) CHARACTER SET utf8mb4;
`;

await conn.execute(createUserTable);
await conn.execute(createHandlesTable);
// User create statement.
const userCreate = `
  INSERT INTO user(name, employmentStatus)
  VALUES(:name, :status)
`;

// Handle create statement.
const handleCreate = `
  INSERT INTO handles(user_id, handle, handleType)
  VALUES(:user_id, :handle, :handleType)
`;

const handlePrefix = /\w+\|/; // We'll strip this from the fetched handles
/*
 * If a user record does not exist:
 * 1. Create the user record.
 * 2. Create the 'canonical' handle associated with it.
 *
 * Otherwise, for a given handle, using the corresponding user's ID,
 * generate a handle record for it.
 */
try {
  // These mock handles were originally designed to fit a DynamoDB table
  // (with overloaded schema).
  // We're unfolding that into a relational set of tables.
  let userId;
  for (const h of handles) {
    //console.log(`User ID: ${userId}`);
    //console.log(`Handle: ${h.sk}`);
    const values = {
      name: h.pk.replace(handlePrefix, ''), // 'user|Clyde...' -> 'Clyde'
      status: h.employmentStatus,
      handle: h.sk.replace(handlePrefix, ''),
      handleType: h.handleType
    };
    // Create the user records that are our base.
    if (h.employmentStatus) { // Implies canonical in the set.

      console.log(`\nCreating user ${values.name}`);
      const result = await conn.execute(userCreate, values);
      userId = result.insertId;
      console.log(`${values.name} has id ${userId}`);

      values.user_id = userId;
      const handleResult = await conn.execute(handleCreate, values);
      //console.log(`Handle insert ID: ${handleResult.insertId}`);
    } else {
      // Should have been before canonical handle was created.
      values.user_id = userId;
      console.log(`Creating handle ${values.handle} (${values.handleType}) for user ${values.name}`);
      await conn.execute(handleCreate, values);
    }
  };
} catch (err) {
  console.log('Error ', err);
}
