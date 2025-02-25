import { useState } from "react";
import { motion } from "framer-motion"; // Import motion
import AddSupplier from "../components/AddSupplier.jsx";
import SupplierList from "../components/SupplierList.jsx";
import SupplierTransaction from "../components/SupplierTransaction.jsx";
import TransactionSummary from "../components/TransactionSummary";
import "../Supplier.css";

const Dealer = () => {
  const [refresh, setRefresh] = useState(false);
  const [showForm, setShowForm] = useState(false); // State to show/hide AddSupplier

  return (
    <div>
      <button className="showAddSupplier" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Hide Form" : "Add Supplier"}
      </button>

      {/* Sliding animation */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: showForm ? "auto" : 0, opacity: showForm ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        style={{ overflow: "hidden" }}
      >
        {showForm && <AddSupplier onAdd={() => setRefresh(!refresh)} />}
      </motion.div>

      <SupplierTransaction onTransaction={() => setRefresh(!refresh)} />
      <TransactionSummary />
      <SupplierList refresh={refresh} />
    </div>
  );
};

export default Dealer;
