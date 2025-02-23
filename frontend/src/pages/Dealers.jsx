import { useState } from "react";
import AddSupplier from "../components/AddSupplier.jsx";
import SupplierList from "../components/SupplierList.jsx";
import SupplierTransaction from "../components/SupplierTransaction.jsx";

const Dealer = () => {
  const [refresh, setRefresh] = useState(false);
  
  return (
    <div>
      <AddSupplier onAdd={() => setRefresh(!refresh)} />
      <SupplierTransaction onTransaction={() => setRefresh(!refresh)} />
      <SupplierList refresh={refresh} />
    </div>
  );
};

export default Dealer;
