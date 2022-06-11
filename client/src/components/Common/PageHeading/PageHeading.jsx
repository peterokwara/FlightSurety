import { Component } from "react";

/**
 * Component which renders a page heading
 */
class PageHeading extends Component {
  render() {
    return (
      <h2 className="flex font-bold text-2xl mb-6 justify-center">
        {this.props.name}
      </h2>
    );
  }
}

export default PageHeading;
