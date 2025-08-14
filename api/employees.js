import express from "express";
import {
  createEmployee,
  getEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee
} from "#db/queries/employees.js";

const router = express.Router();

// list
router.get("/", async (_req, res) => {
  try {
    res.json({ data: await getEmployees() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// get by id
router.get("/:id", async (req, res) => {
  try {
    const emp = await getEmployee(Number(req.params.id));
    if (!emp) return res.status(404).json({ error: "Employee not found" });
    res.json({ data: emp });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// create
router.post("/", async (req, res) => {
  try {
    const { name, birthday, salary } = req.body;
    const emp = await createEmployee({ name, birthday, salary });
    res.status(201).json({ data: emp });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// update
router.patch("/:id", async (req, res) => {
  try {
    const updated = await updateEmployee({ id: Number(req.params.id), ...req.body });
    if (!updated) return res.status(404).json({ error: "Employee not found" });
    res.json({ data: updated });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// delete
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await deleteEmployee(Number(req.params.id));
    if (!deleted) return res.status(404).json({ error: "Employee not found" });
    res.json({ data: deleted });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
