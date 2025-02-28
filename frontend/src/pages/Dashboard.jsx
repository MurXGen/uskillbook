import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from '../components/Navbar'
import Bag from '../assets/Bag.png'
import '../index.css';

function Dashboard() {
  const navigate = useNavigate();

  return (
    <>
      <div className="dashboard">
        {/* Pay Now start */}
        <div className="payNow">
          <div className="title">
            <span className="desc">Powered by <strong>Razorpay</strong></span>
            <span className="title">Make Seamless Payment with us</span>
          </div>
          <div className="features">
            <div className="feature">
              <span class="material-symbols-outlined">
                check
              </span>
              <span>Track your payments</span>
            </div>
            <div className="feature">
              <span class="material-symbols-outlined">
                check
              </span>
              <span>Earn upto 10% worth cashback on every purchase</span>
            </div>
          </div>
          <Link className="proceed" to='/checkout'>Proceed to Pay<span class="material-symbols-outlined">
            arrow_right
          </span></Link>
        </div>

        {/* Pay Now end */}

      </div>
    </>
  );
}

export default Dashboard;