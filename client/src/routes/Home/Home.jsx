import React, { Component } from "react";
import Button from "../../components/Common/Button/Button";
import Label from "../../components/Forms/Label/Label";
import Toggle from "../../components/Forms/Toggle/Toggle";
import Spinner from "../../components/Common/Spinner/Spinner";
import ServiceFactory from "../../factories/serviceFactory";
import Dialog from "../../components/Common/Dialog/Dialog";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isBusy: false,
      message: "Loading page, please wait",
      isChecked: false,
    };

    this.setState = this.setState.bind(this);
    this.onToggle = this.onToggle.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleAuthorizeClick = this.handleAuthorizeClick.bind(this);
  }

  render() {
    return (
      <React.Fragment>
        <form className="overflow-auto px-8">
          <Dialog message={this.state.modalMessage} />
          <h2 className="text-4xl pt-2 pb-4 mb-3">Home</h2>
          <Spinner isBusy={this.state.isBusy} message={this.state.message} />
          <p className="text-xl">Contract</p>
          <hr className="mt-2 mb-4 border-gray-200 sm:mx-auto lg:my-8" />
          <div className="mb-6 ">
            <Label name="FlightSurety Data Contract" />
            <Toggle
              id="data-contract-toggle"
              change={this.onToggle}
              checked={this.state.isChecked}
            />
          </div>
          <div className="mb-6 flex flex-row items-center">
            <p className="mr-4">Authorize caller</p>
            <Button
              buttonName="Authorize"
              buttonClick={this.handleAuthorizeClick}
              value="authorize"
            ></Button>
          </div>
          <p className="text-xl">Airline</p>
          <hr className="mt-2 mb-4 border-gray-200 sm:mx-auto lg:my-8" />
          <div className="mb-6 flex flex-row items-center">
            <p className="mr-4">Register an Airline</p>
            <Button
              buttonName="Register"
              buttonClick={this.handleClick}
              value="/register-airline"
            ></Button>
          </div>
          <div className="mb-6 flex flex-row items-center">
            <p className="mr-4">Fund an Airline</p>
            <Button
              buttonName="Fund"
              buttonClick={this.handleClick}
              value="/fund-airline"
            />
          </div>
          <p className="text-xl">Flight</p>
          <hr className="mt-2 mb-4 border-gray-200 sm:mx-auto lg:my-8" />
          <div className="mb-6 flex flex-row items-center">
            <p className="mr-4">Register a Flight</p>
            <Button
              buttonName="Register"
              buttonClick={this.handleClick}
              value="/register-flight"
            />
          </div>
          <p className="text-xl">Passenger</p>
          <hr className="mt-2 mb-4 border-gray-200 sm:mx-auto lg:my-8" />
          <div className="mb-6 flex flex-row items-center">
            <p className="mr-4">Buy Insurance</p>
            <Button
              buttonName="Buy"
              buttonClick={this.handleClick}
              value="/buy-insurance"
            />
          </div>
          <div className="mb-6 flex flex-row items-center">
            <p className="mr-4">Submit a Flight</p>
            <Button
              buttonName="Submit"
              buttonClick={this.handleClick}
              value="/submit-flight"
            />
          </div>
          <div className="mb-6 flex flex-row items-center">
            <p className="mr-4">Claim insurance</p>
            <Button
              buttonName="Claim"
              buttonClick={this.handleClick}
              value="/claim-insurance"
            />
          </div>
        </form>
      </React.Fragment>
    );
  }

  async handleClick(e) {
    e.preventDefault();
    window.location.href = e.target.value;
  }

  async handleAuthorizeClick(e) {
    e.preventDefault();

    await this.setState(
      {
        isBusy: true,
        message: "Authorizing the caller...",
      },
      async () => {
        // Get the ethereum service
        const ethereumService = await ServiceFactory.get("ethereum-service");

        // Set the operational status
        const response = await ethereumService.authorizeCaller();

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

  async onToggle(e) {
    e.preventDefault();

    if (!this.state.isChecked) {
      await this.setState(
        {
          isBusy: true,
          message: "Authorizing the data contract, please wait",
        },
        async () => {
          // Get the ethereum service
          const ethereumService = await ServiceFactory.get("ethereum-service");

          // Set the operational status
          const response = await ethereumService.setOperatingStatus(true);

          this.setState({
            isBusy: false,
            message: "",
            isChecked: true,
            modalMessage: response.error,
          });

          if (response.error) {
            window.dialog.showModal();
          }
        }
      );
    }

    if (this.state.isChecked) {
      this.setState(
        {
          isBusy: true,
          message: "De-Authorizing the data contract, please wait",
        },
        async () => {
          // Get the ethereum service
          const ethereumService = await ServiceFactory.get("ethereum-service");

          // Set the operational status
          const response = await ethereumService.setOperatingStatus(false);

          this.setState({
            isBusy: false,
            message: "",
            isChecked: false,
            modalMessage: response.error,
          });

          if (response.error) {
            window.dialog.showModal();
          }
        }
      );
    }
  }
}
export default Home;
