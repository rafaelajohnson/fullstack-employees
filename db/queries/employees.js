import db from "#db/client";

/** @returns the employee created according to the provided details */
export async function createEmployee({ name, birthday, salary }) {
  const { rows } = await db.query(
    `
    INSERT INTO employees (name, birthday, salary)
    VALUES ($1, $2, $3)
    RETURNING *;
    `,
    [name, birthday, salary]
  );
  return rows[0];
}

// === Part 2 ===

/** @returns all employees */
export async function getEmployees() {
  const { rows } = await db.query(`SELECT * FROM employees ORDER BY id;`);
  return rows;
}

/**
 * @returns the employee with the given id
 * @returns undefined if employee with the given id does not exist
 */
export async function getEmployee(id) {
  const { rows } = await db.query(
    `SELECT * FROM employees WHERE id = $1;`,
    [id]
  );
  return rows[0]; // undefined if not found
}

/**
 * @returns the updated employee with the given id
 * @returns undefined if employee with the given id does not exist
 */
export async function updateEmployee({ id, name, birthday, salary }) {
  const sets = [];
  const vals = [];
  let i = 1;

  if (name !== undefined)     { sets.push(`name = $${i++}`);     vals.push(name); }
  if (birthday !== undefined) { sets.push(`birthday = $${i++}`); vals.push(birthday); }
  if (salary !== undefined)   { sets.push(`salary = $${i++}`);   vals.push(salary); }

  // nothing to update → just return current row (or undefined)
  if (sets.length === 0) return getEmployee(id);

  vals.push(id);
  const { rows } = await db.query(
    `UPDATE employees SET ${sets.join(", ")} WHERE id = $${i} RETURNING *;`,
    vals
  );
  return rows[0];
}

/**
 * @returns the deleted employee with the given id
 * @returns undefined if employee with the given id does not exist
 */
export async function deleteEmployee(id) {
  const { rows } = await db.query(
    `DELETE FROM employees WHERE id = $1 RETURNING *;`,
    [id]
  );
  return rows[0];
}
