import React, { Component } from "react";
import Input from "../../components/Forms/Input/Input";
import Label from "../../components/Forms/Label/Label";
import EthButton from "../../components/Common/EthButton/EthButton";
import ServiceFactory from "../../factories/serviceFactory";
import Dialog from "../../components/Common/Dialog/Dialog";
import InputDate from "../../components/Forms/InputDate/InputDate";

class BuyInsurance extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isBusy: false,
      message: "Loading page, please wait",
      airlineName: "",
      flightName: "",
      amount: "",
      date: "",
    };

    this.setState = this.setState.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  render() {
    return (
      <React.Fragment>
        <form className="overflow-auto px-8">
          <Dialog message={this.state.modalMessage} />
          <h2 className="text-2xl py-4">Buy Insurance</h2>
          <div class="mb-6 ">
            <Label name="Airline Address" />
            <Input inputName="airlineName" inputChange={this.handleChange} />
          </div>
          <div class="mb-6 ">
            <Label name="Flight" />
            <Input inputName="flightName" inputChange={this.handleChange} />
          </div>
          <div class="mb-6 ">
            <Label name="Amount" />
            <Input inputName="amount" inputChange={this.handleChange} />
          </div>
          <div class="mb-6 ">
            <Label name="Date" />
            <InputDate inputName="date" inputChange={this.handleChange} />
          </div>
          <EthButton
            buttonName="Buy Insurance"
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
          !this.state.airlineName ||
          !this.state.flightName ||
          !this.state.amount ||
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
        const response = await ethereumService.buyInsurance(
          this.state.airlineName,
          this.state.flightName,
          this.state.amount,
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
export default BuyInsurance;
