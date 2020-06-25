import React from "react";
import {Link} from "react-router-dom";
import Banner from "../components/banner";

const Home = () => {
  return (
    <div>
      <Banner />

      <Link to="..">Go Back</Link>
    </div>
  );
};

export default Home;
