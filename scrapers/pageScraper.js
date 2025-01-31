require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const detailScraper = require('./detailScraper');

async function pageScraper(url) {
    try {
        console.log(`🔍 Iniciando scraping na página de resultados: ${url}`);

        // Constrói o URL para a ScraperAPI
        const scraperApiUrl = `https://api.scraperapi.com?api_key=${process.env.SCRAPER_API_KEY}&url=${encodeURIComponent(url)}`;

        // Faz a requisição via ScraperAPI
        const { data } = await axios.get(scraperApiUrl);
        const $ = cheerio.load(data);

        // Seleciona todos os containers de resultado
        const resultContainers = $('.row.results .col--one');

        const resultados = [];

        for (const container of resultContainers) {
            const relativeLink = $(container).find('a').attr('href');
            if (relativeLink) {
                const detailPageUrl = `https://www.racius.com${relativeLink}`;
                console.log(`🔗 Visitando página de detalhe: ${detailPageUrl}`);

                const resultData = await detailScraper(detailPageUrl);
                resultados.push(resultData);
            }
        }

        return resultados;

    } catch (error) {
        console.error("❌ Erro ao buscar links e processar resultados:", error);
        return [];
    }
}

module.exports = pageScraper;
