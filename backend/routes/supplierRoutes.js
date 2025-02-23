const express = require("express");
const router = express.Router();
const {
  getSuppliers,
  addSupplier,
  updateBalance,
  deleteSupplier,
} = require("../controllers/supplierController");

router.get("/", getSuppliers);
router.post("/", addSupplier);
router.put("/:supplierId", updateBalance);
router.delete("/:supplierId", deleteSupplier);

module.exports = router;
