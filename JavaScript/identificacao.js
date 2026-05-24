const URL_FIREBASE =
  "https://coleira-smartpet-default-rtdb.firebaseio.com/coleira.json";

const INTERVALO_ATUALIZACAO = 3000;

const elementos = {
  conexao: document.getElementById("conexao"),
  textoConexao: document.getElementById("texto-conexao"),

  avisoStatus: document.getElementById("aviso-status"),
  tituloAviso: document.getElementById("titulo-aviso"),
  textoAviso: document.getElementById("texto-aviso"),

  nomePet: document.getElementById("nome-pet"),
  racaPet: document.getElementById("raca-pet"),
  idadePet: document.getElementById("idade-pet"),

  status: document.getElementById("status"),
  statusTexto: document.getElementById("status-texto"),

  nomeTutor: document.getElementById("nome-tutor"),
  telefoneTutor: document.getElementById("telefone-tutor"),

  localizacao: document.getElementById("localizacao"),
  latitude: document.getElementById("latitude"),
  longitude: document.getElementById("longitude"),
  tipoLocalizacao: document.getElementById("tipo-localizacao"),

  bateria: document.getElementById("bateria"),
  barraBateria: document.getElementById("barra-bateria"),
  temperatura: document.getElementById("temperatura"),
  ultimaAtualizacao: document.getElementById("ultima-atualizacao"),
  origemDados: document.getElementById("origem-dados")
};

async function buscarDados() {
  try {
    const resposta = await fetch(URL_FIREBASE);

    if (!resposta.ok) {
      throw new Error("Falha ao buscar dados no Firebase.");
    }

    const dados = await resposta.json();

    if (!dados) {
      throw new Error("Nenhum dado localizado.");
    }

    preencherIdentificacao(dados);
    indicarConexao(true);
  } catch (erro) {
    indicarConexao(false);
    console.error("Erro ao carregar identificação:", erro);
  }
}

function preencherIdentificacao(dados) {
  const pet = dados.pet || {};
  const tutor = dados.tutor || {};
  const monitoramento = dados.monitoramento || {};

  elementos.nomePet.textContent = pet.nome || "Pet não identificado";
  elementos.racaPet.textContent = pet.raca || "---";
  elementos.idadePet.textContent = pet.idade || "---";

  elementos.nomeTutor.textContent = tutor.nome || "Não informado";
  elementos.telefoneTutor.textContent = tutor.telefone || "Não informado";

  elementos.localizacao.textContent =
    monitoramento.localizacaoDescricao || "Não disponível";

  elementos.latitude.textContent =
    formatarNumero(monitoramento.latitude, 4);

  elementos.longitude.textContent =
    formatarNumero(monitoramento.longitude, 4);

  elementos.tipoLocalizacao.textContent =
    `${monitoramento.tipoLocalizacao || "SIMULADA"} - prova de conceito`;

  elementos.bateria.textContent = monitoramento.bateria ?? "--";
  elementos.temperatura.textContent =
    formatarNumero(monitoramento.temperatura, 1);

  elementos.ultimaAtualizacao.textContent =
    formatarDataHora(monitoramento.ultimaAtualizacao);

  elementos.origemDados.textContent =
    monitoramento.origemDados || "Origem não informada";

  atualizarBarraBateria(monitoramento.bateria);
  atualizarStatus(monitoramento.alerta, monitoramento.status);
}

function atualizarStatus(alerta, statusAtual) {
  const perdido = alerta === true || statusAtual === "PERDIDO";

  if (perdido) {
    elementos.status.classList.remove("seguro");
    elementos.status.classList.add("perdido");
    elementos.statusTexto.textContent = "PERDIDO";

    elementos.avisoStatus.classList.add("perdido");
    elementos.avisoStatus.querySelector(".aviso-icone").textContent = "!";
    elementos.tituloAviso.textContent = "Alerta: este pet pode estar perdido";
    elementos.textoAviso.textContent =
      "Entre em contato com o tutor e informe a localização onde o animal foi encontrado.";
  } else {
    elementos.status.classList.remove("perdido");
    elementos.status.classList.add("seguro");
    elementos.statusTexto.textContent = "SEGURO";

    elementos.avisoStatus.classList.remove("perdido");
    elementos.avisoStatus.querySelector(".aviso-icone").textContent = "✓";
    elementos.tituloAviso.textContent = "Pet monitorado com segurança";
    elementos.textoAviso.textContent =
      "Esta página contém informações para auxiliar na identificação do animal.";
  }
}

function atualizarBarraBateria(valor) {
  const bateria = Number(valor) || 0;

  elementos.barraBateria.style.width = `${bateria}%`;

  if (bateria <= 20) {
    elementos.barraBateria.classList.add("baixa");
  } else {
    elementos.barraBateria.classList.remove("baixa");
  }
}

function indicarConexao(conectado) {
  if (conectado) {
    elementos.conexao.classList.remove("erro");
    elementos.textoConexao.textContent = "DADOS ATUALIZADOS";
  } else {
    elementos.conexao.classList.add("erro");
    elementos.textoConexao.textContent = "SEM CONEXÃO";
  }
}

function formatarNumero(valor, casas) {
  const numero = Number(valor);

  if (Number.isNaN(numero)) {
    return "---";
  }

  return numero.toFixed(casas);
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

buscarDados();

setInterval(buscarDados, INTERVALO_ATUALIZACAO);