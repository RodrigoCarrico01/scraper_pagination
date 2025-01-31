const axios = require('axios');
const cheerio = require('cheerio');

// Lista de tópicos que queremos capturar
const keysToExtract = ['Morada', 'Forma Jurídica', 'Capital Social', 'Atividade','Acerca da Empresa','CAE'];

async function detailScraper(url) {
    try {
        // Faz a requisição à página
        const { data } = await axios.get(url);

        // Carrega o conteúdo HTML na biblioteca Cheerio
        const $ = cheerio.load(data);

        // Cria um objeto para armazenar os resultados
        const extractedData = {};

          // Função para processar divs de acordo com a estrutura especificada
          const processDivs = (container) => {
            container.each((_, element) => {
                const key = $(element).find('.detail__key-info').text().trim();
                const value = $(element).find('.t--d-blue').text().trim();

                // Se a key estiver na nossa lista de interesse, guardamos o valor
                if (keysToExtract.includes(key)) {
                    extractedData[key] = value;
                }
            });
        };

        // Procura nas divs com ambas as estruturas
        const container1 = $('.px-md--2.detail__line.f--grow');
        const container2 = $('.t-md--right.detail__line');

        // Processa as divs e extrai os dados
        processDivs(container1);
        processDivs(container2);

        console.log('Dados extraídos:', extractedData);
        return { url, ...extractedData };
    } catch (error) {
        console.error('Erro ao fazer scraping:', error);
    }
}

module.exports = detailScraper;
