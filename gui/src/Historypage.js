import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
const HistoryPage = ({ user }) => {
  const [watchedVideos, setWatchedVideos] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const response = await fetch(
        `http://localhost:3001/neo4japi/history/${user.user_name}`
      );
      const data = await response.json();
      console.log("hye", data);
      const videoCodes = Array(data.videos.length);
      for (let i = 0; i < data.videos.length; i++) {
        videoCodes[i] = data.videos[i].videoCode;
      }
      fetch(`http://localhost:3001/videos/${videoCodes.join(",")}`)
        .then((response) => response.json())
        .then((data) => {
          setWatchedVideos(data);
        })
        .catch((error) => console.error("Error fetching videos:", error));
    };

    fetchHistory();
  }, [user.user_name]);

  return (
    <Container>
      <h1 className="mt-4">Watch History</h1>
      <Row className="mt-4">
        {watchedVideos.map((video) => (
          <Col key={video.youtubeVideoCode} lg={3} md={4} sm={6} xs={12}>
            <Card className="mb-4">
              <Card.Img
                variant="top"
                src={video.videoInfo.snippet.thumbnails.medium.url}
              />
              <Card.Body>
                <Card.Title>{video.videoInfo.snippet.title}</Card.Title>
                <Card.Text>
                  Views: {video.videoInfo.statistics.viewCount}
                </Card.Text>
                {/* Add more details as needed */}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default HistoryPage;
