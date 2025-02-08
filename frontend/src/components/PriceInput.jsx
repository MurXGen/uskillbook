function PriceInput({ price, setPrice }) {
    return (
      <div>
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Enter price" />
      </div>
    );
  }
  
  export default PriceInput;
  