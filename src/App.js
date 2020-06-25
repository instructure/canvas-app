import React, {Suspense} from "react";
import {ErrorBoundary} from "react-error-boundary";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link as NavLink,
  Navigate,
  useLocation,
} from "react-router-dom";
import {Link} from "@instructure/ui-link";

// Lets try code splitting!
const Home = React.lazy(() => import("./pages/home"));
const About = React.lazy(() => import("./pages/about"));
const Users = React.lazy(() => import("./pages/users"));

const PathRedirect = () => {
  const location = useLocation();
  // We want to automatically redirect to the root URL
  // which Canvas will render our application on
  if (location.pathname === "/") return <Navigate to="/app-test" replace />;
  return null;
};
const Fallback = () => {
  return <h1>There has been an error.</h1>;
};

const App = () => {
  return (
    <Suspense fallback={"Loading..."}>
      <ErrorBoundary FallbackComponent={Fallback}>
        <Router>
          <PathRedirect />

          <nav>
            <ul>
              <li>
                <Link as={NavLink} to="/app-test/">
                  Home
                </Link>
              </li>
              <li>
                <Link as={NavLink} to="/app-test/about">
                  About
                </Link>
              </li>
              <li>
                <Link as={NavLink} to="/app-test/users">
                  Users
                </Link>
              </li>
            </ul>
          </nav>
          <Routes>
            <Route path="/app-test/*">
              <Route path="/" element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="users" element={<Users />} />
            </Route>
          </Routes>
        </Router>
      </ErrorBoundary>
    </Suspense>
  );
};

export default App;
