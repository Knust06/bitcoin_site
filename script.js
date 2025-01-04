const apiUrl = "https://bitcoinpreviewer.up.railway.app";

// Alternar tema claro/escuro
document.getElementById("themeToggle").addEventListener("click", () => {
    const body = document.body;

    // Alternar classes para modo claro/escuro
    if (body.classList.contains("dark-mode")) {
        body.classList.remove("dark-mode");
        body.classList.add("light-mode");
        // Atualizar o estilo do textarea para o modo claro
        textarea.style.backgroundColor = "#f9f9f9"; // Fundo claro
        textarea.style.color = "#333"; // Texto escuro
        textarea.style.border = "1px solid #ddd"; // Borda clara
    } else {
        body.classList.remove("light-mode");
        body.classList.add("dark-mode");
        
        // Atualizar o estilo do textarea para o modo escuro
        textarea.style.backgroundColor = "#1e1e1e"; // Fundo escuro
        textarea.style.color = "#fff"; // Texto branco
        textarea.style.border = "1px solid #444"; // Borda escura
    }

    // Atualizar o texto do botão
    const button = document.getElementById("themeToggle");
    button.textContent = body.classList.contains("dark-mode")
        ? "Modo Claro"
        : "Modo Escuro";
});

// Preços históricos
document.getElementById("historyForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const symbol = document.getElementById("symbol").value;
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    try {
        let url = `${apiUrl}/get-prices?symbol=${symbol}`;
        if (startDate) url += `&start_date=${startDate}`;
        if (endDate) url += `&end_date=${endDate}`;

        console.log("URL construída:", url);

        const response = await fetch(url);

        if (!response.ok) {
            console.error("Erro na API:", response.status, response.statusText);
            throw new Error("Erro ao buscar preços.");
        }

        const data = await response.json();
        console.log("Dados recebidos da API:", data);

        if (!data.prices || !Array.isArray(data.prices)) {
            throw new Error("A API não retornou preços válidos.");
        }

        // Atualizar o textarea com os preços em linha
        const pricesLine = data.prices.join(", ");
        document.getElementById("pricesLine").value = pricesLine;

        // Exibir a seção dos preços
        const pricesSection = document.getElementById("pricesSection");
        pricesSection.classList.remove("hidden");

    } catch (error) {
        console.error(error);
        alert("Erro ao buscar preços. Verifique os dados.");
    }
});

// Copiar preços
document.getElementById("copyPrices").addEventListener("click", () => {
    const textarea = document.getElementById("pricesLine");
    textarea.select();
    document.execCommand("copy");
    alert("Preços copiados para a área de transferência!");
});
// Previsão de preços
document.getElementById("predictForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const pricesInput = document.getElementById("prices").value;

    try {
        // Enviar o valor diretamente como um array
        const response = await fetch(`${apiUrl}/predict-bitcoin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prices: pricesInput.split(",").map(Number) }), // Caso esteja vindo como string, converte aqui.
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
