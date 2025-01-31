require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const pageScraper = require('./pageScraper');

async function paginationScraper(baseUrl) {
    try {
        console.log(`🔍 Verificando o número total de páginas a partir de: ${baseUrl}`);

        // Constrói o URL para a ScraperAPI e faz a requisição inicial
        const scraperApiUrl = `https://api.scraperapi.com?api_key=${process.env.SCRAPER_API_KEY}&url=${encodeURIComponent(baseUrl)}`;
        const { data } = await axios.get(scraperApiUrl);
        const $ = cheerio.load(data);

        // Encontra o 3º elemento com a classe "paginator__number"
        const totalPages = parseInt($('.paginator.t--center a.paginator__number').eq(2).text().trim());
        console.log(`📄 Número total de páginas encontrado: ${totalPages}`);

        const resultados = [];

        // Faz o scraping em cada página, começando da 1 até o total encontrado
        for (let page = 1; page <= totalPages; page++) {
            const pageUrl = page === 1 ? baseUrl : `${baseUrl}${page}/`;
            console.log(`🔗 Fazendo scraping na página: ${pageUrl}`);

            const pageResultados = await pageScraper(pageUrl);
            resultados.push(...pageResultados);
        }

        return resultados;

    } catch (error) {
        console.error("❌ Erro ao lidar com a paginação:", error);
        return [];
    }
}

module.exports = paginationScraper;
