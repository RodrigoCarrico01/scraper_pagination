const paginationScraper = require('./scrapers/paginationScraper');
const fs = require('fs');

(async function main() {
    try {
        const urlInicial = 'https://www.racius.com/transportes-maritimos-nao-costeiros-de-passageiros/';

        console.log("🔍 Iniciando scraping no site Racius com paginação...");

        // Chama o scraper de paginação
        const resultados = await paginationScraper(urlInicial);

        // Armazena os dados no ficheiro JSON
        fs.writeFileSync('resultados.json', JSON.stringify(resultados, null, 2));

        console.log("✅ Scraping concluído. Resultados armazenados em 'resultados.json'.");

    } catch (error) {
        console.error("❌ Erro durante o scraping geral:", error);
    }
})();
