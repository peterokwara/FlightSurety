import React, { Component } from "react";
import Input from "../../components/Forms/Input/Input";
import Label from "../../components/Forms/Label/Label";
import EthButton from "../../components/Common/EthButton/EthButton";
import ServiceFactory from "../../factories/serviceFactory";
import Dialog from "../../components/Common/Dialog/Dialog";

class ClaimInsurance extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isBusy: false,
      message: "Loading page, please wait",
      amount: "Get amount",
    };

    this.setState = this.setState.bind(this);
    this.handleClaim = this.handleClaim.bind(this);
    this.handleGetAmount = this.handleGetAmount.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  render() {
    return (
      <React.Fragment>
        <form className="overflow-auto px-8 md:px-12">
          <Dialog message={this.state.modalMessage} />
          <h2 className="text-2xl py-4">Claim Insurance</h2>
          <div class="mb-6">
            <Label name="Amount" />
            <div className="relative w-full md:w-96">
              <Input
                inputName="amount"
                inputChange={this.handleChange}
                inputValue={this.state.amount}
              />
              <button
                className="absolute top-0 right-0 text-gray-900 bg-gray-100
                  hover:bg-gray-200 
                    focus:ring-4 focus:outline-none
                  focus:ring-blue-300 font-medium rounded-lg 
                    text-sm p-3 text-center inline-flex items-center"
                onClick={this.handleGetAmount}
              >
                Get Amount
              </button>
            </div>
          </div>
          <EthButton
            buttonName="Claim Insurance"
            buttonClick={this.handleClaim}
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
  async handleClaim(e) {
    e.preventDefault();

    await this.setState(
      {
        isBusy: true,
        message: "Registering the airline, please wait",
      },
      async () => {
        // Input validation
        if (!this.state.amount) {
          // Show spinner and status
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
        const response = await ethereumService.pay(this.state.amount);

        this.setState({
          isBusy: false,
          message: "",
          modalMessage: response.error,
        });

        // Show a dialog in case there is an error
        if (response.error) {
          window.dialog.showModal();
        }
      }
    );
  }

  /**
   * Handle clicking the register button
   * @param e The event emitted
   */
  async handleGetAmount(e) {
    e.preventDefault();

    // Show spinner and status
    await this.setState(
      {
        isBusy: true,
        message: "Registering the airline, please wait",
      },
      async () => {
        // Get the ethereum service
        const ethereumService = await ServiceFactory.get("ethereum-service");

        // Set the operational status
        const response = await ethereumService.getPendingPayment();

        // Hide spinner and status
        this.setState({
          isBusy: false,
          message: "",
          modalMessage: response.error,
          amount: response.amount,
        });

        // Show a dialog in case there is an error
        if (response.error) {
          window.dialog.showModal();
        }
      }
    );
  }
}
export default ClaimInsurance;
