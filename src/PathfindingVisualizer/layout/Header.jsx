import React, { Component } from "react";
import "./Header.css";

export class Header extends Component {
  render() {
    // const { grid } = this.props.state;
    return (
      <header className="header">
        <h1>Pathfinding Visualizer</h1>
        {/* <Link style={linkStyle} to="/">Home</Link> | <Link style={linkStyle} to = "/about">About</Link> */}
      </header>
    );
  }
}

export default Header;
