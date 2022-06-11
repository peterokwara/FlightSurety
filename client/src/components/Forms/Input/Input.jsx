import { Component } from "react";

/**
 * Component which renders an input field
 */
class Input extends Component {
  render() {
    return (
      <input
        className="bg-gray-50 border border-gray-300
         text-gray-900 text-sm rounded-lg
          focus:ring-blue-500 focus:border-blue-500 
          block w-full p-2.5 z-20"
        value={this.props.inputValue}
        onChange={this.props.inputChange}
        name={this.props.inputName}
        defaultValue={this.props.inputDefault}
        onBlur={this.props.handleBlur}
      ></input>
    );
  }
}

export default Input;
