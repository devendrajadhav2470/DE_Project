import { Link } from "react-router-dom";
import logo from "./VidNation-logos/VidNation-logos-cropped.jpeg";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import backgroundImage from "./VidNation-logos/tyson.jpg";
const logoBlue = "#495FA6";
const logoRed = "#E74E35";
function Navbar({ SignedIn, user }) {
  //   const [SignedIn,setSignedIn] = useState(0)
  const [searchQuery, SetsearchQuery] = useState("");
  useEffect(() => {}, []);
  function handleSubmit() {}
  return (
    <div
      className="Navbar"
      style={{
        display: "grid",
        // backgroundColor: "rgba(255, 0, 0, 0.5)", // Red with some opacity
        // backgroundImage: `url(${backgroundImage})`, // Set the background image
        // backgroundSize: "cover", // Cover the entire container
        // backgroundPosition: "center", // Center the background image
        // backgroundRepeat: "no-repeat", // Do not repeat the background image
        gridTemplateColumns: "6fr 4fr 3fr ",
        position: "fixed",
        overflow: "hidden",
        // backgroundColor: logoRed,
      }}
    >
      <img
        className="bg"
        src={backgroundImage}
        style={{
          opacity: "1",
          width: "100%",
          height: "auto",
          position: "absolute",
          left: "0",
          top: "0",
          zIndex: "-1",
        }}
      />
      <Link to={"/"}>
        <div className="logo-container">
          {" "}
          <img src={logo} style={{ width: "400px" }} />
        </div>
      </Link>
      <div
        className="search-bar-container1"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <input
          className="search-bar"
          style={{
            border: "4px solid",
            borderColor: logoBlue,
            width: "700px",
            height: "45px",
            fontSize: "30px",
          }}
          value={searchQuery}
          onChange={(e) => {
            SetsearchQuery(e.target.value);
          }}
        />
        <Link
          to={
            SignedIn
              ? "/search-results/" + user.user_name + " " + searchQuery
              : "/search-results/" + "!" + " " + searchQuery
          }
        >
          <div
            style={{
              // border: "4px solid",
              // borderColor: logoBlue,
              cursor: "pointer",
              height: "45px",
              width: "50px",
            }}
          >
            <FaSearch className="search-icon" size={"35px"} />
          </div>
        </Link>
      </div>
      <div
        className="account-info"
        style={{
          fontFamily: "Roboto",
          fontSize: "35px",
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          color: "white",
        }}
      >
        {SignedIn ? (
          <div>
            {/* <div className="profile-pic-container">
              <img src={user.profile_pic} />
            </div> */}
            <div className="user-name-container">@{user.user_name} </div>
          </div>
        ) : (
          <Link
            to={"/signinpage"}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}
export default Navbar;

// what do i want to do now ?
// i want to just chill
// i want to just chill
// i want to write code
// but what is it that i should write
// i should write that code
// shouldn't I
// yep i should write that code
