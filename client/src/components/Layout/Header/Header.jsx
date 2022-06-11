import { Component } from "react";
import Button from "../../Common/Button/Button";
import EthButton from "../../Common/EthButton/EthButton";
import WalletButton from "../../Common/WalletButton/WalletButton";
import Link from "../../Common/Link/Link";
import Menu from "../Menu/Menu";

/**
 * Component which renders the header component
 */
class Header extends Component {
  render() {
    return (
      <header className="top-0 h-max my-4 flex flex-col px-4 md:px-12 ">
        <div className="flex flex-row justify-center items-center py-2">
          <div className="flex flex-row items-center">
            <Menu />
            <h1 className="text-2xl ml-3 md:text-6xl font-bold pb-1 content-center ">
              NdovuPay
            </h1>
          </div>

          <div className="flex ml-auto">
            <WalletButton
              buttonName="Connect Wallet"
              buttonClick={this.connectWallet}
              buttonStyle="bg-cyan-600 text-xs text-white mx-2 px-4 py-2 my-2 text-center rounded-full shadow font-sans font-normal"
            />
          </div>
        </div>
        <div className="hidden md:flex md:flex-row lg:flex lg:flex-row justify-center">
          <Link styles="px-2 text-xs" link="/" name="Farm Details" />
          <Link
            styles="px-2 text-xs"
            link="/product-details"
            name="Product Details"
          />
          <Link
            styles="px-2 text-xs"
            link="/product-overview"
            name="Product Overview"
          />
          <Link
            styles="px-2 text-xs"
            link="/transaction-history"
            name="Transaction History"
          />
        </div>
      </header>
    );
  }
}

export default Header;
