import { Component } from "react";
/**
 * Component which renders a button
 */
class Dialog extends Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }
  render() {
    return (
      <dialog id="dialog" className="mt-40 bg-blue-50">
        <div className="">
          <span className="float-right" onClick={this.handleClose}>
            &times;
          </span>
          <p>{this.props.message}</p>
        </div>
      </dialog>
    );
  }

  async handleClose(e) {
    e.preventDefault();
    window.dialog.close();
  }
}

export default Dialog;
