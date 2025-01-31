const axios = require('axios');
const cheerio = require('cheerio');
const detailScraper = require('./detailScraper');

async function pageScraper(url) {
    try {
        console.log(`🔍 Iniciando scraping na página de resultados: ${url}`);

        // Faz a requisição à página de resultados
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        // Seleciona todos os containers de resultado (div.col--one dentro de div.row.results)
        const resultContainers = $('.row.results .col--one');

        const resultados = [];

        // Itera sobre cada container e extrai o link de detalhes
        for (const container of resultContainers) {
            const relativeLink = $(container).find('a').attr('href');

            if (relativeLink) {
                const detailPageUrl = `https://www.racius.com${relativeLink}`;
                console.log(`🔗 Visitando página de detalhe: ${detailPageUrl}`);

                // Chama o scraper de detalhes
                const resultData = await detailScraper(detailPageUrl);
                resultados.push(resultData);

                console.log(`✅ Dados extraídos de: ${detailPageUrl}`);
            }
        }

        return resultados;

    } catch (error) {
        console.error("❌ Erro ao buscar links e processar resultados:", error);
        return [];
    }
}

module.exports = pageScraper;
