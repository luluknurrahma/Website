import React from "react";
import logo from "../assets/bmkg_logo.png";

export default function Header({ title = "Badan Meteorologi, Klimatologi, dan Geofisika", subtitle = "Meteorologi Maritim" }) {
  return (
    <div className="header">
      <div className="accent"></div>
      <img src={logo} alt="BMKG Logo" style={{ height: "50px", marginRight: "20px" }} />
      <div>
        <h2 style={{ margin: 0, color: "#1a1a4b", fontWeight: 700 }}>{title}</h2>
        <p style={{ margin: 0, color: "#1a1a4b" }}>{subtitle}</p>
      </div>
    </div>
  );
}
