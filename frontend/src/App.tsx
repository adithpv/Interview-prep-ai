import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoeyToaster as Toaster } from "goey-toast";
import "goey-toast/styles.css";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Home/Dashboard";
import InterviewPrep from "./pages/InterviewPrep";
import UserProvider from "./context/userContext";

const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/interview-prep/:sessionId"
              element={<InterviewPrep />}
            />
          </Routes>
        </Router>

        <Toaster
          position="top-center"
          showProgress={true}
          duration={4000}
          closeButton="top-right"
          toastOptions={{
            className: "",
            style: {
              fontSize: "13px",
            },
          }}
        />
      </div>
    </UserProvider>
  );
};

export default App;
