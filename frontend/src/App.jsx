import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Checkout from "./pages/Checkout";
import OrderSummary from "./pages/OrderSummary";
import NeedsOrders from "./pages/NeedsOrders";
import TransactionHistory from "./pages/TransactionHistory";
import Dealers from "./pages/Dealers";
import Cashflow from "./pages/Cashflow";
import ProtectedRoute from "./components/ProtectedRoute"; // Import Protected Route

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/summary" element={<OrderSummary />} />
        <Route path="/needs-orders" element={<NeedsOrders />} />

        {/* Protected Pages with Password */}
        <Route
          path="/transaction-history"
          element={
            <ProtectedRoute>
              <TransactionHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dealers"
          element={
            <ProtectedRoute>
              <Dealers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cashflow"
          element={
            <ProtectedRoute>
              <Cashflow />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
