import "./App.css";
import "./Sidebar.css";
import React, { useState } from "react";
import Register from "./SignInpage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VideoPage from "./Videopage";
import SearchResultsPage from "./SearchResultsPage";
import Homepage from "./Homepage";
import HistoryPage from "./Historypage";
function App() {
  //video list
  // what else?
  //
  // fetch some videos from mongodb
  const [signedIn, setSignedIn] = useState(0);
  const [user, setUser] = useState({});
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Homepage user={user} signedIn={signedIn} />}
        />
        {/* <Route path="/user/:id" element={<App />} /> */}
        <Route
          path="/video/:id"
          element={<VideoPage user={user} signedIn={signedIn} />}
        />
        <Route
          path="/search-results/:id"
          element={<SearchResultsPage user={user} signedIn={signedIn} />}
        />
        <Route
          path="/signinpage"
          element={<Register setUser={setUser} setSignedIn={setSignedIn} />}
        />
        <Route
          path="/history"
          element={<HistoryPage user={user} signedIn={signedIn} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export { App };
