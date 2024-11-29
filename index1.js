
const buttonsContainer = document.querySelector(".tabs");
const contentArea = document.querySelector(".tab-content");

let previousTabs = null;
let currentTabs = [];

function fetchAndDisplayTabs() {
    fetch("http://127.0.0.1:8000/api/tabs/retrieve", {
        method: "GET",
    })
        .then(response => response.json())
        .then(data => {
            if (data.entries) {
                previousTabs = currentTabs;
                currentTabs = data.entries;

                if (tabsChanged()) {
                    renderTabButtons();
                }
            } else if (data.error) {
                console.error("Помилка при отриманні вкладок:", data.error);
            }
        })
        .catch(err => {
            console.error("Помилка при отриманні вкладок:", err);
        });
}

function tabsChanged() {
    if (!previousTabs || !currentTabs) {
        return true;
    }

    if (previousTabs.length !== currentTabs.length) {
        return true;
    }

    for (let i = 0; i < currentTabs.length; i++) {
        if (
            currentTabs[i].heading !== previousTabs[i].heading ||
            currentTabs[i].details !== previousTabs[i].details
        ) {
            return true;
        }
    }

    return false;
}

function renderTabButtons() {
    buttonsContainer.innerHTML = "";

    currentTabs.forEach(tab => {
        const button = document.createElement("button");
        button.className = "tab";
        button.textContent = tab.heading;

        button.addEventListener("click", () => {
            const allButtons = document.querySelectorAll(".tab");
            allButtons.forEach(btn => btn.classList.remove("active"));

            button.classList.add("active");

            contentArea.textContent = tab.details;
        });

        buttonsContainer.appendChild(button);
    });
}

function storeTabs(tabs) {
    fetch("http://127.0.0.1:8000/api/tabs/save", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ entries: tabs }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                console.log("Дані успішно збережено:", data.message);
                fetchAndDisplayTabs(); // Оновлюємо вкладки після збереження
            } else if (data.error) {
                console.error("Помилка при збереженні вкладок:", data.error);
            }
        })
        .catch(err => {
            console.error("Помилка при збереженні вкладок:", err);
        });
}

fetchAndDisplayTabs();
setInterval(fetchAndDisplayTabs, 2000);
