import { Component } from "react";

/**
 * Component which renders a text label
 */
class Toggle extends Component {
  render() {
    return (
      <label
        for={this.props.id}
        class="inline-flex relative items-center cursor-pointer"
      >
        <input
          type="checkbox"
          value=""
          id={this.props.id}
          className="sr-only peer"
          onChange={this.props.change}
          checked={this.props.checked ? true : false}
        />
        <div
          class="w-11 h-6 bg-gray-200 peer-focus:outline-none 
            peer-focus:ring-4 peer-focus:ring-blue-300 
            rounded-full peer
            peer-checked:after:translate-x-full
          peer-checked:after:border-white after:content-[''] 
            after:absolute after:top-[2px] after:left-[2px]
          after:bg-white after:border-gray-300 after:border
            after:rounded-full after:h-5 after:w-5
            after:transition-all peer-checked:bg-blue-600"
        ></div>
        <span
          class="ml-3 text-sm font-medium 
        text-gray-900"
        >
          Is Operational
        </span>
      </label>
    );
  }
}

export default Toggle;
