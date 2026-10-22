// Cria a estrutura explicitamente protegendo contra erros de markdown
const quantidadesExigidas = new Array();
quantidadesExigidas.push(0); 
quantidadesExigidas.push(3); 
quantidadesExigidas.push(4); 
quantidadesExigidas.push(5); 
quantidadesExigidas.push(6); 

const nomesArmas = ["", "Axe", "Hammer", "Sword"];
const nomesRaridades = ["", "Rare", "Epic", "Legendary", "Unique"];

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('btn-reverso').addEventListener('click', () => switchTab('reverso'));
    document.getElementById('btn-direto').addEventListener('click', () => switchTab('direto'));
    document.getElementById('calc-reverso-btn').addEventListener('click', calcularRotaReversa);
    document.getElementById('calc-direto-btn').addEventListener('click', calcularSimulacaoDireta);
});

function switchTab(modo) {
    document.getElementById('resultado').style.display = 'none';
    const btnReverso = document.getElementById('btn-reverso');
    const btnDireto = document.getElementById('btn-direto');
    const divReverso = document.getElementById('modo-reverso');
    const divDireto = document.getElementById('modo-direto');

    if (modo === 'reverso') {
        btnReverso.classList.add('active');
        btnDireto.classList.remove('active');
        divReverso.style.display = 'block';
        divDireto.style.display = 'none';
    } else {
        btnDireto.classList.add('active');
        btnReverso.classList.remove('active');
        divReverso.style.display = 'none';
        divDireto.style.display = 'block';
    }
}

// Retorna as strings de monstros conforme a matriz exata da tabela fornecida
function obterMonstroParaGerarArma(armaAlvo, colunaTransicao) {
    if (armaAlvo == 1) { // AXE
        switch(colunaTransicao) {
            case 1: return "Outlaw, Undead";
            case 2: return "Beast, Cult, Demon, Troll";
            case 3: return "Goblin, Golem, Militia";
            case 4: return "Outlaw, Undead";
            default: return "Outlaw, Undead";
        }
    } else if (armaAlvo == 2) { // HAMMER
        switch(colunaTransicao) {
            case 1: return "Goblin, Golem, Militia";
            case 2: return "Outlaw, Undead";
            case 3: return "Beast, Cult, Demon, Troll";
            case 4: return "Golem, Militia";
            default: return "Golem, Militia";
        }
    } else { // SWORD
        switch(colunaTransicao) {
            case 1: return "Beast, Cult, Demon, Troll";
            case 2: return "Goblin, Golem, Militia";
            case 3: return "Outlaw, Undead";
            case 4: return "Beast, Cult, Demon, Goblin, Troll";
            default: return "Beast, Cult, Demon, Goblin, Troll";
        }
    }
}

// Mapeia e colore individualmente cada palavra de monstro conforme a tabela original do jogo
function colorirCadaMonstro(textoCompleto) {
    let monstros = textoCompleto.split(",");
    let resultadoHTML = [];

    for (let i = 0; i < monstros.length; i++) {
        let m = monstros[i].trim();
        let mLower = m.toLowerCase();
        let span = m;

        if (mLower === "outlaw") span = `<span class="m-outlaw">Outlaw</span>`;
        else if (mLower === "undead") span = `<span class="m-undead">Undead</span>`;
        else if (mLower === "beast") span = `<span class="m-beast">Beast</span>`;
        else if (mLower === "cult") span = `<span class="m-cult">Cult</span>`;
        else if (mLower === "demon") span = `<span class="m-demon">Demon</span>`;
        else if (mLower === "troll") span = `<span class="m-troll">Troll</span>`;
        else if (mLower === "goblin") span = `<span class="m-goblin">Goblin</span>`;
        else if (mLower === "golem") span = `<span class="m-golem">Golem</span>`;
        else if (mLower === "militia") span = `<span class="m-militia">Militia</span>`;

        resultadoHTML.push(span);
    }

    return resultadoHTML.join(", ");
}

// LÓGICA SIMPLIFICADA: Mostra diretamente o requisito de fusão sem passos intermediários redundantes
function calcularRotaReversa() {
    const armaAlvo = parseInt(document.getElementById('rev-arma').value);
    const raridadeAlvo = parseInt(document.getElementById('rev-raridade').value);
    const resBox = document.getElementById('resultado');
    
    // Obtém os monstros necessários na coluna correspondente à raridade alvo desejada
    let monstrosExigidos = obterMonstroParaGerarArma(armaAlvo, raridadeAlvo);
    
    let classeRaridadeAlvo = raridadeAlvo === 4 ? "raridade-unique" : raridadeAlvo === 3 ? "raridade-legendary" : raridadeAlvo === 2 ? "raridade-epic" : "raridade-rare";
    let quantidade = quantidadesExigidas[raridadeAlvo];

    let html = `
        <h3>Requisito do Material Alvo</h3>
        <div class="step" style="font-size: 16px; line-height: 1.6;">
            Para obter o item final <span class="badge-qtd">➔ 1</span> <span style="font-size: 18px;" class="${classeRaridadeAlvo}">${nomesRaridades[raridadeAlvo].toUpperCase()} ${nomesArmas[armaAlvo].toUpperCase()}</span>:<br><br>
            • Você precisará fundir <strong style="font-size: 18px;">${quantidade}</strong> armas da raridade anterior.<br>
            • <strong>Importante:</strong> Todas as armas de entrada devem possuir obrigatoriamente bônus contra: <br>
            <div style="margin-top: 8px; font-size: 18px; padding: 6px; background: rgba(255,255,255,0.05); border-radius: 4px; display: inline-block;">
                ${colorirCadaMonstro(monstrosExigidos)}
            </div>
        </div>
    `;

    resBox.innerHTML = html;
    resBox.style.display = 'block';
}

function calcularSimulacaoDireta() {
    const raridadeAtual = parseInt(document.getElementById('dir-raridade').value);
    const opcaoMonstro = parseInt(document.getElementById('dir-monstro').value);
    const resBox = document.getElementById('resultado');

    const qtdArmas = quantidadesExigidas[raridadeAtual];
    const nomeRaridadeResultante = raridadeAtual === 1 ? "Rare" : raridadeAtual === 2 ? "Epic" : raridadeAtual === 3 ? "Legendary" : "Unique";
    const classeRaridadeResultante = raridadeAtual === 1 ? "raridade-rare" : raridadeAtual === 2 ? "raridade-epic" : raridadeAtual === 3 ? "raridade-legendary" : "raridade-unique";
    
    const textoMonstros = opcaoMonstro === 1 ? "Outlaw, Undead" : opcaoMonstro === 2 ? "Beast, Cult, Demon, Troll" : "Goblin, Golem, Militia";

    let resultadoArma = "Desconhecido";
    let vantagensFuturas = "Nenhuma";

    let partes = textoMonstros.split(",");
    let primeiraPalavra = partes[0].trim().toLowerCase();

    for (let linhaArma = 1; linhaArma <= 3; linhaArma++) {
        let monstrosNaTabela = obterMonstroParaGerarArma(linhaArma, raridadeAtual);
        
        if (monstrosNaTabela.toLowerCase().includes(primeiraPalavra)) {
            resultadoArma = linhaArma === 1 ? "Axe" : linhaArma === 2 ? "Hammer" : "Sword";
            vantagensFuturas = monstrosNaTabela;
            break;
        }
    }

    resBox.innerHTML = `
        <h3>Resultado Gerado na Forja</h3>
        <div style="font-size: 16px; line-height: 1.6;">
            Você fundiu <span class="badge-qtd">${qtdArmas}</span> armas e obteve:<br>
            <span style="font-size: 22px; font-weight: bold;">➔ 1 <span class="${classeRaridadeResultante}">${nomeRaridadeResultante.toUpperCase()}</span> ${resultadoArma.toUpperCase()}</span><br>
            Vantagem herdada: Forte contra ${colorirCadaMonstro(vantagensFuturas)}<br><br>
            <small style="color: var(--text-secondary);">* Nota: O tipo original das armas de entrada foi descartado, usando apenas a classificação do monstro.</small>
        </div>
    `;
    resBox.style.display = 'block';
}
