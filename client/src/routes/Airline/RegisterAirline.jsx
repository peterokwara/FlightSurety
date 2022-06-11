import React, { Component } from "react";
import Input from "../../components/Forms/Input/Input";
import Button from "../../components/Common/Button/Button";
import Label from "../../components/Forms/Label/Label";
import EthButton from "../../components/Common/EthButton/EthButton";

class RegisterAirline extends Component {
  render() {
    return (
      <React.Fragment>
        <form className="overflow-auto px-8">
          <h2 className="text-2xl py-4">Register Airline</h2>
          <div class="mb-6 ">
            <Label name="Airline Name" />
            <Input />
          </div>
          <div class="mb-6 ">
            <Label name="Airline Address" />
            <Input />
          </div>
          <Button buttonName="REGISTER" />
        </form>
      </React.Fragment>
    );
  }
}
export default RegisterAirline;
