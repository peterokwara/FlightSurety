import React, { Component } from "react";
import Input from "../../components/Forms/Input/Input";
import Button from "../../components/Common/Button/Button";
import Label from "../../components/Forms/Label/Label";
import EthButton from "../../components/Common/EthButton/EthButton";
import ServiceFactory from "../../factories/serviceFactory";
import Dialog from "../../components/Common/Dialog/Dialog";

class FundAirline extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isBusy: false,
      message: "Loading page, please wait",
      amount: "",
    };

    this.setState = this.setState.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  render() {
    return (
      <React.Fragment>
        <Dialog message={this.state.modalMessage} />
        <form className="overflow-auto px-8">
          <h2 className="text-2xl py-4">Fund Airline</h2>
          <div class="mb-6 ">
            <Label name="Fund Airline" />
            <div className="relative mb-6">
              <Input inputName="amount" inputChange={this.handleChange} />
              <div class="flex absolute inset-y-0 right-2 items-center pl-3 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <EthButton buttonName="Fund Airline" buttonClick={this.handleClick} />
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
        message: "Funding the airline, please wait",
      },
      async () => {
        // Input validation
        if (!this.state.amount) {
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
        const response = await ethereumService.fundAirline(this.state.amount);

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
export default FundAirline;
