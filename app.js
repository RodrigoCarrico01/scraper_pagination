const pageScraper = require('./scrapers/pageScraper');
const fs = require('fs');

(async function main() {
    try {
        const urlInicial = 'https://www.racius.com/actividades-dos-organismos-internacionais-e-outras-instituicoes-extraterritoriais/';

        console.log("🔍 Iniciando scraping no site Racius...");

        // Chama o scraper da página de resultados
        const resultados = await pageScraper(urlInicial);

        // Armazena os dados no ficheiro JSON
        fs.writeFileSync('resultados.json', JSON.stringify(resultados, null, 2));

        console.log("✅ Scraping concluído. Resultados armazenados em 'resultados.json'.");

    } catch (error) {
        console.error("❌ Erro durante o scraping geral:", error);
    }
})();
