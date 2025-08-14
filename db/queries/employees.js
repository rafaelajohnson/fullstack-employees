// just using the pg client directly; nothing fancy
import db from "#db/client";

/** create one employee and hand it back */
export async function createEmployee({ name, birthday, salary }) {
  const { rows } = await db.query(
    `
    INSERT INTO employees (name, birthday, salary)
    VALUES ($1, $2, $3)
    RETURNING *;
    `,
    [name, birthday, salary]
  );
  return rows[0]; // good enough
}

/** grab everyone (I like seeing them in id order) */
export async function getEmployees() {
  const { rows } = await db.query(`SELECT * FROM employees ORDER BY id;`);
  return rows;
}

/** get one by id (undefined if not found) */
export async function getEmployee(id) {
  const { rows } = await db.query(`SELECT * FROM employees WHERE id = $1;`, [id]);
  return rows[0];
}

/** basic patch update. if nothing to change, just return current row */
export async function updateEmployee({ id, name, birthday, salary }) {
  const set = [];
  const vals = [];
  let i = 1;

  if (name !== undefined)     { set.push(`name = $${i++}`);     vals.push(name); }
  if (birthday !== undefined) { set.push(`birthday = $${i++}`); vals.push(birthday); }
  if (salary !== undefined)   { set.push(`salary = $${i++}`);   vals.push(salary); }

  if (set.length === 0) return getEmployee(id); // nothing to do

  vals.push(id);
  const { rows } = await db.query(
    `UPDATE employees SET ${set.join(", ")} WHERE id = $${i} RETURNING *;`,
    vals
  );
  return rows[0];
}

/** delete and return what was deleted (or undefined) */
export async function deleteEmployee(id) {
  const { rows } = await db.query(
    `DELETE FROM employees WHERE id = $1 RETURNING *;`,
    [id]
  );
  return rows[0];
}
