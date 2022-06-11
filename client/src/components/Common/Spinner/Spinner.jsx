import { Component } from "react";
import "./Spinner.css";

/**
 * Component which renders a spinner
 */
class Spinner extends Component {
  render() {
    return (
      <div className={this.props.styles}>
        <div className="w-24 h-24 lg:w-48 lg:h-48 md:w-36 md:h-36 border-l-2 border-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }
}

export default Spinner;
