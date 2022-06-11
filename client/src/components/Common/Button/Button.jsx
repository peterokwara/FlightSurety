import { Component } from "react";
/**
 * Component which renders a button
 */
class Button extends Component {
  render() {
    return (
      <button
        className="text-gray-900 bg-gray-100
         hover:bg-gray-200 
          focus:ring-4 focus:outline-none
          focus:ring-blue-300 font-medium rounded-lg 
          text-sm px-5 py-2.5 text-center inline-flex items-center"
        onClick={this.props.buttonClick}
      >
        {this.props.buttonName}
      </button>
    );
  }
}

export default Button;
