import React, { Component } from "react";
import Input from "../../components/Forms/Input/Input";
import Button from "../../components/Common/Button/Button";
import Label from "../../components/Forms/Label/Label";
import EthButton from "../../components/Common/EthButton/EthButton";

class SubmitFlight extends Component {
  render() {
    return (
      <React.Fragment>
        <form className="overflow-auto px-8">
          <h2 className="text-2xl py-4">Submit Flight</h2>
          <div class="mb-6 ">
            <Label name="Airline" />
            <Input />
          </div>
          <div class="mb-6 ">
            <Label name="Flight" />
            <Input />
          </div>
          <div class="mb-6 ">
            <Label name="Timestamp" />
            <Input />
          </div>
          <Button buttonName="Submit Flight" />
        </form>
      </React.Fragment>
    );
  }
}
export default SubmitFlight;
