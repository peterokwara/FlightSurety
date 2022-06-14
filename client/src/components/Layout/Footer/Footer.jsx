import { Component } from "react";

/**
 * Component which renders the footer
 */
class Footer extends Component {
  render() {
    return (
      <footer className="mt-auto h-max w-full fixed bottom-0 text-center py-4">
        <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2022{" "}
          <a href="https://flowbite.com" className="hover:underline">
            BigSmoke™
          </a>
          . All Rights Reserved.
        </span>
      </footer>
    );
  }
}

export default Footer;
