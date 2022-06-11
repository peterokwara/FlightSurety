import Forms from "./components/Forms/Forms";
import Footer from "./components/Layout/Footer/Footer";
import Header from "./components/Layout/Header/Header"
import FundAirline from "./routes/airline/FundAirline";
import RegisterAirline from "./routes/airline/RegisterAirline";
import RegisterFlight from "./routes/flight/RegisterFlight";
import BuyInsurance from "./routes/passenger/BuyInsurance";
import ClaimInsurance from "./routes/passenger/ClaimInsurance";

function App() {
  return (
    <div className="App">
      <Header />
      <RegisterAirline />
      <Footer />
    </div>
  );
}

export default App;
