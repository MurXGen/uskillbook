import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PriceComponent from "../components/PriceComponent";
import ImageUploadComponent from "../components/ImageUploadComponent";
import "../checkout.css";

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [paymentMode, setPaymentMode] = useState("Online Mode");
  const [buyType, setBuyType] = useState("Buy");

  return (
    <div className="container">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="price" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <PriceComponent price={price} setPrice={setPrice} onNext={() => setStep(2)} />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="imageUpload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <ImageUploadComponent image={image} setImage={setImage} price={price} paymentMode={paymentMode} setPaymentMode={setPaymentMode} buyType={buyType} setBuyType={setBuyType} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Checkout;
