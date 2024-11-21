import { Link } from "react-router-dom";
function VideocardH({
  thumbnail,
  title,
  views,
  uploadTime,
  tags,
  youtubeVideoCode,
  searchQuery,
}) {
  const enoughTags = tags ? tags.slice(0, Math.min(tags.length, 10)) : [];
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
      <Link to={"/video/" + youtubeVideoCode}>
        <div style={{ marginRight: "16px" }}>
          <img
            src={thumbnail}
            alt="Video Thumbnail"
            style={{ width: "360px", height: "270px", objectFit: "cover" }}
          />
        </div>
      </Link>
      <div style={{ flex: "1" }}>
        <Link to={"/video/" + youtubeVideoCode}>
          <h3 style={{ fontSize: "1.2rem", marginBottom: "8px" }}>{title}</h3>
        </Link>
        <p style={{ color: "#555", marginBottom: "8px" }}>{views} views</p>
        <p style={{ color: "#888", marginBottom: "8px" }}>
          Uploaded {uploadTime} ago
        </p>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {enoughTags.map((tag, index) => (
            <span
              key={index}
              style={{
                backgroundColor: "#0073e6",
                color: "#fff",
                padding: "4px 8px",
                borderRadius: "4px",
                marginRight: "8px",
                marginBottom: "8px",
                fontSize: "12px",
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
export default VideocardH;
