import React, { Component } from "react";
import Input from "../../components/Forms/Input/Input";
import Button from "../../components/Common/Button/Button";
import Label from "../../components/Forms/Label/Label";
import ServiceFactory from "../../factories/serviceFactory";
import Dialog from "../../components/Common/Dialog/Dialog";
import InputDate from "../../components/Forms/InputDate/InputDate";

class RegisterFlight extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isBusy: false,
      message: "Loading page, please wait",
      flightName: "",
      from: "",
      to: "",
      date: "",
    };

    this.setState = this.setState.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  render() {
    return (
      <React.Fragment>
        <form className="overflow-auto px-8 md:px-12">
          <Dialog message={this.state.modalMessage} />
          <h2 className="text-2xl py-4">Register Flight</h2>
          <div class="mb-6 ">
            <Label name="Flight Name" />
            <Input inputName="flightName" inputChange={this.handleChange} />
          </div>
          <div class="mb-6 ">
            <Label name="From" />
            <Input inputName="from" inputChange={this.handleChange} />
          </div>
          <div class="mb-6 ">
            <Label name="To" />
            <Input inputName="to" inputChange={this.handleChange} />
          </div>
          <div class="mb-6 ">
            <Label name="Date" />
            <InputDate inputName="date" inputChange={this.handleChange} />
          </div>
          <Button
            buttonName="Register Flight"
            buttonClick={this.handleClick}
          />
        </form>
      </React.Fragment>
    );
  }

  /**
   * Handle input change in the input fields
   * @param e The event emitted
   */
  async handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  /**
   * Handle clicking the register button
   * @param e The event emitted
   */
  async handleClick(e) {
    e.preventDefault();

    await this.setState(
      {
        isBusy: true,
        message: "Registering the airline, please wait",
      },
      async () => {
        // Input validation
        if (
          !this.state.flightName ||
          !this.state.from ||
          !this.state.to ||
          !this.state.date
        ) {
          this.setState({
            isBusy: false,
            message: "",
            modalMessage:
              "Please fill in the input values first before proceeding",
          });

          window.dialog.showModal();
          return;
        }

        // Get the ethereum service
        const ethereumService = await ServiceFactory.get("ethereum-service");

        // Set the operational status
        const response = await ethereumService.registerFlight(
          this.state.flightName,
          this.state.from,
          this.state.to,
          this.state.date
        );

        this.setState({
          isBusy: false,
          message: "",
          modalMessage: response.error,
        });

        if (response.error) {
          window.dialog.showModal();
        }
      }
    );
  }
}
export default RegisterFlight;
