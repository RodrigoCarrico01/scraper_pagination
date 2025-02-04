require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');

// Lista de tópicos que queremos capturar
const keysToExtract = ['Morada', 'Forma Jurídica', 'Capital Social', 'Atividade', 'Acerca da Empresa', 'CAE'];

async function detailScraper(url) {
    try {
        // Constrói o URL para a ScraperAPI
        const scraperApiUrl = `https://api.scraperapi.com?api_key=${process.env.SCRAPER_API_KEY}&url=${encodeURIComponent(url)}`;

        // Faz a requisição via ScraperAPI
        const { data } = await axios.get(scraperApiUrl);
        const $ = cheerio.load(data);

        const extractedData = {};

        // Busca o título da empresa
        const companyTitle = $('h1.company__name').text().trim();
        extractedData['Empresa'] = companyTitle;

        const processDivs = (container) => {
            container.each((_, element) => {
                const key = $(element).find('.detail__key-info').text().trim();
                const value = $(element).find('.t--d-blue').text().trim();
                if (keysToExtract.includes(key)) {
                    extractedData[key] = value;
                }
            });
        };

        processDivs($('.px-md--2.detail__line.f--grow'));
        processDivs($('.t-md--right.detail__line'));

        console.log('Dados extraídos:', extractedData);
        return { url, ...extractedData };
    } catch (error) {
        console.error('❌ Erro ao fazer scraping:', error);
    }
}

module.exports = detailScraper;
