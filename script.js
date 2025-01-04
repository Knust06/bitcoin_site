const apiUrl = "https://bitcoinpreviewer.up.railway.app";

// Previsão de Preços
document.getElementById("predictForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const prices = document.getElementById("prices").value.split(",").map(Number);

    try {
        const response = await fetch(`${apiUrl}/predict-bitcoin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prices }),
        });

        if (!response.ok) {
            throw new Error(`Erro: ${response.statusText}`);
        }

        const data = await response.json();
        document.getElementById("predictionResult").textContent = `Preço Previsto: ${data.prediction}`;
    } catch (error) {
        document.getElementById("predictionResult").textContent = error.message;
    }
});

// Preços Históricos
document.getElementById("historyForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const symbol = document.getElementById("symbol").value;
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    try {
        const response = await fetch(`${apiUrl}/get-prices?symbol=${symbol}&start_date=${startDate}&end_date=${endDate}`);
        if (!response.ok) {
            throw new Error(`Erro: ${response.statusText}`);
        }

        const data = await response.json();
        const tableBody = document.querySelector("#pricesTable tbody");
        tableBody.innerHTML = "";

        data.prices.forEach((price, index) => {
            const row = document.createElement("tr");
            const dateCell = document.createElement("td");
            const priceCell = document.createElement("td");

            dateCell.textContent = `${startDate} +${index} dias`;
            priceCell.textContent = price.toFixed(2);

            row.appendChild(dateCell);
            row.appendChild(priceCell);
            tableBody.appendChild(row);
        });
    } catch (error) {
        alert(error.message);
    }
});
