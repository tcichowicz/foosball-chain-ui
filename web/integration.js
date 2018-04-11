const promisify = async (func) => new Promise((resolve, reject) => {
    func((error, result) => {
        if (error) {
            reject(error);
        } else {
            resolve(result);
        }
    });
});

const gameAddress = '0x4dffc407e3d65e8cccfeb73661fc62e559cccde5';

const game = web3.eth.contract(gameAbi).at(gameAddress);

let token;
let factory;

const init = async () => {
    token = web3.eth.contract(tokenAbi).at(await promisify(game.token));
    factory = web3.eth.contract(factoryAbi).at(await promisify(game.factory));
};

const matches = [];

const rand = () => (Math.floor(Math.random() * 1000) + 1);

const getMatches = async () => {
    const matches = [];
    const count = await promisify(factory.getMatchesCount);
    for (let i = 0; i < count; i++) {
        const address = await promisify(cb => factory.matches(i, cb));
        const match = web3.eth.contract(matchAbi).at(address);
        const teamA = await promisify(match.teamA);
        const teamB = await promisify(match.teamB);
        const score = await promisify(match.score);
        const bets = [];
        const betsCount = await promisify(match.getBetsCount);
        for (let j = 0; j < betsCount; j++) {
            const [address, stake, result] = await promisify(cb => match.bets(j, cb));
            bets.push({ address, stake, result });
        }
        matches.push({ address, teamA, teamB, score, bets });
    }
    return matches;
};

const addMatch = async ({
    teamA,
    teamB,
}) => {
    await promisify(cb => factory.addMatch(teamA, teamB, cb));
};

const getBalance = async () => promisify(cb => token.balanceOf(web3.eth.accounts[0], cb));

const register = async () => promisify(game.register);

const addBet = address => async ({ stake, result }) => {
    await promisify(cb => token.approve(address, stake, cb));
    const match = web3.eth.contract(matchAbi).at(address);
    await promisify(cb => match.addBet(stake, result, cb));
};

const setResult = address => async ({ score, result }) => {
    const match = web3.eth.contract(matchAbi).at(address);
    await promisify(cb => match.setScore(score, result, cb));
};
