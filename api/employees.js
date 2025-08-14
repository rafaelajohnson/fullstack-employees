import express from "express";
import {
  createEmployee,
  getEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
} from "#db/queries/employees.js";

const router = express.Router();

// list
router.get("/", async (_req, res) => {
  try {
    const data = await getEmployees();
    res.json({ data });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// read one
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const row = await getEmployee(id);
  if (!row) return res.status(404).json({ error: "not found" });
  res.json({ data: row });
});

// create
router.post("/", async (req, res) => {
  try {
    const { name, birthday, salary } = req.body;
    const row = await createEmployee({ name, birthday, salary });
    res.status(201).json({ data: row });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// update
router.patch("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const row = await updateEmployee({ id, ...req.body });
  if (!row) return res.status(404).json({ error: "not found" });
  res.json({ data: row });
});

// delete
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const row = await deleteEmployee(id);
  if (!row) return res.status(404).json({ error: "not found" });
  res.json({ data: row });
});

export default router;
