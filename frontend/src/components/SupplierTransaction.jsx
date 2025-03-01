import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const API_BASE_URL = "https://uskillbook.onrender.com/api/suppliers";

const SupplierTransaction = ({ onTransaction }) => {
    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState("");
    const [amount, setAmount] = useState("");
    const [reason, setReason] = useState("");
    const [date, setDate] = useState(""); // New state for date selection
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get(API_BASE_URL)
            .then(res => setSuppliers(res.data))
            .catch(err => console.log("Error fetching suppliers:", err));
    }, []);

    const handleTransaction = (change) => {
        if (!reason.trim()) {
            alert("Please enter a reason for the transaction.");
            return;
        }

        setLoading(true);
        
        // Use selected date or default to the current time
        const transactionDate = date ? new Date(date).toISOString() : new Date().toISOString();

        axios.put(`${API_BASE_URL}/${selectedSupplier}`, { 
            amount: change, 
            reason, 
            date: transactionDate 
        })
        .then(() => {
            setAmount("");
            setReason("");
            setDate(""); // Reset date input
            onTransaction();
        })
        .catch(err => console.log("Error updating balance:", err))
        .finally(() => setLoading(false));
    };

    return (
        <motion.div
            className="transaction-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="personReason">
                <select onChange={(e) => setSelectedSupplier(e.target.value)}>
                    <option>Select Supplier</option>
                    {suppliers.map((supplier) => (
                        <option key={supplier._id} value={supplier._id}>{supplier.name}</option>
                    ))}
                </select>

                <input type="text" value={reason} placeholder="Reason" onChange={e => setReason(e.target.value)} />
            </div>

            {/* Date Picker */}
            <div>
                <label>Select Date & Time (Optional): </label>
                <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>

            <div className="transOperation">
                <button className="plus" onClick={() => handleTransaction(Number(amount))} disabled={loading}>
                    {loading ? <span className="loader"></span> : "+"}
                </button>
                <input className="amountInput" type="number" value={amount} placeholder="Amount" onChange={e => setAmount(Number(e.target.value))} />

                <button className="minus" onClick={() => handleTransaction(-Number(amount))} disabled={loading}>
                    {loading ? <span className="loader"></span> : "-" }
                </button>
            </div>

        </motion.div>
    );
};

export default SupplierTransaction;
