import db from "#db/client";

await db.connect();

try {
  await seedEmployees();
  console.log("🌱 seeded ok");
} catch (err) {
  console.error("seed blew up:", err);
} finally {
  await db.end();
}

async function seedEmployees() {
  // start clean so re-running doesn’t stack duplicates
  await db.query("BEGIN");
  try {
    await db.query("DELETE FROM employees;"); // quick and dirty reset

    const people = [
      ["Ava Nguyen",      "1994-05-14", 115000],
      ["Mateo Silva",     "1992-02-01", 112000],
      ["Sofia Park",      "1996-09-23",  98000],
      ["Liam Patel",      "1991-12-11",  94000],
      ["Noah Kim",        "1989-03-07", 122000],
      ["Mia Rodriguez",   "1995-04-19",  88000],
      ["Oliver Chen",     "1990-07-30", 128000],
      ["Emma Johnson",    "1993-10-05",  90000],
      ["Lucas Brown",     "1997-01-27",  82000],
      ["Isabella Davis",  "1994-11-02",  91000],
      ["Ethan Garcia",    "1992-06-18", 118000], // extra couple, why not
      ["Amelia Wong",     "1998-08-09",  87000],
    ];

    for (const [name, birthday, salary] of people) {
      await db.query(
        `INSERT INTO employees (name, birthday, salary) VALUES ($1,$2,$3);`,
        [name, birthday, salary]
      );
    }

    await db.query("COMMIT");
  } catch (e) {
    await db.query("ROLLBACK");
    throw e;
  }
}

