import { useState } from "react";
import { Link } from "react-router-dom";
function Videocard({ thumbnail, title, views, uploadTime, youtubeVideoCode }) {
  const [clicked, setClicked] = useState(0);

  return (
    <div
      className="Videocard"
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        overflow: "hidden",
        width: "400px",
        marginBottom: "16px",
        flexShrink: "0",
        boxShadow: "0 0 8px rgba(0, 0, 0, 0.1)",
        fontFamily: "Roboto",
      }}
    >
      <Link to={"/video/" + youtubeVideoCode}>
        <img
          src={thumbnail}
          alt="Video Thumbnail"
          style={{ width: "100%", height: "200px", objectFit: "cover" }}
        />
      </Link>
      <div style={{ padding: "16px" }}>
        <Link to={"/video/" + youtubeVideoCode}>
          <h3 style={{ fontSize: "1.2rem", marginBottom: "8px" }}>{title}</h3>{" "}
        </Link>
        <p style={{ color: "#555", marginBottom: "8px" }}>{views} views</p>
        <p style={{ color: "#888" }}>Uploaded {uploadTime} ago</p>
      </div>
    </div>
  );
}
export default Videocard;
