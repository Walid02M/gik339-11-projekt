const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getOneProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productsController");

router.get("/", getAllProducts);
router.get("/:id", getOneProduct);
router.post("/", createProduct);
router.put("/", updateProduct);          // PUT utan :id (id kommer i body)
router.delete("/:id", deleteProduct);

module.exports = router;
