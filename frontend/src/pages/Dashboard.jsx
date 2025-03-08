import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from '../components/Navbar'
import Bag from '../assets/Bag.png'
import '../index.css';
import AddOrder from '../assets/addOrder.svg'
import CashFlow from '../assets/cashFlow.svg'
import Supplier from '../assets/supplier.svg'
import ReqBook from '../assets/ReqBook.svg'
import History from '../assets/History.svg'

function Dashboard() {
  const navigate = useNavigate();

  return (
    <>
      <div className="dashboard">
        <Link to='/checkout'>
          <div className="addOrder">
            <div className="illustration">
              <img src={AddOrder} alt="" />
            </div>
            <div className="content">
            <span>Add Order</span>
            <span class="material-symbols-outlined">
              arrow_right
            </span>
            </div>
          </div>
        </Link>
        <div className="otherDirects">
        <Link to='/cashflow'>
          <div className="otherBox">
            <div className="illustration">
              <img src={CashFlow} alt="" />
            </div>
            <div className="otherBoxContent">
            <span>Cashflow</span>
            <span class="material-symbols-outlined">
              arrow_right
            </span>
            </div>
          </div>
        </Link>

        <Link to='/dealers'>
          <div className="otherBox">
            <div className="illustration">
              <img src={Supplier} alt="" />
            </div>
            <div className="otherBoxContent">
            <span>Supplier</span>
            <span class="material-symbols-outlined">
              arrow_right
            </span>
            </div>
          </div>
        </Link>

        <Link to='/transaction-history'>
          <div className="otherBox">
            <div className="illustration">
              <img src={History} alt="" />
            </div>
            <div className="otherBoxContent">
            <span>History</span>
            <span class="material-symbols-outlined">
              arrow_right
            </span>
            </div>
          </div>
        </Link>

        <Link to='/needs-orders'>
          <div className="otherBox">
            <div className="illustration">
              <img src={ReqBook} alt="" />
            </div>
            <div className="otherBoxContent">
            <span>Request a Book</span>
            <span class="material-symbols-outlined">
              arrow_right
            </span>
            </div>
          </div>
        </Link>
      
        </div>
      </div>
    </>
  );
}

export default Dashboard;
