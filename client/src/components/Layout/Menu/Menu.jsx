import { Component } from "react";
import Link from "../../Common/Link/Link";
import "./Menu.css";

/**
 * Component which renders the hamburger menu
 */
class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = { menuOpen: true };
  }

  /**
   * Hide or show the hamburger menu
   * @param e onClick event
   */
  toggleMenu = (e) => {
    e.preventDefault();
    this.setState({ menuOpen: !this.state.menuOpen });
  };

  render() {
    return (
      <div className="flex lg:hidden md:hidden">
        <nav className="flex flex-col">
          <svg
            onClick={this.toggleMenu}
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <div className={this.state.menuOpen ? "hideMenuNav" : "showMenuNav"}>
            <svg
              onClick={this.toggleMenu}
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <Link styles="px-2 text-s" link="/" name="Farm Details" />
            <Link
              styles="px-2 text-s"
              link="/product-details"
              name="Product Details"
            />
            <Link
              styles="px-2 text-s"
              link="/product-overview"
              name="Product Overview"
            />
            <Link
              styles="px-2 text-s"
              link="/transaction-history"
              name="Transaction History"
            />
          </div>
        </nav>
      </div>
    );
  }
}

export default Menu;
