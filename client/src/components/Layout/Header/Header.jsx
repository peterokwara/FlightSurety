import { Component } from "react";
import WalletButton from "../../Common/WalletButton/WalletButton";

/**
 * Component which renders the header component
 */
class Header extends Component {
  render() {
    return (
      <header className="top-0 h-max my-4 flex flex-col px-8 md:px-12 ">
        <div className="flex flex-row justify-center items-center py-2">
          <div className="flex flex-row items-center">
            <a href="/">
              <h1 className="text-2xl md:text-6xl font-bold pb-1 content-center ">
                Bima Ndege
              </h1>
            </a>
          </div>

          <div className="flex ml-auto">
            <WalletButton
              buttonName="Connect Wallet"
              buttonClick={this.connectWallet}
              buttonStyle="bg-cyan-600 text-xs text-white mx-2 px-4 py-2 my-2 text-center rounded-full shadow font-sans font-normal"
            />
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
