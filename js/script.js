var whoAreYou = document.createElement("audio");
whoAreYou.src = "sons/whoAreYou.mp3";

var win = document.createElement("audio");
win.src = "sons/win.mp3";

var inicio;
var fim;
var fps;
var apanhadas = [];
var pontuacao = [];
var aSaltar = false;

window.onload = function () {
    carregaElementos();
};

function carregaElementos() {
    for (var i = 0; i < 6; i++)
        document.getElementById("main").innerHTML += "<img id='garrafa" + i + "' src='img/garrafa.png' alt='garrafa'>";
    document.getElementById("main").innerHTML += "<img id='jogador' src='img/player_direita.png' alt='jogador'>";
    document.getElementById("fim").style.display = "none";
    document.getElementById("main").innerHTML += "<img id='inimigo' src='img/inimigo.png' alt='inimigo'>";
    document.getElementById("main").innerHTML += "<img id='laser' src='img/laser.png' alt='laser'>";

    whoAreYou.play();

    document.getElementById("btn_jogar").onclick = function () {
        jogar();
    };
    document.getElementById("btn_recomecar").onclick = function () {
        jogar();
    };
}

function jogar() {
    apanhadas = [];
    document.getElementById("ajuda").style.display = "none";
    document.getElementById("fim").style.display = "none";
    inicio = new Date();

    for (var j = 1; j <= 2; j++)
        document.getElementById("plataforma" + j).style.top = j * 250 + "px";
    document.getElementById("jogador").style.left = "50px";
    document.getElementById("jogador").style.top = parseInt(document.getElementById("plataforma2").style.top) - 125 + "px";
    for (var k = 0; k < 6; k++) {
        var nPlataforma = Math.floor(Math.random() * 2) + 1;
        var plataformaY = parseInt(document.getElementById("plataforma" + nPlataforma).style.top);
        document.getElementById("garrafa" + k).style.left = Math.floor(Math.random() * (750 - 16)) + "px";
        document.getElementById("garrafa" + k).style.top = plataformaY - 48 + "px";
        document.getElementById("garrafa" + k).style.display = "block";
    }
    document.getElementById("inimigo").style.left = "675px";
    document.getElementById("inimigo").style.top = parseInt(document.getElementById("plataforma1").style.top) - 60 + "px";
    document.getElementById("laser").style.left = "675px";
    document.getElementById("laser").style.top = parseInt(document.getElementById("plataforma1").style.top) - 30 + "px";

    document.getElementById("jogador").src = "img/player_direita.png";

    fps = setInterval("atualizaJogo()", 1000 / 60);

    window.onkeypress = function (event) {
        processaTecla(event);
    }
}

function processaTecla(evt) {
    var jogadorH_esq = parseInt(document.getElementById("jogador").style.left);
    var jogadorH_dir = parseInt(document.getElementById("jogador").style.left) + 52;
    var jogadorV = parseInt(document.getElementById("jogador").style.top) + 125;
    var plataforma1 = parseInt(document.getElementById("plataforma1").style.top);
    var plataforma2 = parseInt(document.getElementById("plataforma2").style.top);

    switch (evt.key) {           //ou evt.keyCode
        case 'w':   //keyCode == 119
            if (jogadorH_dir >= 150 && jogadorH_esq <= 210 && jogadorV <= plataforma2 && jogadorV > plataforma1) {
                document.getElementById("jogador").style.top = parseInt(document.getElementById("jogador").style.top) - 10 + "px";
            }
            break;
        case 'a':   //keyCode == 97
            if (jogadorH_esq > 0 && (jogadorV == plataforma1 || jogadorV == plataforma2)) {
                document.getElementById("jogador").src = "img/player_esquerda.png";
                document.getElementById("jogador").style.left = parseInt(document.getElementById("jogador").style.left) - 10 + "px";
            }
            break;
        case 's':   //keyCode == 115
            if (jogadorH_dir >= 150 && jogadorH_esq <= 210 && jogadorV < plataforma2 && jogadorV >= plataforma1) {
                document.getElementById("jogador").style.top = parseInt(document.getElementById("jogador").style.top) + 10 + "px";
            }
            break;
        case 'd':   //keyCode == 100
            if (jogadorH_dir < 750 && (jogadorV == plataforma1 || jogadorV == plataforma2)) {
                document.getElementById("jogador").src = "img/player_direita.png";
                document.getElementById("jogador").style.left = parseInt(document.getElementById("jogador").style.left) + 10 + "px";
            }
            break;
        case ' ':
            if (!aSaltar)
                salto();
            break;
        default:
            document.getElementById("ajuda").style.display = "block";
            break;
    }

    for (var l = 0; l < 6; l++) {
        if (detetaColisao(52, 125, "garrafa" + l, 16, 48)) {
            apanhadas[l] = true;
            document.getElementById("garrafa" + l).style.display = "none";
        }
    }
}

function detetaColisao(jogadorLargura, jogadorAltura, objeto, objetoLargura, objetoAltura) {
    var jogadorEsq = parseInt(document.getElementById("jogador").style.left);
    var jogadorDir = jogadorEsq + jogadorLargura;
    var jogadorTopo = parseInt(document.getElementById("jogador").style.top);
    var jogadorBaixo = jogadorTopo + jogadorAltura;

    var objetoEsq = parseInt(document.getElementById(objeto).style.left);
    var objetoDir = objetoEsq + objetoLargura;
    var objetoTopo = parseInt(document.getElementById(objeto).style.top);
    var objetoBaixo = objetoTopo + objetoAltura;

    if (jogadorEsq <= objetoDir && jogadorDir >= objetoEsq && jogadorTopo <= objetoBaixo && jogadorBaixo >= objetoTopo)
        return true;
    else return false;
}

function atualizaJogo() {
    var a = 0;
    while (apanhadas[a])
        a++;
    if (a == 6)
        fimJogo(true);

    fim = new Date();
    document.getElementById("txt_tempo").innerHTML = (fim - inicio) / 1000;
    tiro();
}

function fimJogo(ganha) {
    clearInterval(fps);
    window.onkeypress = null;
    var tempo = 0;
    if (ganha) {
        document.getElementById("jogador").src = "img/player_won.gif";
        win.play();
        setTimeout("document.getElementById('fim').style.display = 'block';", 7500);
        fim = new Date();
        tempo = (fim - inicio) / 1000;
    } else {
        tempo = 999999;
        document.getElementById('fim').style.display = 'block';
    }
    document.getElementById("tempo").innerHTML = tempo;

    pontuacao.unshift(tempo);           // ou pontuacao.push(tempo)
    pontuacao.sort(function (a, b) {
        return (a - b)
    });
    if (pontuacao.length > 5)
        pontuacao.pop();
    document.getElementById("tabela").innerHTML = "";
    for (var i = 0; i < pontuacao.length; i++)
        document.getElementById("tabela").innerHTML += i + 1 + " - " + pontuacao[i] + "<br/>";
    document.getElementById("nome").innerHTML = document.getElementById("nome_txt").value;
}

function tiro() {
    var tiroX = parseInt(document.getElementById("laser").style.left);
    document.getElementById("laser").style.left = tiroX - 5 + "px";
    if (tiroX <= 0)
        document.getElementById("laser").style.left = "675px";
    if (detetaColisao(52, 125, "laser", 15, 5))
        fimJogo(false);
}

function salto() {
    aSaltar = true;
    var posY = parseInt(document.getElementById("jogador").style.top);
    var salto = 0;
    var up = true;
    var timerSalto = setInterval(function () {
        document.getElementById("jogador").style.top = posY - salto + "px";
        if (up)
            salto += 10;
        else
            salto -= 5;
        if (salto == 100)
            up = false;
        if (salto == -5) {
            clearInterval(timerSalto);
            aSaltar = false;
        }
    }, 20);
}