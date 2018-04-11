# Foosball Chain UI

Simeple DApp for free betting on foosball matches results. Implemented as a simple static webpage serving the purpose of UI for the Foosball Chain game with the backend ran as Ethereum smart contracts.

Uses [web3.js](https://github.com/ethereum/web3.js/) for blockchain integration and [Bootstrap](https://getbootstrap.com/) for (crude) styling.

## Requirements

1. `npm`
1. [MetaMask](http://metamask.io/) browser extension for injecting a `web3` object with already authenticated Ethereum accounts.

## Project structure
1. `web/index.html` - the entry point
1. `web/main.js` - the UI logic behind the game, requires methods from `integration.js`
1. `web/integration.js` - the code responsible for integration with the smart contracts
1. `web/abis.js` - ABIs for the smart contracts (extracted to a separate file for readability)

## Running the project

1. `npm install` - install dependencies.
1. Because MetaMask does not inject `web3` into content accessed by `file:///` the DApp should be ran using `npm run serve` and accessed from [http://localhost:8000/web/].
1. Point MetaMask to `localhost:8545` node and import seed words according to instructions from the smart contracts README.
1. Deploy and run the smart contracts according to the instruction from their repository.

## How to play

1. Your balance at the beginning should show 0 FOO.
1. Click "Register" button and confirm the transaction in MetaMask.
1. Click "Refresh" button - your balance at the beginning should now show 1000 FOO.
1. Add a match using the form and confirm the transaction in MetaMask.
1. Click "Refresh" button - the new match should show on the list.
1. Add a few bets for the match - use a separate MetaMask account for each bet to observe the results best. Remember to confirm two transactions in MetaMask for each bet: one for token allowance and the second for actually adding the bet.
1. Set the result of the match and confirm the transaction in MetaMask.
1. Switch between accounts and click "Refresh" button to observe changes in the token balance.