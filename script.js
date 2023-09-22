let antimatter = 0;
let pps = 0;
let clickValue = 1;
let generator1Owned = 0;
let generator1Cost = 10;
let generator1Production = 1;

const antimatterDisplay = document.getElementById("antimatter");
const ppsDisplay = document.getElementById("pps");
const clickButton = document.getElementById("clickButton");
const generator1ProductionDisplay = document.getElementById("generator1-production");
const generator1OwnedDisplay = document.getElementById("generator1-owned");
const generator1CostDisplay = document.getElementById("generator1-cost");

const dbName = "antimatterGameDB";
const dbVersion = 1;
let db;

const request = indexedDB.open(dbName, dbVersion);

request.onupgradeneeded = (event) => {
    db = event.target.result;
    const store = db.createObjectStore("gameData", { keyPath: "id" });
    store.add({ id: "antimatter", value: antimatter });
    store.add({ id: "pps", value: pps });
};

request.onsuccess = (event) => {
    db = event.target.result;
    loadGameData();
    updateDisplay();
};

request.onerror = (event) => {
    console.error("IndexedDB error:", event.target.error);
};

clickButton.addEventListener("click", () => {
    antimatter += clickValue;
    updateDisplay();
    saveGameData();
});

function buyGenerator(generatorNumber) {
    const cost = eval(`generator${generatorNumber}Cost`);
    if (antimatter >= cost) {
        eval(`generator${generatorNumber}Owned += 1`);
        antimatter -= cost;
        eval(`generator${generatorNumber}Cost *= 2`);
        pps += eval(`generator${generatorNumber}Production`);
        updateDisplay();
        saveGameData();
    }
}

function updateDisplay() {
    antimatterDisplay.textContent = antimatter;
    ppsDisplay.textContent = pps;
    generator1OwnedDisplay.textContent = generator1Owned;
    generator1CostDisplay.textContent = generator1Cost;
}

function loadGameData() {
    const transaction = db.transaction("gameData", "readonly");
    const store = transaction.objectStore("gameData");

    const antimatterRequest = store.get("antimatter");
    const ppsRequest = store.get("pps");

    antimatterRequest.onsuccess = () => {
        if (antimatterRequest.result) {
            antimatter = antimatterRequest.result.value;
        }
    };

    ppsRequest.onsuccess = () => {
        if (ppsRequest.result) {
            pps = ppsRequest.result.value;
        }
    };
}

function saveGameData() {
    const transaction = db.transaction("gameData", "readwrite");
    const store = transaction.objectStore("gameData");

    store.put({ id: "antimatter", value: antimatter });
    store.put({ id: "pps", value: pps });
}

setInterval(() => {
    antimatter += pps;
    updateDisplay();
    saveGameData();
}, 1000);
