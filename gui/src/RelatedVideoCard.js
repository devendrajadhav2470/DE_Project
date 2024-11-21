import React from "react";
import { Link } from "react-router-dom";

const RelatedVideoCard = ({
  thumbnail,
  title,
  channel,
  views,
  uploadTime,
  youtubeVideoCode,
}) => {
  return (
    <div
      style={{
        display: "flex",
        marginBottom: "16px",
        padding: "16px",
        borderBottom: "1px solid #eee",
        fontFamily: "Roboto",
      }}
    >
      <Link to={`/video/${youtubeVideoCode}`}>
        <div style={{ marginRight: "16px" }}>
          <img
            src={thumbnail}
            alt="Video Thumbnail"
            style={{ width: "250px", height: "120px", objectFit: "cover" }}
          />
        </div>
      </Link>
      <div style={{ flex: "1" }}>
        <Link to={`/video/${youtubeVideoCode}`}>
          <h3 style={{ fontSize: "1rem", marginBottom: "8px" }}>{title}</h3>
        </Link>
        <p style={{ color: "#555", marginBottom: "8px" }}>{channel}</p>
        <p style={{ color: "#555", marginBottom: "8px" }}>{views} views</p>
        <p style={{ color: "#888", marginBottom: "8px" }}>
          Uploaded {uploadTime} ago
        </p>
      </div>
    </div>
  );
};

export default RelatedVideoCard;
