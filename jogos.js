'use strict';

async function obterDetalhesJogo(id) {
    const url = `https://api.allorigins.win/get?url=${encodeURIComponent('https://boardgamegeek.com/xmlapi2/thing?id=' + id)}`;
    const response = await fetch(url);
    const data = await response.json();
    const xmlText = data.contents;

    console.log(`XML do jogo ${id}:`, xmlText); // Depuração

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");

    // Busca a imagem, primeiro tenta <thumbnail>, depois <image>
    let imagemElement = xmlDoc.getElementsByTagName("thumbnail")[0] || xmlDoc.getElementsByTagName("image")[0];
    let imagem = imagemElement ? imagemElement.textContent : "https://via.placeholder.com/150"; // Placeholder caso não tenha

    return imagem;
}

// Função para carregar os detalhes na página
async function carregarDetalhes() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        document.getElementById("detalhes").innerHTML = "<p>Jogo não encontrado.</p>";
        return;
    }

    const imagem = await obterDetalhesJogo(id);

    // Adiciona a imagem na página
    document.getElementById("imagemJogo").src = imagem;
    document.getElementById("imagemJogo").alt = `Imagem do jogo ${id}`;
}

// Chama a função ao carregar a página
window.onload = carregarDetalhes;
