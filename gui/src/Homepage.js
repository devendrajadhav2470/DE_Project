import { useState } from "react";
import { useParams } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useEffect } from "react";
import VideocardH from "./VideoCardH";
import Videocard from "./VideoCard";
function Homepage({ user, signedIn }) {
  //   const { id } = useParams();
  //   const [SignedIn, set_SignedIn] = useState(0);
  const [show_side_bar, set_show_side_bar] = useState(0);
  const [videoList, SetvideoList] = useState([]);
  //   const [user, setUser] = useState({});
  // const [searchQuery, SetsearchQuery] = useState("");
  useEffect(() => {
    // get from database whether user is signed in or not
    // Example usage in a React component
    // fetch("http://localhost:3001/api/sqldata")
    //   .then((response) => response.json())
    //   .then((data) => console.log(data))
    //   .catch((error) => console.error("Error fetching data", error));
    // let us first create the search query
    let tempsearchquery = "!";
    const fetchData = async () => {
      if (signedIn) {
        const thisuserresponse = await fetch(
          "http://localhost:3001/mongoUsers/" + user.user_name
        );
        const thisuserdata = await thisuserresponse.json();

        console.log("thisuserdata", thisuserdata.tags);
        for (let i = 0; i < thisuserdata.tags.length; i++) {
          tempsearchquery += " " + thisuserdata.tags[i];
        }
        if (thisuserdata.tags.length == 0) {
          tempsearchquery += " " + "modi" + " " + "demonetization";
        }
        fetch("http://localhost:3001/videos/search/" + tempsearchquery)
          .then((response) => response.json())
          .then((data) => SetvideoList(data))
          .catch((error) => console.error("Error fetching videos", error));
        // fetch("http://localhost:3001/feed/videos")
        //   .then((response) => response.json())
        //   .then((data) => SetvideoList(data))
        //   .catch((error) => console.error("Error fetching videos", error));
      } else {
        fetch("http://localhost:3001/feed/videos")
          .then((response) => response.json())
          .then((data) => SetvideoList(data))
          .catch((error) => console.error("Error fetching videos", error));
      }
    };
    fetchData();
  }, [signedIn]);
  function handleClick(e) {
    // if (e.target.parentElement.classList.contains("hamburger")) {
    //   console.log("bhell");
    //   set_show_side_bar(1);
    // } else {
    //   set_show_side_bar(0);
    // }
    if (
      e.target.closest(".sidebar") ||
      e.target.closest(".half-hidden-sidebar")
    ) {
      // Click occurred inside the sidebar or its descendants
      console.log("Clicked inside the sidebar");
      set_show_side_bar(1);
    } else {
      // Click occurred outside the sidebar
      console.log("Clicked outside the sidebar");
      set_show_side_bar(0);
    }
  }
  // const calculateUploadTime = (publishedAt) => {
  //   // Implement your logic to calculate the time difference from the current date
  //   // For simplicity, you can use a library like 'moment.js' for more advanced date formatting
  //   const uploadDate = new Date(publishedAt);
  //   const currentDate = new Date();
  //   const timeDifference = currentDate - uploadDate;
  //   // Implement your logic to format the time difference as needed
  //   // For example, return "X days ago"
  //   return `${Math.floor(timeDifference / (1000 * 60 * 60 * 24))} days ago`;
  // };
  const calculateUploadTime = (publishedAt) => {
    const uploadDate = new Date(publishedAt);
    const currentDate = new Date();
    const timeDifference = currentDate - uploadDate;

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 31);

    if (days < 1) {
      return `${hours} ${hours === 1 ? "hour" : "hours"} `;
    } else if (days < 31) {
      return `${days} ${days === 1 ? "day" : "days"} `;
    } else if (months < 12) {
      return `${months} ${months === 1 ? "month" : "months"} `;
    } else {
      const years = Math.floor(months / 12);
      return `${years} ${years === 1 ? "year" : "years"} `;
    }
  };
  return (
    <div className="Homepage" onClick={handleClick} style={{ display: "flex" }}>
      <Sidebar user={user} signedIn={signedIn} show_side_bar={show_side_bar} />
      <div
        className="rightside"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          paddingLeft: show_side_bar ? "250px" : "50px",
        }}
      >
        <Navbar SignedIn={signedIn} user={user} />
        <div
          className="video-container"
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "200px",
          }}
        >
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr" }}
          >
            {/* <div
              className="video"
              style={{
                border: "2px solid",
                borderColor: logoBlue,
                width: "800px",
                height: "500px",
              }}
            ></div>{" "} */}

            {videoList.map((video) => (
              <Videocard
                key={video.id} // Assuming each video has a unique identifier
                thumbnail={video.videoInfo.snippet.thumbnails.medium.url}
                title={video.videoInfo.snippet.title}
                views={video.videoInfo.statistics.viewCount}
                uploadTime={calculateUploadTime(
                  video.videoInfo.snippet.publishedAt
                )}
                youtubeVideoCode={video.youtubeVideoCode}
              />
            ))}
            {/* video here */}
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}
export default Homepage;
