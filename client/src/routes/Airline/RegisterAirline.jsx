import React, { Component } from "react";
import Input from "../../components/Forms/Input/Input";
import Button from "../../components/Common/Button/Button";
import Label from "../../components/Forms/Label/Label";
import ServiceFactory from "../../factories/serviceFactory";
import Spinner from "../../components/Common/Spinner/Spinner";
import Dialog from "../../components/Common/Dialog/Dialog";

class RegisterAirline extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isBusy: false,
      message: "Loading page, please wait",
      airlineName: "",
      airlineAddress: "",
      modalMessage: "",
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
          <h2 className="text-2xl py-4">Register Airline</h2>
          <Spinner isBusy={this.state.isBusy} message={this.state.message} />
          <div class="mb-6 ">
            <Label name="Airline Name" />
            <Input inputName="airlineName" inputChange={this.handleChange} />
          </div>
          <div class="mb-6 ">
            <Label name="Airline Address" />
            <Input inputName="airlineAddress" inputChange={this.handleChange} />
          </div>
          <Button buttonName="Register" buttonClick={this.handleClick} />
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
        if (!this.state.airlineName || !this.state.airlineAddress) {
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
        const response = await ethereumService.registerAirline(
          this.state.airlineName,
          this.state.airlineAddress
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
export default RegisterAirline;
