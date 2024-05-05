const ServerUrl = 'https://resolved-kiwi-certainly.ngrok-free.app';
const teams = ['team 1', 'team 2', 'team 3', 'team 4', 'team 5'];
var playerDataResponse = "";

makePlayerElement = (playerData) => {
    const playerElement = document.createElement('div');
    playerElement.onclick = () => startModal(playerData, playerElement);
    playerElement.setAttribute('type', 'button');
    playerElement.setAttribute('data-bs-toggle', 'modal');
    playerElement.setAttribute('data-bs-target', '#staticBackdrop');
    let capabilitiesDOM = '';
    if (playerData['Capabilities'].includes('Batsman')) {
        capabilitiesDOM += '<img src="assets/batsman.svg" class="col-2" alt="...">';
    }
    if (playerData['Capabilities'].includes('Fast Bowler')) {
        capabilitiesDOM += '<img src="assets/fast-bowler.svg" class="col-2" alt="...">';
    }
    if (playerData['Capabilities'].includes('Wicket Keeper')) {
        capabilitiesDOM += '<img src="assets/keeper.svg" class="col-2" alt="...">';
    }
    if (playerData['Capabilities'].includes('Spin Bowler')) {
        capabilitiesDOM += '<img src="assets/spin-bowler.svg" class="col-2" alt="...">';
    }
    playerElement.innerHTML = `
        <div class="card category-${playerData['Category']} rounded-5 shadow-lg mb-3">
        <div class="row g-0">
            <div class="col-md-4">
                <img alt="..." class="person-pic img-fluid rounded-start" src="${ServerUrl}/${playerData['Photo']}"/>
            </div>
            <div class="col-md-8">
                <div class="card-body">
                    ${capabilitiesDOM}
                    <h4 class="card-title title-text">${playerData['Name']}</h4>
                    <h5 class="card-text batch-text">Batch: ${playerData['Batch']}</h5>
                    <h5 class="card-text batch-text">Price: ${playerData['Price']}</h5>
                </div>
            </div>
        </div>
    `;
    return playerElement;
}

startModal = (playerData, playerElement) => {
    const modal = document.getElementById('staticBackdrop');
    const playerColorClass = playerData['Category'] === '1' ? 'bg-danger' : playerData['Category'] === '2' ? 'bg-warning' : 'bg-info';
    modal.querySelector("#modal-card").classList.remove('bg-danger', 'bg-warning', 'bg-info');
    modal.querySelector("#modal-card").classList.add(playerColorClass);
    modal.querySelector('#player-photo').src = `${ServerUrl}/${playerData['Photo']}`;
    modal.querySelector('#player-name').innerText = playerData['Name'];
    modal.querySelector('#player-capabilities').innerText = playerData['Capabilities'];
    modal.querySelector('#player-batch').innerText = 'Batch: ' + playerData['Batch'];
    modal.querySelector('#player-price').innerText = 'Price: ' + playerData['Price'];
}

fetchData = async () => {
    const response = await fetch(`${ServerUrl}/players/`);
    return await response.json();
}

createTeamNames = () => {
    teams.forEach(team => {
        const teamElement = document.createElement('div');
        const hr = document.createElement('hr');
        teamElement.appendChild(hr);
        const hr2 = document.createElement('hr');
        teamElement.appendChild(hr2);
        const br = document.createElement('br');
        teamElement.appendChild(br);
        const br2 = document.createElement('br');
        teamElement.appendChild(br2);
        const teamText = document.createElement('h2');
        teamText.classList.add('text-center', 'title-text');
        teamText.innerText = team;
        teamElement.appendChild(teamText);
        document.querySelector('#players-with-team').appendChild(teamElement);
    })
}

insertPlayerElements = () => {
    fetchData().then(data => {
        playerDataResponse = data
        data.forEach(player => {
            if (player['TeamName'] !== '') {
                document.querySelector('#players-with-team').children[teams.indexOf(player['TeamName'])].appendChild(makePlayerElement(player));
                return;
            }
            const playerElement = makePlayerElement(player);
            document.getElementById(`category-${player['Category']}`).appendChild(playerElement);
        })
    });
}
createTeamNames();
insertPlayerElements();

clearAllPlayerData = () => {
    document.querySelector('#players-with-team').innerHTML = '';
    document.querySelector('#category-1').innerHTML = '';
    document.querySelector('#category-2').innerHTML = '';
    document.querySelector('#category-3').innerHTML = '';
}

setInterval(async () => {
    const playerData = await fetchData();
    if (_.isEqual(playerData, playerDataResponse)) {
        return;
    }
    clearAllPlayerData();
    createTeamNames();
    insertPlayerElements();
}, 2000);
