const URL_FIREBASE =
  "https://coleira-smartpet-default-rtdb.firebaseio.com/coleira.json";

const INTERVALO_ATUALIZACAO = 3000;

const elementos = {
  conexao: document.getElementById("conexao"),
  textoConexao: document.getElementById("texto-conexao"),

  petCard: document.getElementById("pet-card"),
  nomePet: document.getElementById("nome-pet"),
  racaPet: document.getElementById("raca-pet"),
  idadePet: document.getElementById("idade-pet"),

  statusBox: document.getElementById("status-box"),
  statusTexto: document.getElementById("status-texto"),
  alertaCard: document.getElementById("alerta-card"),

  bateria: document.getElementById("bateria"),
  barraBateria: document.getElementById("barra-bateria"),
  textoBateria: document.getElementById("texto-bateria"),

  temperatura: document.getElementById("temperatura"),
  ultimaAtualizacao: document.getElementById("ultima-atualizacao"),

  tipoLocalizacao: document.getElementById("tipo-localizacao"),
  localizacao: document.getElementById("localizacao"),
  latitude: document.getElementById("latitude"),
  longitude: document.getElementById("longitude"),

  origemDados: document.getElementById("origem-dados")
};

async function buscarDadosFirebase() {
  try {
    const resposta = await fetch(URL_FIREBASE);

    if (!resposta.ok) {
      throw new Error("Não foi possível consultar o Firebase.");
    }

    const dados = await resposta.json();

    if (!dados || !dados.monitoramento) {
      throw new Error("Dados de monitoramento não encontrados.");
    }

    atualizarDashboard(dados);
    atualizarConexao(true);
  } catch (erro) {
    atualizarConexao(false);
    console.error("Erro ao carregar dados:", erro);
  }
}

function atualizarDashboard(dados) {
  const pet = dados.pet || {};
  const monitoramento = dados.monitoramento || {};

  elementos.nomePet.textContent = pet.nome || "Pet não informado";
  elementos.racaPet.textContent = pet.raca || "---";
  elementos.idadePet.textContent = pet.idade || "---";

  atualizarStatus(monitoramento.alerta, monitoramento.status);
  atualizarBateria(monitoramento.bateria);

  elementos.temperatura.textContent =
    formatarNumero(monitoramento.temperatura, 1);

  elementos.localizacao.textContent =
    monitoramento.localizacaoDescricao || "Localização não disponível";

  elementos.latitude.textContent =
    formatarNumero(monitoramento.latitude, 4);

  elementos.longitude.textContent =
    formatarNumero(monitoramento.longitude, 4);

  elementos.tipoLocalizacao.textContent =
    monitoramento.tipoLocalizacao || "SIMULADA";

  elementos.origemDados.textContent =
    monitoramento.origemDados || "Origem não informada";

  elementos.ultimaAtualizacao.textContent =
    formatarDataHora(monitoramento.ultimaAtualizacao);
}

function atualizarStatus(alerta, status) {
  const estaPerdido = alerta === true || status === "PERDIDO";

  if (estaPerdido) {
    elementos.statusTexto.textContent = "PERDIDO";
    elementos.statusBox.classList.remove("seguro");
    elementos.statusBox.classList.add("perdido");

    elementos.petCard.classList.add("perdido");
    elementos.alertaCard.classList.remove("oculto");
  } else {
    elementos.statusTexto.textContent = "SEGURO";
    elementos.statusBox.classList.remove("perdido");
    elementos.statusBox.classList.add("seguro");

    elementos.petCard.classList.remove("perdido");
    elementos.alertaCard.classList.add("oculto");
  }
}

function atualizarBateria(valorBateria) {
  const bateria = Number(valorBateria) || 0;

  elementos.bateria.textContent = bateria;
  elementos.barraBateria.style.width = `${bateria}%`;

  if (bateria <= 20) {
    elementos.barraBateria.classList.add("baixa");
    elementos.textoBateria.textContent = "Bateria baixa. Recarregue a coleira.";
  } else {
    elementos.barraBateria.classList.remove("baixa");
    elementos.textoBateria.textContent = "Nível de bateria da coleira.";
  }
}

function atualizarConexao(estaConectado) {
  if (estaConectado) {
    elementos.conexao.classList.remove("erro");
    elementos.textoConexao.textContent = "CONECTADA";
  } else {
    elementos.conexao.classList.add("erro");
    elementos.textoConexao.textContent = "SEM CONEXÃO";
  }
}

function formatarNumero(valor, casasDecimais) {
  const numero = Number(valor);

  if (Number.isNaN(numero)) {
    return "---";
  }

  return numero.toFixed(casasDecimais);
}

function formatarDataHora(timestamp) {
  if (!timestamp) {
    return "Sem atualização";
  }

  const data = new Date(Number(timestamp));

  if (Number.isNaN(data.getTime())) {
    return "Data indisponível";
  }

  return data.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium"
  });
}

buscarDadosFirebase();

setInterval(buscarDadosFirebase, INTERVALO_ATUALIZACAO);