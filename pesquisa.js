'use strict';

// Função para buscar jogos pelo nome
async function pesquisarJogos(nomeJogo) {
    const url = `https://api.geekdo.com/xmlapi/search?search=${nomeJogo}`;
    const response = await fetch(url);
    const xmlText = await response.text();

    // Converte XML para objeto manipulável
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");

    console.log(xmlDoc); // Para verificar se estamos recebendo os dados corretamente

    // Seleciona todos os <boardgame> retornados
    const items = xmlDoc.getElementsByTagName("boardgame");
    let jogos = [];

    for (let i = 0; i < items.length; i++) {
        // Verifica se o <name> existe
        const nomeElement = items[i].getElementsByTagName("name")[0];
        if (nomeElement) {
            jogos.push(nomeElement.textContent);
        }
    }

    return jogos;
}

// Função para criar elementos na tela
function criarElementoJogo(nomeJogo) {
    const lista = document.getElementById('listaJogos');
    const novoItem = document.createElement('li');
    novoItem.textContent = nomeJogo;
    
    lista.appendChild(novoItem);
}

// Função principal para preencher a lista de jogos
async function preencherJogos() {
    const nomeJogo = document.getElementById('nomeJogo').value.trim();
    
    if (nomeJogo === "") {
        alert("Por favor, digite o nome de um jogo.");
        return;
    }

    const jogos = await pesquisarJogos(nomeJogo);
    const lista = document.getElementById('listaJogos');

    // Limpa a lista antes de exibir novos resultados
    lista.innerHTML = '';

    if (jogos.length === 0) {
        lista.innerHTML = '<li>Nenhum jogo encontrado.</li>';
    } else {
        // Adiciona cada jogo à lista
        jogos.forEach(criarElementoJogo);
    }

    console.log(jogos);
}

// Adiciona evento ao botão de pesquisa
document.getElementById('pesquisar').addEventListener('click', preencherJogos);
