import { useParams } from "react-router-dom";
import { useState } from "react";
import RelatedVideoCard from "./RelatedVideoCard";
import { useEffect } from "react";
import Sidebar from "./Sidebar";
import { FaThumbsUp, FaThumbsDown, FaSave } from "react-icons/fa";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import "./Videopage.css";
const logoBlue = "blue";
function VideoPage({ user, signedIn }) {
  //video list
  // what else?
  //
  // fetch some videos from mongodb
  const { id } = useParams();
  const [show_side_bar, set_show_side_bar] = useState(0);
  const [videoLink, setVideoLink] = useState("");
  // const [relatedVideos, SetRelatedVideos] = useState([]);
  const [relatedVids, SetRelatedVids] = useState([]);
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
    const fetchData = async () => {
      setVideoLink(id);
      console.log(id);
      const response = await fetch(
        `http://localhost:3001/neo4japi/videos/${id}?user_name=${encodeURIComponent(
          user.user_name
        )}`
      );
      // what do i want to do here
      // i want t

      const data = await response.json();
      console.log("hi", data);
      const videoCodes = Array(data.videos.length);
      for (let i = 0; i < data.videos.length; i++) {
        videoCodes[i] = data.videos[i].videoCode;
      }
      fetch(`http://localhost:3001/videos/${videoCodes.join(",")}`)
        .then((response) => response.json())
        .then((data) => {
          SetRelatedVids(data);
        })
        .catch((error) => console.error("Error fetching videos:", error));
      ///
      let thisVideo = {};
      let tempQuery = "";
      const resposeforthisvideo = await fetch(
        `http://localhost:3001/videos/${id}`
      );
      const thisvideoinlist = await resposeforthisvideo.json();

      thisVideo = thisvideoinlist[0];
      tempQuery =
        user.user_name + " " + "+" + " " + thisVideo.videoInfo.snippet.title;
      console.log("tempq", tempQuery);
      fetch("http://localhost:3001/videos/search/" + tempQuery)
        .then((response) => response.json())
        .then((data) => data)
        .catch((error) => console.error("Error fetching videos", error));
      ///

      // first step do that
    };
    fetchData();
  }, [id]);
  function handleClick(e) {
    if (e.target.parentElement.classList.contains("hamburger")) {
      console.log("bhell");
      set_show_side_bar(1);
    } else {
      set_show_side_bar(0);
    }
  }
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
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "200px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "0.25fr 1.5fr 0.75fr",
            }}
          >
            <div></div>
            <div
              className="video"
              style={{
                border: "2px solid",
                borderColor: logoBlue,
                width: "1000px",
                height: "600px",
              }}
            >
              {/* <video controls width={"100%"}>
                  <source
                    src={"https://www.youtube.com/watch?v=FkGP700_Ffw"}
                    type="video/mp4"
                  />
                </video> */}
              <iframe
                width="100%"
                height="100%"
                src={"https://www.youtube.com/embed/" + videoLink}
                title="YouTube Video"
                frameborder="0"
                allowfullscreen
              ></iframe>
              <div className="below-video-container">
                <div className="video-buttons">
                  <button className="like-button">
                    <FaThumbsUp />
                  </button>
                  <button className="dislike-button">
                    <FaThumbsDown />
                  </button>
                  <button className="save-button">
                    <FaSave />
                  </button>
                </div>
              </div>
            </div>{" "}
            <div
              className="related-videos-container"
              style={{
                display: "flex",
                flexDirection: "column",
                overflow: "scroll",
                maxHeight: "900px",
              }}
            >
              {relatedVids.length
                ? relatedVids.map((video) => (
                    <RelatedVideoCard
                      key={video.id} // Assuming each video has a unique identifier
                      thumbnail={video.videoInfo.snippet.thumbnails.medium.url}
                      title={video.videoInfo.snippet.title}
                      views={video.videoInfo.statistics.viewCount}
                      uploadTime={calculateUploadTime(
                        video.videoInfo.snippet.publishedAt
                      )}
                      tags={video.videoInfo.snippet.tags}
                      youtubeVideoCode={video.youtubeVideoCode}
                    />
                  ))
                : "None FOund"}
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}
export default VideoPage;
