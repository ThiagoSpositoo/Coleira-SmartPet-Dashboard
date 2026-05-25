# 🐾 Coleira SmartPet

## Coleira Inteligente para Identificação e Monitoramento de Pets

A **Coleira SmartPet** é um protótipo de coleira inteligente desenvolvido para ajudar na identificação e no monitoramento de animais de estimação, principalmente em situações em que um pet se perde ou é encontrado por outra pessoa.

Nesta primeira Sprint, o projeto foi desenvolvido de forma simulada utilizando **IoT com ESP32 no Wokwi**, integração com **Firebase Realtime Database**, um **dashboard próprio** e uma página de identificação acessada por **QR Code**.

---

## 👥 Integrantes

| Nome | RM |
|---|---:|
| Thiago Sposito | RM 561694 |
| Murilo Macedo | RM 566462 |
| Lucas Lopes | RM 563544 |
| Pedro Gomes | RM 562606 |
| Gustavo Freire | RM 561334 |

---

## 🎯 Problema

Quando um pet se perde, muitas vezes a pessoa que encontra o animal não consegue identificar rapidamente:

- quem é o tutor;
- como entrar em contato;
- qual é o nome do pet;
- se existe algum alerta ativo;
- qual foi a última localização registrada.

Essa falta de informações pode dificultar o reencontro entre o animal e seu tutor.

---

## 💡 Solução Proposta

A **Coleira SmartPet** foi criada como uma solução para facilitar a identificação e o acompanhamento do pet.

A coleira conta com:

- visor OLED exibindo o nome do pet e informações importantes;
- leitura simulada de temperatura;
- acompanhamento do nível de bateria;
- botão para ativar o modo de alerta;
- LED vermelho indicando que o pet foi marcado como perdido;
- envio dos dados para um banco online;
- dashboard próprio para visualização das informações;
- QR Code que direciona para a página de identificação do pet.

Nesta Sprint, o rastreamento por localização foi representado de forma **simulada**. Em uma próxima etapa, a solução poderá evoluir para utilizar um módulo GPS real.

---

## 🧩 Arquitetura do Projeto

O funcionamento do projeto acontece da seguinte forma:

```text
Coleira simulada no Wokwi
        ↓
ESP32 coleta temperatura, bateria e status
        ↓
Dados enviados por HTTP
        ↓
Firebase Realtime Database
        ↓
Dashboard SmartPet consulta os dados
        ↓
Informações exibidas ao usuário e na página do QR Code
```

---

## ⚙️ Protótipo IoT no Wokwi

O protótipo da coleira foi desenvolvido no **Wokwi**, utilizando um ESP32 e componentes simulados.

### Componentes utilizados

| Componente | Função no projeto |
|---|---|
| ESP32 | Controla a lógica da coleira e envia os dados para o Firebase |
| Display OLED SSD1306 | Exibe o nome do pet, temperatura, bateria e status |
| Sensor DHT22 | Simula a leitura de temperatura |
| Potenciômetro | Simula o nível da bateria da coleira |
| Botão | Ativa e desativa o modo de alerta |
| LED vermelho | Indica visualmente quando o pet está em modo perdido |
| Resistor de 220Ω | Protege o LED no circuito |

### Pinos utilizados no ESP32

| Função | Pino |
|---|---:|
| OLED SDA | 21 |
| OLED SCL | 22 |
| DHT22 DATA | 4 |
| Potenciômetro SIG | 34 |
| Botão de alerta | 14 |
| LED vermelho | 27 |

---

## 🖥️ Funcionalidades Implementadas

### Na coleira simulada

- Exibição do nome do pet no visor OLED;
- exibição da temperatura monitorada;
- exibição do nível de bateria;
- status inicial seguro;
- ativação do modo perdido por botão;
- acendimento do LED vermelho em situação de alerta;
- envio dos dados para o Firebase.

### No dashboard

- Visualização do pet monitorado;
- exibição do status seguro ou perdido;
- acompanhamento de bateria;
- acompanhamento de temperatura;
- exibição da última atualização;
- visualização da localização simulada;
- QR Code para identificação do animal;
- atualização automática dos dados recebidos do Firebase.

### Na página de identificação

- Nome, raça e idade do pet;
- dados fictícios do tutor;
- telefone de contato fictício;
- localização simulada;
- bateria e temperatura;
- status atualizado da coleira.

---

## 🔌 Comunicação IoT

Para atender ao requisito de comunicação do projeto, utilizamos o protocolo **HTTP**.

O ESP32 simulado no Wokwi envia os dados da coleira para o **Firebase Realtime Database** por meio de requisições HTTP/HTTPS.

Os principais dados enviados são:

```json
{
  "temperatura": 23.5,
  "bateria": 52,
  "alerta": false,
  "status": "SEGURO",
  "latitude": -23.5874,
  "longitude": -46.6576,
  "tipoLocalizacao": "SIMULADA",
  "origemDados": "ESP32 - Wokwi"
}
```

Quando o botão de alerta é pressionado, o sistema altera o status para:

```json
{
  "alerta": true,
  "status": "PERDIDO"
}
```

Essa alteração é exibida automaticamente no dashboard.

---

## 🗂️ Estrutura do Projeto

```text
Coleira-SmartPet-Dashboard/
│
├── Assets/
│   └── qrcode/
│       └── qrcode-identificacao-smartpet.png
│
├── CSS/
│   ├── identificacao.css
│   └── style.css
│
├── HTML/
│   ├── identificacao.html
│   └── index.html
│
├── JavaScript/
│   ├── dashboard.js
│   └── identificacao.js
│
├── docs/
│   ├── dashboard-publicado.png
│   ├── firebase-status-perdido.png
│   ├── firebase-status-seguro.png
│   ├── wokwi-alerta-ativo.png
│   └── wokwi-circuito.png
│
├── iot-wokwi/
│   ├── libraries.txt
│   ├── link-wokwi.txt
│   └── sketch.ino
│
├── index.html
└── README.md
```

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Utilização |
|---|---|
| Wokwi | Simulação do circuito IoT |
| ESP32 | Controle principal da coleira |
| Arduino / C++ | Código do protótipo IoT |
| OLED SSD1306 | Visor da coleira |
| DHT22 | Simulação da temperatura |
| Firebase Realtime Database | Armazenamento e atualização dos dados |
| HTTP/HTTPS | Comunicação entre ESP32 e Firebase |
| HTML | Estrutura do dashboard e da página de identificação |
| CSS | Estilização das telas |
| JavaScript | Consulta e atualização dos dados no dashboard |
| GitHub | Versionamento e armazenamento do projeto |
| GitHub Pages | Publicação do dashboard |
| QR Code | Acesso rápido à identificação do pet |

---

## 🚀 Como Executar o Projeto

### 1. Visualizar o dashboard publicado

Acesse o dashboard da Coleira SmartPet pelo link:

🔗 [Dashboard SmartPet](https://thiagospositoo.github.io/Coleira-SmartPet-Dashboard/HTML/index.html)

Nesta página, é possível visualizar:

- status atual da coleira;
- nível de bateria;
- temperatura;
- localização simulada;
- QR Code de identificação.

---

### 2. Visualizar a página de identificação do pet

A página acessada pelo QR Code também pode ser aberta diretamente:

🔗 [Identificação do Pet](https://thiagospositoo.github.io/Coleira-SmartPet-Dashboard/HTML/identificacao.html)

Essa página apresenta os dados do pet e dados fictícios do tutor para demonstração da solução.

---

### 3. Executar o protótipo no Wokwi

Acesse o protótipo simulado pelo link:

🔗 **Link do Wokwi:**  
[Protótipo IoT - Coleira SmartPet](https://wokwi.com/projects/464952093084721153)

Ao abrir o projeto no Wokwi:

1. Clique no botão verde de execução;
2. observe o display OLED apresentando os dados do pet;
3. gire o potenciômetro para alterar a bateria;
4. altere a temperatura no sensor DHT22;
5. pressione o botão verde para ativar o modo perdido;
6. observe o LED vermelho acender;
7. acompanhe a alteração no dashboard publicado.

---

## 🧪 Como Testar as Funcionalidades

### Teste 1 — Status seguro

Ao iniciar o protótipo, o sistema deve apresentar:

```text
STATUS: SEGURO
```

No dashboard, o status também será exibido como **SEGURO**.

---

### Teste 2 — Alteração da bateria

Ao girar o potenciômetro no Wokwi:

- o valor da bateria muda no display OLED;
- o valor é enviado ao Firebase;
- o dashboard atualiza a porcentagem exibida.

---

### Teste 3 — Alteração da temperatura

Ao modificar a temperatura do sensor DHT22:

- o novo valor aparece no display OLED;
- o Firebase recebe a nova leitura;
- o dashboard atualiza a temperatura exibida.

---

### Teste 4 — Ativação do modo perdido

Ao pressionar o botão verde:

- o display informa que o pet está perdido;
- o LED vermelho acende;
- o Firebase altera o campo `alerta` para `true`;
- o status passa a ser `PERDIDO`;
- o dashboard exibe um aviso visual de alerta.

---

### Teste 5 — QR Code

Ao escanear o QR Code exibido no dashboard:

- o usuário é direcionado para a página de identificação;
- são apresentados os dados do pet;
- são exibidos os dados fictícios do tutor;
- o status da coleira também pode ser consultado.

---

## 📸 Resultados Parciais

Nesta primeira Sprint, conseguimos desenvolver uma prova de conceito funcional da Coleira SmartPet.

### Resultados alcançados

- Protótipo IoT simulado no Wokwi;
- ESP32 controlando os componentes da coleira;
- visor OLED exibindo os dados do pet;
- simulação de temperatura e bateria;
- botão de alerta funcionando;
- LED vermelho indicando modo perdido;
- integração com Firebase utilizando HTTP;
- dashboard próprio publicado;
- QR Code funcional direcionando para a identificação do pet;
- atualização do status entre seguro e perdido.

### Modo seguro

O sistema inicia com o pet em estado seguro, apresentando os dados coletados e enviados ao Firebase.

![Firebase em modo seguro](docs/firebase-status-seguro.png)

### Modo perdido

Ao pressionar o botão no protótipo, o sistema altera o status para perdido e atualiza as informações no Firebase e no dashboard.

![Firebase em modo perdido](docs/firebase-status-perdido.png)

### Dashboard publicado

O dashboard apresenta as informações da coleira de forma visual, incluindo bateria, temperatura, localização simulada e QR Code.

![Dashboard SmartPet](docs/dashboard-publicado.png)

---

## 🔮 Próximos Passos

Como evolução para as próximas etapas do projeto, pretendemos:

- desenvolver uma versão física da coleira;
- integrar um módulo GPS real;
- melhorar o tamanho e o formato do dispositivo;
- criar novas funções para aviso ao tutor;
- adicionar autenticação e proteção dos dados;
- melhorar a página de acompanhamento do pet;
- realizar testes com componentes físicos.

---

## 🎥 Vídeo de Apresentação

O vídeo da apresentação funcional do projeto está disponível no YouTube em modo não listado:

🔗 [Assistir ao vídeo da Coleira SmartPet](https://youtu.be/PKswJmVo-fw)

---

## 🔗 Links do Projeto

| Recurso | Link |
|---|---|
| Repositório GitHub | [Coleira SmartPet Dashboard](https://github.com/ThiagoSpositoo/Coleira-SmartPet-Dashboard) |
| Dashboard publicado | [Acessar Dashboard](https://thiagospositoo.github.io/Coleira-SmartPet-Dashboard/HTML/index.html) |
| Página de identificação | [Acessar Identificação do Pet](https://thiagospositoo.github.io/Coleira-SmartPet-Dashboard/HTML/identificacao.html) |
| Vídeo de apresentação | [Assistir no YouTube](https://youtu.be/PKswJmVo-fw) |
| Protótipo no Wokwi | [Acessar simulação](https://wokwi.com/projects/464952093084721153) |

---

## 🔒 Observação sobre os Dados

Os dados utilizados para identificação do tutor e localização do pet neste projeto são **fictícios ou simulados**, sendo utilizados exclusivamente para demonstração acadêmica da solução.

Em uma versão real do produto, seria necessário implementar segurança, autenticação e proteção das informações armazenadas.

---

## 📚 Disciplina

**Disruptive Architectures: IoT, IOB & Generative IA**  
**Sprint 1 — FIAP**

---

<p align="center">
  Desenvolvido para auxiliar na segurança e identificação de pets 🐾
</p>
