const tabs = [];
const tabsContainer = document.querySelector(".tabs");
const tabNameInput = document.getElementById("tab-name");
const tabContentInput = document.getElementById("tab-content");

function handleSaveTabs() {
    if (tabs.length === 0) {
        alert("Немає вкладок для збереження!");
        return;
    }

    const formattedTabs = {
        entries: tabs.map(tab => ({
            heading: tab.name,
            details: tab.content
        }))
    };

    const jsonData = JSON.stringify(formattedTabs);

    console.log("Збережені дані:", jsonData);

    fetch("http://127.0.0.1:8000/api/tabs/save", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: jsonData
    })
        .then(response => {
            if (response.ok) {
                alert("Вкладки успішно збережено!");
            } else {
                throw new Error("Помилка під час збереження!");
            }
        })
        .catch(err => alert(err.message));
}

function handleAddTab() {
    const name = tabNameInput.value.trim();
    const content = tabContentInput.value.trim();

    if (!name || !content) {
        alert("Будь ласка, заповніть усі поля!");
        return;
    }

    if (tabs.some(tab => tab.name === name)) {
        alert("Вкладка з такою назвою вже існує!");
        return;
    }

    tabs.push({ name, content });
    renderTabs();

    tabNameInput.value = "";
    tabContentInput.value = "";
}

function renderTabs() {
    tabsContainer.innerHTML = "";

    tabs.forEach(tab => {
        const tabElement = document.createElement("div");
        tabElement.className = "tab";

        const tabTitle = document.createElement("strong");
        tabTitle.textContent = tab.name;

        const tabBody = document.createElement("span");
        tabBody.textContent = `: ${tab.content}`;

        tabElement.appendChild(tabTitle);
        tabElement.appendChild(tabBody);
        tabsContainer.appendChild(tabElement);
    });
}

function handleClearTabs() {
    if (confirm("Ви дійсно хочете очистити всі вкладки?")) {
        tabs.length = 0;
        renderTabs();
        alert("Всі вкладки очищено!");
    }
}

document.querySelector("#add-tab-btn").addEventListener("click", handleAddTab);
document.querySelector("#save-tab-btn").addEventListener("click", handleSaveTabs);
document.querySelector("#clear-tabs-btn").addEventListener("click", handleClearTabs);
