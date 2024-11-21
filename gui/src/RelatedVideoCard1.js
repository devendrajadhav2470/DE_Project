import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Image } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const RelatedVideoCard = ({
  thumbnail,
  title,
  channel,
  views,
  uploadTime,
  youtubeVideoCode,
}) => {
  return (
    <Container style={{ marginBottom: "16px", borderBottom: "1px solid #eee" }}>
      <Row>
        <Col xs={4} md={3}>
          <Link to={`/video/${youtubeVideoCode}`}>
            <Image
              src={thumbnail}
              alt="Video Thumbnail"
              fluid
              style={{ objectFit: "cover", width: "250px", height: "120px" }}
            />
          </Link>
        </Col>
        <Col xs={8} md={9}>
          <div style={{ padding: "16px" }}>
            <Link to={`/video/${youtubeVideoCode}`}>
              <h3 style={{ fontSize: "1rem", marginBottom: "8px" }}>{title}</h3>
            </Link>
            <p style={{ color: "#555", marginBottom: "8px" }}>{channel}</p>
            <p style={{ color: "#555", marginBottom: "8px" }}>{views} views</p>
            <p style={{ color: "#888", marginBottom: "8px" }}>
              Uploaded {uploadTime} ago
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default RelatedVideoCard;
