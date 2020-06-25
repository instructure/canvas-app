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
import Home from "./pages/home";
import About from "./pages/about";
import Users from "./pages/users";

const PathRedirect = () => {
  const location = useLocation();
  // We want to automatically redirect to the root URL
  // which Canvas will render our application on
  if (location.pathname === "/") return <Navigate to="/canvas-app" replace />;
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
                <Link as={NavLink} to="/canvas-app/">
                  Home
                </Link>
              </li>
              <li>
                <Link as={NavLink} to="/canvas-app/about">
                  About
                </Link>
              </li>
              <li>
                <Link as={NavLink} to="/canvas-app/users">
                  Users
                </Link>
              </li>
            </ul>
          </nav>
          <Routes>
            <Route path="/canvas-app/*">
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
