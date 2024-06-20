// 1. Application State
class Transaction
{
	Name;
	Date;
	Art;
	Betrag;
	Kontostand;
	
	constructor(name, date, art, betrag, kontostand)
    {
        this.Name = name;
        this.Date = date;
        this.Art = art;
        this.Betrag = betrag;
        this.Kontostand = kontostand;
    }
}

var state = 
{
    rows: [ ]
};
    
//2. State Accessors
function addTransactionToState(name, date, art, betrag, kontostand)
{
    state.rows.push(new Transaction(name, date, art, betrag, kontostand));
}

function delTransactionFromState(row)
{
    //indexOf returniert erste Instanz, in welcher der übergebene Wert vorkommt
    let idx = state.rows.indexOf(row);
    if (idx !== -1)
        {
            state.rows.splice(idx, 1);
        }
}

//3. DOM Node References
const addRow = document.getElementById('addrow');
const clear = document.getElementById('clear');
const startwert = document.getElementById ('startfeld');
const listItem = document.getElementById('einträge');
const nameEintrag = document.getElementById('name');
const date = document.getElementById('date');
const art = document.getElementById('art');
const betrag = document.getElementById('betrag');
const kontostand = document.getElementById('kontostand');

//4. DOM Node Creation Functions

function createRowElement(transaction)
{   
    const rowItem = document.createElement('tr');
    rowItem.classList.add('tableBody');
    const rowName = document.createElement('td');
    const rowDate = document.createElement('td');
    const rowArt = document.createElement('td');
    const rowBetrag = document.createElement('td');
    const rowKontostand = document.createElement('td');

    rowName.textContent = transaction.Name;
    rowDate.textContent = transaction.Date;
    rowArt.textContent = transaction.Art;
    rowBetrag.textContent = transaction.Betrag;  
	rowKontostand.textContent = transaction.Kontostand;
    rowKontostand.classList.add(transaction.Kontostand > 0 ? 'betragfeldPositiv' : 'betragfeldNegativ');

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', (event) => onDelRowBtn(transaction)); //delRowFromState(transaction));

    rowItem.appendChild(rowName);
    rowItem.appendChild(rowDate);
    rowItem.appendChild(rowArt);
    rowItem.appendChild(rowBetrag);
    rowItem.appendChild(rowKontostand);

    rowItem.appendChild(delBtn);
    return rowItem;
}



//5. Render Function
function render()
{
	// berechnung durchführen bevor anzeige
	calculation();
	// speichern
    localStorage.setItem('budget', startwert.value);
    localStorage.setItem('state', JSON.stringify(state));
	// anzeige
    listItem.innerHTML = '';
    const rowlist = state.rows;
    rowlist.forEach(row => {
        listItem.appendChild(createRowElement(row));
    });
}

//6. Event Handlers
function addTransactionBtn()
{
    addTransactionToState(nameEintrag.value, date.value, art.value, betrag.value, kontostand.value);
    render();
}

function onDelRowBtn(row)
{
    delTransactionFromState(row);
    render();
}

function calculation()
{
	// budget holen
	var aktKontostand = startwert.value;
	// durch jede zeile durchgehen
	for (let i = 0; i < state.rows.length; i++)
	{
		// aktueller kontostand = kontostand - betrag dieses eintrags
		aktKontostand -= state.rows[i].Betrag * (-1);
		// kontostand dieses eintrags ist nach dieser transaktion
		state.rows[i].Kontostand = aktKontostand;
	}
}

function clearState()
{
	state.rows = [];
	render();
}

//7. Initial Bindings
addRow.addEventListener('click', addTransactionBtn);
clear.addEventListener('click', clearState);
let stateStr = localStorage.getItem('state');
let startStr = localStorage.getItem('budget');
//const states = (stateStr && stateStr != 'undefined') ? JSON.parse(stateStr) : stateTemplate;
if (stateStr && stateStr != 'undefined') state = JSON.parse(stateStr);
// startwert holen oder einen standardwert setzen
startwert.value = (startStr && startStr != 'undefined') ? startStr : 1000;

//8. Inital Render
render();