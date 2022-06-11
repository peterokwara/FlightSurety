import { Component } from "react";
import "./Modal.css";

/**
 * Component which renders a modal
 */
class Modal extends Component {
  render() {
    return (
      <div className={this.props.styles}>
        <div className="flex flex-col ">
          <span className="close self-end" onClick={this.props.click}>
            &times;
          </span>
          <p>Some text in the Modal.. {this.props.text}</p>
        </div>
      </div>
    );
  }
}

export default Modal;
