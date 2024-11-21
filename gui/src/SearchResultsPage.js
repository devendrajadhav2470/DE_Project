import { useState } from "react";
import { useParams } from "react-router-dom";
import VideocardH from "./VideoCardH";
import { useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
function SearchResultsPage({ user, signedIn }) {
  //video list
  // what else?
  //
  // fetch some videos from mongodb
  const [searchResults, SetsearchResults] = useState([]);
  const [show_side_bar, set_show_side_bar] = useState(0);
  const { id } = useParams();
  const [searchQuery, setSeachQuery] = useState("");
  function handleClick(e) {
    if (e.target.parentElement.classList.contains("hamburger")) {
      set_show_side_bar(1);
    } else {
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
  useEffect(() => {
    setSeachQuery(id);
    fetch("http://localhost:3001/videos/search/" + id)
      .then((response) => response.json())
      .then((data) => SetsearchResults(data))
      .catch((error) => console.error("Error fetching videos", error));
  }, [id]);
  return (
    <div className="App" onClick={handleClick} style={{ display: "flex" }}>
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
        <Navbar user={user} SignedIn={signedIn} />
        <div
          className="video-container"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr 1fr",
              marginTop: "200px",
            }}
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
            <div></div>
            <div className="search-results-container">
              {searchResults.map((video) => (
                <VideocardH
                  key={video.id} // Assuming each video has a unique identifier
                  thumbnail={video.videoInfo.snippet.thumbnails.medium.url}
                  title={video.videoInfo.snippet.title}
                  views={video.videoInfo.statistics.viewCount}
                  uploadTime={calculateUploadTime(
                    video.videoInfo.snippet.publishedAt
                  )}
                  tags={video.videoInfo.snippet.tags}
                  youtubeVideoCode={video.youtubeVideoCode}
                  searchQuery={searchQuery}
                />
              ))}
            </div>
            <div></div>
            {/* video here */}
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}
export default SearchResultsPage;
