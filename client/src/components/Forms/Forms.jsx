import React, { Component } from "react";
import Input from "./Input/Input";
import Button from "../Common/Button/Button";
import Label from "./Label/Label";

class Forms extends Component {
  render() {
    return (
      <React.Fragment>
        <form className="overflow-auto px-8">
          <div class="mb-6 ">
            <Label name="Airline Name" />
            <Input />
          </div>
          <div class="mb-6 ">
            <Label name="Airline Name" />
            <Input />
          </div>
          <Button buttonName="test" />
        </form>
      </React.Fragment>
    );
  }
}
export default Forms;
