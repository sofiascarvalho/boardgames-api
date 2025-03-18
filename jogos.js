
    'use strict';

    // Função para obter parâmetros da URL
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Função para carregar os detalhes do jogo na página
    async function carregarDetalhesJogo() {
        const idJogo = getQueryParam("id");

        if (!idJogo) {
            document.getElementById("tituloJogo").textContent = "Jogo não encontrado!";
            return;
        }

        const url = `https://api.allorigins.win/get?url=${encodeURIComponent('https://boardgamegeek.com/xmlapi2/thing?id=' + idJogo)}`;
        const response = await fetch(url);
        const data = await response.json();

        // Verifica se os dados foram obtidos corretamente
        if (!data.contents) {
            document.getElementById("tituloJogo").textContent = "Erro ao obter os detalhes do jogo.";
            return;
        }

        const xmlText = data.contents;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");

        // Obtém o nome do jogo corretamente
        const nomeElements = xmlDoc.querySelectorAll("name");
        let nome = "Nome não disponível";

        nomeElements.forEach(element => {
            if (element.getAttribute("type") === "primary") {
                nome = element.getAttribute("value");
            }
        });

        if (nome === "Nome não disponível" && nomeElements.length > 0) {
            nome = nomeElements[0].getAttribute("value");
        }

        // Obtém a imagem
        const imagemElement = xmlDoc.querySelector("thumbnail") || xmlDoc.querySelector("image");
        const imagem = imagemElement ? imagemElement.textContent : "https://via.placeholder.com/300";

        // Obtém a descrição
        const descricaoElement = xmlDoc.querySelector("description");
        let descricao = descricaoElement ? descricaoElement.textContent : "Descrição não disponível.";

        // Decodifica HTML/XML entities na descrição
        descricao = decodeHTMLEntities(descricao);

        // Atualiza os elementos HTML
        document.getElementById("tituloJogo").textContent = nome;
        document.getElementById("imagemJogo").src = imagem;
        document.getElementById("descricaoJogo").textContent = descricao;
    }

    // Função para decodificar entidades HTML/XML
    function decodeHTMLEntities(text) {
        const doc = new DOMParser().parseFromString(text, "text/html");
        return doc.documentElement.textContent;
    }

    // Chama a função ao carregar a página
    carregarDetalhesJogo();
