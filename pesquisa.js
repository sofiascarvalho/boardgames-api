/*'use strict'

// Função para buscar jogos pelo nome
async function pesquisarJogos(nomeJogo) {
    const url = `https://api.allorigins.win/get?url=${encodeURIComponent('https://boardgamegeek.com/xmlapi2/search?query=' + nomeJogo + '&type=boardgame')}`
    const response = await fetch(url)
    const xmlText =await response.text()

    // Converte XML para objeto manipulável
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlText, "text/xml")

    console.log(xmlDoc) 

    // Pega todos os <item> retornados
    const items = xmlDoc.getElementsByTagName("item")
    let jogos = []

    for (let i = 0; i < items.length; i++) {
        const id = items[i].getAttribute("id") 
        const nomeElement = items[i].getElementsByTagName("name")[0]

        if (nomeElement) {
            const nome = nomeElement.getAttribute("value")
            jogos.push({ id, nome })
        }
    }

    return jogos
}

// Função para buscar detalhes do jogo (inclui imagem)
async function obterDetalhesJogo(id) {
    const url = `https://api.allorigins.win/get?url=${encodeURIComponent('https://boardgamegeek.com/xmlapi2/thing?id=' + id)}`
    const response = await fetch(url)
    const xmlText = await response.text()

    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlText, "text/xml")

    
    const imagemElement = xmlDoc.getElementsByTagName("image")[0]
    const imagem = imagemElement ? imagemElement.textContent : "sem-imagem.jpg" // Se não houver imagem, usa uma padrão

    return imagem
}

// Função principal para preencher a lista de jogos
async function preencherJogos() {
    const nomeJogo = document.getElementById('nomeJogo').value.trim()

    if (nomeJogo === "") {
        alert("Por favor, digite o nome de um jogo.")
        return
    }

    const jogos = await pesquisarJogos(nomeJogo)

    if (jogos.length === 0) {
        alert("Nenhum jogo encontrado!")
        return
    }

    // Para cada jogo, busca a imagem
    for (let jogo of jogos) {
        jogo.imagem = await obterDetalhesJogo(jogo.id)
    }

    // Salva no localStorage para exibir na outra página
    localStorage.setItem("jogosPesquisados", JSON.stringify(jogos))
    // Redireciona para a página de exibição
    window.location.assign("jogos.html")
}

document.getElementById('pesquisar').addEventListener('click', preencherJogos)*/

'use strict';

// Função para buscar jogos pelo nome
async function pesquisarJogos(nomeJogo) {
    const url = `https://api.allorigins.win/get?url=${encodeURIComponent('https://boardgamegeek.com/xmlapi2/search?query=' + nomeJogo + '&type=boardgame')}`;
    const response = await fetch(url);
    const data = await response.json();
    const xmlText = data.contents;
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");

    const items = xmlDoc.getElementsByTagName("item");
    let jogos = [];

    for (let i = 0; i < items.length; i++) {
        const id = items[i].getAttribute("id");
        const nomeElement = items[i].getElementsByTagName("name")[0];

        if (nomeElement) {
            const nome = nomeElement.getAttribute("value");
            jogos.push({ id, nome });
        }
    }

    return jogos;
}

// Função para obter detalhes do jogo (imagem e descrição)
async function obterDetalhesJogo(id) {
    const url = `https://api.allorigins.win/get?url=${encodeURIComponent('https://boardgamegeek.com/xmlapi2/thing?id=' + id)}`;
    const response = await fetch(url);
    const data = await response.json();
    const xmlText = data.contents;

    console.log(`Detalhes do jogo ${id}:`, xmlText); // Depuração

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");

    // Obtém a imagem (thumbnail ou imagem principal)
    let imagemElement = xmlDoc.getElementsByTagName("thumbnail")[0] || xmlDoc.getElementsByTagName("image")[0];
    let imagem = imagemElement ? imagemElement.textContent : "https://via.placeholder.com/150"; // Imagem padrão

    // Obtém a descrição
    let descricaoElement = xmlDoc.querySelector("description");
    let descricao = descricaoElement ? descricaoElement.textContent : "Descrição não disponível.";
    
    // Decodifica HTML/XML entities
    descricao = decodeHTMLEntities(descricao);

    return { imagem, descricao };
}

// Função para decodificar entidades HTML/XML
function decodeHTMLEntities(text) {
    const doc = new DOMParser().parseFromString(text, "text/html");
    return doc.documentElement.textContent;
}

// Função principal para preencher a lista de jogos na mesma página
async function preencherJogos() {
    const nomeJogo = document.getElementById('nomeJogo').value.trim();
    const lista = document.getElementById('listaJogos');
    lista.innerHTML = ''; // Limpa a lista anterior

    if (nomeJogo === "") {
        alert("Por favor, digite o nome de um jogo.");
        return;
    }

    const jogos = await pesquisarJogos(nomeJogo);

    if (jogos.length === 0) {
        lista.innerHTML = "<p>Nenhum jogo encontrado.</p>";
        return;
    }

    for (let jogo of jogos) {
        let detalhes = await obterDetalhesJogo(jogo.id);
        jogo.imagem = detalhes.imagem;
        jogo.descricao = detalhes.descricao;

        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.id = jogo.id;

        const img = document.createElement("img");
        img.src = `https://api.codetabs.com/v1/proxy/?quest=${jogo.imagem}`;
        img.alt = jogo.nome;

        const title = document.createElement("h3");
        title.textContent = jogo.nome;

        card.appendChild(img);
        card.appendChild(title);
        lista.appendChild(card);

        // Redireciona para jogos.html ao clicar no card
        card.addEventListener("click", () => {
            window.location.href = `jogos.html?id=${jogo.id}`;
        });
    }
}

// Adiciona evento ao botão de pesquisa
document.getElementById('pesquisar').addEventListener('click', preencherJogos);
