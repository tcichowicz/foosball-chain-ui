const refresh = async () => {
    await renderMatches('matchList', getMatches);
    await renderBalance('balance', getBalance);
};

const addMatchSubmit = () => {
    const teamA = document.forms.addMatchForm.teamA.value;
    const teamB = document.forms.addMatchForm.teamB.value;

    addMatch({
        teamA,
        teamB,
    }).then(refresh);

    document.forms.addMatchForm.reset();
};

const handleFormSubmit = (formId, handler) => {
    const form = document.getElementById(formId);
    form.addEventListener('submit', e => {
        e.preventDefault();

        const data = {};

        for (let element of form.elements) {
            if (element.name) {
                data[element.name] = element.value;
            }
        }

        handler(data).then(refresh);;
        form.reset();
    }, false);
};

const renderMatches = async (matchListId, getMatches) => {
    const matchList = document.getElementById(matchListId);
    while (matchList.firstChild) {
        matchList.removeChild(matchList.firstChild);
    }
    (await getMatches()).map(match => {
        const matchDiv = document.createElement('div');
        matchDiv.innerHTML = matchHtml(match);
        matchList.appendChild(matchDiv);
        const {
            address
        } = match;
        handleFormSubmit(`addBetForm-${address}`, addBet(address));
        handleFormSubmit(`setResultForm-${address}`, setResult(address));
    });
};

const renderBalance = async (balanceId, getBalance) => {
    const balanceElement = document.getElementById(balanceId);
    balanceElement.textContent = await getBalance();
};

const matchHtml = ({
    address,
    teamA,
    teamB,
    score,
    bets,
}) => `<div class="row mb-3">
    <div class="col-6">
        <h3>${teamA} <small class="text-muted">vs</small> ${teamB}</h3>
    </div>
    <div class="col-3 text-center">
        <h3>${score ? score : ''}</h3>
    </div>
    <div class="col-3 text-right">
        <div class="btn-group" role="group" aria-label="Match controls">
            <button type="button" class="btn btn-warning" data-toggle="collapse" data-target="#bet-${address}" aria-expanded="false"
                aria-controls="bet-${address}">Add bet ▼</button>
            <button type="button" class="btn btn-danger" data-toggle="collapse" data-target="#setResult-${address}" aria-expanded="false"
                aria-controls="setResult-${address}">Set result ▼</button>
        </div>
    </div>
    <div id="bet-${address}" class="collapse col-12 mb-1">
        <div class="card card-body">
            <form id="addBetForm-${address}">
                <div class="row">
                    <div class="col">
                        <input type="number" class="form-control" name="stake" placeholder="Stake" required>
                    </div>
                    <div class="col">
                        <select class="form-control" name="result" required>
                            <option value="" selected>Choose...</option>
                            <option value="-1">${teamA} wins</option>
                            <option value="0">Draw</option>
                            <option value="1">${teamB} wins</option>
                        </select>
                    </div>
                    <div class="col">
                        <button type="submit" class="btn btn-warning">Add bet</button>
                        <button type="button" class="close float-right" data-toggle="collapse" data-target="#bet-${address}" aria-expanded="false" aria-controls="bet-${address}">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <div id="setResult-${address}" class="collapse col-12 mb-1">
        <div class="card card-body">
            <form id="setResultForm-${address}">
                <div class="row">
                    <div class="col">
                        <input type="text" class="form-control" name="score" placeholder="Score" required>
                    </div>
                    <div class="col">
                        <select class="form-control" name="result" required>
                            <option value="" selected>Choose...</option>
                            <option value="-1">${teamA} won</option>
                            <option value="0">Draw</option>
                            <option value="1">${teamB} won</option>
                        </select>
                    </div>
                    <div class="col">
                        <button type="submit" class="btn btn-danger">Set result</button>
                        <button type="button" class="close float-right" data-toggle="collapse" data-target="#setResult-${address}" aria-expanded="false" aria-controls="setResult-${address}">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <table class="table table-hover">
        <thead>
            <tr>
                <th scope="col" style="width: 5%">#</th>
                <th scope="col" style="width: 50%">Address</th>
                <th scope="col" style="width: 20%">Stake</th>
                <th scope="col" style="width: 25%">Bet</th>
            </tr>
        </thead>
        <tbody>
            ${bets.map((bet, i) => betHtml({ teamA, teamB, ...bet, i: i + 1 })).join('')}
        </tbody>
    </table>
</div>`;

const betHtml = ({
    teamA,
    teamB,
    address,
    stake,
    result,
    i,
}) => `<tr>
    <th scope="row">${i}</th>
    <td>${address}</td>
    <td>${stake} FOO</td>
    <td>${result == 0 ? 'Draw' : (result < 0 ? teamA : teamB) }</td>
</tr>`;