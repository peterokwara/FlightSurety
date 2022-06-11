import { Component } from "react";

/**
 * Component which renders a text label
 */
class Label extends Component {
  render() {
    return (
      <label className="block mb-2 text-sm font-medium text-gray-900">
        {this.props.name}
      </label>
    );
  }
}

export default Label;
