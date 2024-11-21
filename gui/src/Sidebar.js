import { BsJustify } from "react-icons/bs";
import { Link } from "react-router-dom";
const Sidebar = ({ user, signedIn, show_side_bar }) => {
  // const [show_side_bar, set_show_side_bar] = useState(0);
  return show_side_bar ? (
    <div className="sidebar">
      <h2>VIDNATION</h2>
      <ul>
        <li>Home</li>
        <li>About</li>
        <li>Contact</li>
        {signedIn ? (
          <Link to={"/history"}>
            <li>History</li>
          </Link>
        ) : (
          ""
        )}
      </ul>
    </div>
  ) : (
    <div className="half-hidden-sidebar">
      <div className="hamburger">
        <BsJustify size={"50px"} color="white" />
      </div>
    </div>
  );
};
export default Sidebar;
