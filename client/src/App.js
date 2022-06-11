import Forms from "./components/Forms/Forms";
import Footer from "./components/Layout/Footer/Footer";
import Header from "./components/Layout/Header/Header"
import FundAirline from "./routes/Airline/FundAirline";
import RegisterAirline from "./routes/Airline/RegisterAirline";
import RegisterFlight from "./routes/Flight/RegisterFlight";
import SubmitFlight from "./routes/Flight/SubmitFlight";
import BuyInsurance from "./routes/Passenger/BuyInsurance";
import ClaimInsurance from "./routes/Passenger/ClaimInsurance";
import Home from "./routes/Home/Home"

function App() {
  return (
    <div className="App">
      <div className="App h-screen grid grid-rows-[100px,1fr,100px] lg:grid-rows-[110px,1fr,80px]">
        <Header />
        <Home />
        <Footer />
      </div>

    </div >
  );
}

export default App;
