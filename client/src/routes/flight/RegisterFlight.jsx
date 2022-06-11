import React, { Component } from "react";
import Input from "../../components/Forms/Input/Input";
import Button from "../../components/Common/Button/Button";
import Label from "../../components/Forms/Label/Label";
import EthButton from "../../components/Common/EthButton/EthButton";

class RegisterFlight extends Component {
  render() {
    return (
      <React.Fragment>
        <form className="overflow-auto px-8">
          <h2 className="text-2xl py-4">Register Flight</h2>
          <div class="mb-6 ">
            <Label name="Flight Name" />
            <Input />
          </div>
          <div class="mb-6 ">
            <Label name="From" />
            <Input />
          </div>
          <div class="mb-6 ">
            <Label name="To" />
            <Input />
          </div>
          <Button buttonName="Register Flight" />
        </form>
      </React.Fragment>
    );
  }
}
export default RegisterFlight;
