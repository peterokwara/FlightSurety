import React, { Component } from "react";
import Input from "../../components/Forms/Input/Input";
import Button from "../../components/Common/Button/Button";
import Label from "../../components/Forms/Label/Label";
import EthButton from "../../components/Common/EthButton/EthButton";

class ClaimInsurance extends Component {
  render() {
    return (
      <React.Fragment>
        <form className="overflow-auto px-8">
          <h2 className="text-2xl py-4">Claim Insurance</h2>
          <div class="mb-6">
            <Label name="Amount" />
            <div className="relative w-full">
              <Input />
              <button
                className="absolute top-0 right-0 text-gray-900 bg-gray-100
                  hover:bg-gray-200 
                    focus:ring-4 focus:outline-none
                  focus:ring-blue-300 font-medium rounded-lg 
                    text-sm p-3 text-center inline-flex items-center"
                onClick={this.props.buttonClick}
              >
                Get Amount
              </button>
            </div>
          </div>
          <EthButton buttonName="Claim Insurance" />
        </form>
      </React.Fragment>
    );
  }
}
export default ClaimInsurance;
