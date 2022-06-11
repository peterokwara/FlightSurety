import React, { Component } from "react";
import Input from "../../components/Forms/Input/Input";
import Button from "../../components/Common/Button/Button";
import Label from "../../components/Forms/Label/Label";
import Toggle from "../../components/Forms/Toggle/Toggle";

class Home extends Component {
  render() {
    return (
      <React.Fragment>
        <form className="overflow-auto px-8">
          <h2 className="text-4xl pt-2 pb-4 mb-3">Home</h2>
          <p className="text-xl">Contract</p>
          <hr class="mt-2 mb-4 border-gray-200 sm:mx-auto lg:my-8" />
          <div class="mb-6 ">
            <Label name="FlightSurety Data Contract" />
            <Toggle id="data-contract-toggle" />
          </div>
          <div class="mb-6 ">
            <Label name="FlightSurety App Contract" />
            <Toggle id="app-contract-toggle" />
          </div>
          <p className="text-xl">Airline</p>
          <hr class="mt-2 mb-4 border-gray-200 sm:mx-auto lg:my-8" />
          <div className="mb-6 flex flex-row items-center">
            <p className="mr-4">Register an Airline</p>
            <Button buttonName="Register" />
          </div>
          <p className="text-xl">Flight</p>
          <hr class="mt-2 mb-4 border-gray-200 sm:mx-auto lg:my-8" />
          <div className="mb-6 flex flex-row items-center">
            <p className="mr-4">Fund a flight</p>
            <Button buttonName="Fund" />
          </div>
          <div className="mb-6 flex flex-row items-center">
            <p className="mr-4">Register a Flight</p>
            <Button buttonName="Register" />
          </div>
          <p className="text-xl">Passenger</p>
          <hr class="mt-2 mb-4 border-gray-200 sm:mx-auto lg:my-8" />
          <div className="mb-6 flex flex-row items-center">
            <p className="mr-4">Buy Insurance</p>
            <Button buttonName="Buy" />
          </div>
          <div className="mb-6 flex flex-row items-center">
            <p className="mr-4">Submit a Flight</p>
            <Button buttonName="Submit" />
          </div>
          <div className="mb-6 flex flex-row items-center">
            <p className="mr-4">Claim insurance</p>
            <Button buttonName="Claim" />
          </div>
        </form>
      </React.Fragment>
    );
  }
}
export default Home;
