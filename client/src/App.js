import { Component } from "react";
import ServiceFactory from "./factories/serviceFactory";
import EthereumService from "./services/ethereumService";
import Forms from "./components/Forms/Forms";
import Footer from "./components/Layout/Footer/Footer";
import Header from "./components/Layout/Header/Header"
import FundAirline from "./routes/Airline/FundAirline";
import RegisterAirline from "./routes/Airline/RegisterAirline";
import RegisterFlight from "./routes/Flight/RegisterFlight";
import SubmitFlight from "./routes/Flight/SubmitFlight";
import BuyInsurance from "./routes/Passenger/BuyInsurance";
import ClaimInsurance from "./routes/Passenger/ClaimInsurance";
import Spinner from "./components/Common/Spinner/Spinner";
import Home from "./routes/Home/Home"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {}

    this.setState = this.setState.bind(this);
  }

  /**
   * When the component mounts
   */
  async componentDidMount() {

    // Register the ethereum service
    await ServiceFactory.register("ethereum-service", () => new EthereumService());

  }

  render() {
    return (
      <div className="App" >
        <div className="App h-screen grid grid-rows-[100px,1fr,100px] lg:grid-rows-[110px,1fr,80px]">
          <Header />
          <Home />
          <Footer />
        </div>
      </div >
    );
  }
}

export default App;
