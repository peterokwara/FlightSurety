<p align="center">
  <h3 align="center">FlightSurety</h3>

  <p align="center">
Ethereum Dapp that allows users to register for Flight Insurance in case something happens to a flight.
    <br>
    </p>
</p>

<br>

## Table of contents

- [About the Website](#about-the-website)
- [Technical](#technical)
- [Design](#design)
- [Testing](#testing)
- [Licence](#license)
- [Versions](#versions)
- [Contact Information](#contact-information)

### About the website

Ethereum Dapp that allows users to register for Flight Insurance in case something happens to a flight. Part of the Udacity Blockchain Nanodegree.

<p align="center">
  <img src="./assets/czD19w0Pzf.gif"/>
</p>

### Technical

#### Technology Used

This project uses: - ReactJS - Tailwind CSS - CSS - JS - NodeJS - EthersJS - Truffle - Ganache

**React-JS** - Easy to set up single page application with multiple pages.

**Tailwind CSS** - Easier to style components as compared to SCSS and CSS. Also more predictable and makes a site more responsive.

**Ethersjs** - Had lots of trouble using web3js and @truffle/contracts as I was getting lots of errors when using create-react-app. Resorted to using Ethers-js.

**Ganache** - A tool for creating a local blockchain for fast Ethereum development.

- Truffle version `v5.5.16`
- Solidity version `0.8.14`
- Node `v18`
- Ganache `v7.2.0`

#### Running the project

The whole project runs on the latest nodejs version. Anything above `v16` should work. To do this, ensure you have [node version manager](https://github.com/nvm-sh/nvm) installed. Once installed you can then run.

```console
nvm install node
nvm use node
```

#### Contracts

To compile the smart contract, within the truffle development environment, run:

```console
truffle compile
```

To run a local ethereum node, where you will deploy your contracts to, run ganache as shown below. This will **create 50 accounts**, some which will be used for the **airline account**, **passenger account**, **owner account** and **oracles**.

**Warning** Do not use the seed below in a **public network**.

```console
ganache -a 50 -m "friend collect coconut snow pretty car anchor cross purchase exact biology about"
```

To migrate the contract to the ethereum chain, running on the node, run:

```console
truffle migrate --reset
```

To run the test cases within the truffle development environment, run:

```console
truffle test
```

##### Frontend

The npm packages need to be installed in the **client** directory by running

```console
cd client
```

and then

```console
npm install
```

The client depend on a couple of files to work properly. One of them is the contract abi that should be located in the `client/src/build` directory. To generate the contract abi in the correct location, run:

```console
truffle compile --contracts_build_directory=./client/src/build
```

The second file is the **configuration** file that contains the **node url**, the url ganache runs in, the address of the **data contract** and the address of the **app contract**. This file is located in the `client/src/data/config.local.json` and is generated by running:

```console
truffle migrate --reset
```

**Ganache** needs to be running. Once this has been done, to run the backend of the project, you can run.

Once the installation process has been done, to run the frontend of the project, you can run.

```console
npm start
```

##### Backend

The npm packages need to be installed in the **api** directory by running

```console
cd client
```

and then

```console
npm install
```

The backend api depend on a couple of files to work properly. One of them is the contract abi that should be located in the `api/src/build` directory. To generate the contract abi in the correct location, run:

```console
truffle compile --contracts_build_directory=./api/src/build
```

The second file is the **configuration** file that contains the **node url**, the url ganache runs in, the address of the **data contract** and the address of the **app contract**. This file is located in the `api/src/data/config.local.json` and is generated by running:

```console
truffle migrate --reset
```

**Ganache** needs to be running. Once this has been done, to run the backend of the project, you can run.

```console
npm run start
```

To start the nodejs server in developer mode, you can run

```console
npm run start-dev
```

### Testing

To test the full application (Local Node and UI):

- Run the Frontend and Backend as specified in the technology section.
- Ensure the smart contract is deployed to your local test node. In my case, I used Ganache which runs on port **7545**
- Import your account to Metamask. To do this, ensure you have metamask installed. Import the seed phrase that is provided by the local node into Metamask and ensure the accounts show up in the wallet ui.
- Use the first account (normally marked as **Account 1**) to connect to the website. For some reason, it doesn't work with any other account, only the first account.
- Ensure your wallet is connected by clicking **connect wallet** to **Account 1**.
- Try going through the whole coffee export process by clicking the buttons (harvest, process, pack, sell) from the Farm Details page.
- Move to the next page and do the same (buy, ship, receive, purchase) from the Product Details page.
- Try to fetch items from the buffer from the Product Overview page.
- Try to fetch the transaction events from the Transactions History page.

Troubleshooting

Common issues:

**Error** when running test

```
 1) Contract: FlightSurety App
       For the (oracles)
         should be able to  register oracles:
     Transaction: 0xaeb154bf26bfcee5f94d145ef87e41bb83e065cd3c46ecba5687973f2539139a exited with an error (status 0). Reason given: Panic: Arithmetic overflow.
     Please check that the transaction:
     - satisfies all conditions set by Solidity `require` statements.
     - does not trigger a Solidity `revert` statement.

  StatusError: Transaction: 0xaeb154bf26bfcee5f94d145ef87e41bb83e065cd3c46ecba5687973f2539139a exited with an error (status 0). Reason given: Panic: Arithmetic overflow.
      at Context.<anonymous> (test/flight_surety_app.js:331:38)
      at processTicksAndRejections (node:internal/process/task_queues:95:5)

  2) Contract: FlightSurety App
       For the (oracles)
         should be able to request flight status:
     Error: Returned error: VM Exception while processing transaction: revert Not registered as an oracle
      at Context.<anonymous> (test/flight_surety_app.js:357:12)
      at processTicksAndRejections (node:internal/process/task_queues:95:5)
```

**Solution:** Try running the test a couple of times. Sometimes this happens because the response has less than 3 indexes. If you try and run a couple of times, it should work.

### CONTRIBUTING

I would/ We'd love to have your help in making **FlightSurety** better. The project is still very incomplete, but if there's an issue you'd like to see addressed sooner rather than later, let me(/us) know.

Before you contribute though read the contributing guide here: [Contributing.md](https://github.com/peterokwara/FlightSurety/blob/master/CONTRIBUTING.md)

For any concerns, please open an [issue](https://github.com/peterokwara/FlightSurety/issues), or just, [fork the project and send a pull request](https://github.com/peterokwara/FlightSurety/pulls).

<hr>

### License

- see [LICENSE](https://github.com/peterokwara/FlightSurety/blob/master/LICENSE) file

### Versions

- Version 1.0 DATE 15/06/2022

### Contact Information

If you have found any bugs, or have any feedback or questions and or want to post a feature request please use the [Issuetracker](https://github.com/peterokwara/FlightSurety/issues) to report them.

<hr>

[![Open Source Love](https://badges.frapsoft.com/os/v2/open-source-200x33.png?v=103)](#)

<br>

[![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=for-the-badge)](https://github.com/peterokwara/FlightSurety/blob/master/LICENSE)
