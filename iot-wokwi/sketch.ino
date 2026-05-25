#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <DHT.h>

// Bibliotecas para o funcionamento do wifi
#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>


// Nome do pet exibido na coleira
#define NOME_PET "THOR"

//Pinos usados no ESP32

#define PINO_DHT 4
#define PINO_BATERIA 34
#define PINO_BOTAO 14
#define PINO_LED 27

// Configuração do DHT22

#define TIPO_DHT DHT22
DHT dht(PINO_DHT, TIPO_DHT);

// Configuração do display OLED

#define LARGURA_TELA 128
#define ALTURA_TELA 64
#define RESET_OLED -1
#define ENDERECO_OLED 0x3C

Adafruit_SSD1306 display(LARGURA_TELA, ALTURA_TELA, &Wire, RESET_OLED);

// Wifi do Wokwi

// Rede virtual usada pelo ESP32 no Wokwi
const char* WIFI_NOME = "Wokwi-GUEST";
const char* WIFI_SENHA = "";

// Configuração do FireBase

const char* URL_FIREBASE =
  "https://coleira-smartpet-default-rtdb.firebaseio.com/coleira/monitoramento.json";

// Localização Simulada

const float LATITUDE_SIMULADA = -23.5874;
const float LONGITUDE_SIMULADA = -46.6576;

// Variáveis do sistema
bool alertaAtivo = false;
bool ultimoEstadoBotao = HIGH;
bool enviarDadosAgora = false;

float temperatura = 0.0;
int bateria = 0;

// Controle do tempo

unsigned long ultimoTempoSensor = 0;
unsigned long ultimoTempoDisplay = 0;
unsigned long ultimoTempoSerial = 0;
unsigned long ultimoTempoFirebase = 0;

const unsigned long INTERVALO_SENSOR = 2000;
const unsigned long INTERVALO_DISPLAY = 300;
const unsigned long INTERVALO_SERIAL = 1000;

// Envia os dados ao Firebase a cada 3 segundos
const unsigned long INTERVALO_FIREBASE = 3000;

// Declaração das funções

void conectarWifi();
void lerSensores();
void verificarBotao();
void atualizarLed();
void mostrarTelaInicial();
void atualizarDisplay();
void exibirDadosNoMonitorSerial();
void enviarDadosFirebase();

// Setup

void setup() {
  Serial.begin(115200);

  // Configuracao dos pinos
  pinMode(PINO_LED, OUTPUT);
  pinMode(PINO_BOTAO, INPUT_PULLUP);

  digitalWrite(PINO_LED, LOW);

  alertaAtivo = false;
  ultimoEstadoBotao = digitalRead(PINO_BOTAO);

  dht.begin();

  Wire.begin(21, 22);

  if (!display.begin(SSD1306_SWITCHCAPVCC, ENDERECO_OLED)) {
    Serial.println("ERRO: display OLED nao encontrado.");

    while (true) {
      digitalWrite(PINO_LED, HIGH);
      delay(300);
      digitalWrite(PINO_LED, LOW);
      delay(300);
    }
  }

  mostrarTelaInicial();
  delay(2000);

  // Faz a primeira leitura antes de enviar ao Firebase
  lerSensores();

  // Conecta o ESP32 na internet
  conectarWifi();

  // Mostra os primeiros dados e envia para o banco
  atualizarDisplay();
  enviarDadosFirebase();

  Serial.println("Smart Pet Collar iniciado.");
}

// Loop principal

void loop() {
  unsigned long tempoAtual = millis();

  verificarBotao();
  atualizarLed();

  if (tempoAtual - ultimoTempoSensor >= INTERVALO_SENSOR) {
    ultimoTempoSensor = tempoAtual;
    lerSensores();
  }

  if (tempoAtual - ultimoTempoDisplay >= INTERVALO_DISPLAY) {
    ultimoTempoDisplay = tempoAtual;
    atualizarDisplay();
  }

  if (tempoAtual - ultimoTempoSerial >= INTERVALO_SERIAL) {
    ultimoTempoSerial = tempoAtual;
    exibirDadosNoMonitorSerial();
  }

  if (enviarDadosAgora ||
      tempoAtual - ultimoTempoFirebase >= INTERVALO_FIREBASE) {

    ultimoTempoFirebase = tempoAtual;
    enviarDadosAgora = false;

    enviarDadosFirebase();
  }
}

// Conexão do wifi

void conectarWifi() {
  if (WiFi.status() == WL_CONNECTED) {
    return;
  }

  Serial.print("Conectando ao Wi-Fi Wokwi-GUEST");

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_NOME, WIFI_SENHA, 6);

  int tentativas = 0;

  while (WiFi.status() != WL_CONNECTED && tentativas < 40) {
    delay(250);
    Serial.print(".");
    tentativas++;
  }

  Serial.println();

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("Wi-Fi conectado com sucesso.");
    Serial.print("Endereco IP do ESP32: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("ERRO: nao foi possivel conectar ao Wi-Fi.");
  }
}

// sensores sendo lidos

void lerSensores() {
  float novaTemperatura = dht.readTemperature();

  if (!isnan(novaTemperatura)) {
    temperatura = novaTemperatura;
  }

  int leituraPotenciometro = analogRead(PINO_BATERIA);

  bateria = map(leituraPotenciometro, 0, 4095, 0, 100);
  bateria = constrain(bateria, 0, 100);
}

// botão do alerta

void verificarBotao() {
  bool estadoBotao = digitalRead(PINO_BOTAO);

  if (ultimoEstadoBotao == HIGH && estadoBotao == LOW) {
    alertaAtivo = !alertaAtivo;

    enviarDadosAgora = true;

    delay(150);
  }

  ultimoEstadoBotao = estadoBotao;
}

// led do alerta

void atualizarLed() {
  if (alertaAtivo) {
    digitalWrite(PINO_LED, HIGH);
  } else {
    digitalWrite(PINO_LED, LOW);
  }
}

void mostrarTelaInicial() {
  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);

  display.setTextSize(1);
  display.setCursor(20, 5);
  display.println("SMART COLLAR");

  display.setTextSize(2);
  display.setCursor(35, 24);
  display.println(NOME_PET);

  display.setTextSize(1);
  display.setCursor(18, 52);
  display.println("Inicializando...");

  display.display();
}

// display principal

void atualizarDisplay() {
  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);

  display.setTextSize(1);

  display.setCursor(0, 0);
  display.print("PET: ");
  display.println(NOME_PET);

  display.setCursor(0, 14);
  display.print("TEMP: ");
  display.print(temperatura, 1);
  display.println(" C");

  display.setCursor(0, 27);
  display.print("BATERIA: ");
  display.print(bateria);
  display.println("%");

  display.setCursor(0, 40);
  display.print("STATUS: ");

  if (alertaAtivo) {
    display.println("PERDIDO!");
    display.setCursor(0, 54);
    display.println("ALERTA ATIVO");
  } else {
    display.println("SEGURO");
    display.setCursor(0, 54);
    display.println("MONITORANDO...");
  }

  display.display();
}


void exibirDadosNoMonitorSerial() {
  Serial.print("PET: ");
  Serial.print(NOME_PET);

  Serial.print(" | TEMPERATURA: ");
  Serial.print(temperatura, 1);
  Serial.print(" C");

  Serial.print(" | BATERIA: ");
  Serial.print(bateria);
  Serial.print("%");

  Serial.print(" | STATUS: ");

  if (alertaAtivo) {
    Serial.println("PET PERDIDO - ALERTA ATIVO");
  } else {
    Serial.println("SEGURO");
  }
}

// Envio para o FireBase

void enviarDadosFirebase() {
  if (WiFi.status() != WL_CONNECTED) {
    conectarWifi();
  }

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Firebase: envio cancelado porque o Wi-Fi esta desconectado.");
    return;
  }

  String statusColeira;

  if (alertaAtivo) {
    statusColeira = "PERDIDO";
  } else {
    statusColeira = "SEGURO";
  }

  // JSON enviado para coleira/monitoramento
  String dadosJson = "{";
  dadosJson += "\"temperatura\":" + String(temperatura, 1) + ",";
  dadosJson += "\"bateria\":" + String(bateria) + ",";
  dadosJson += "\"alerta\":" + String(alertaAtivo ? "true" : "false") + ",";
  dadosJson += "\"status\":\"" + statusColeira + "\",";
  dadosJson += "\"latitude\":" + String(LATITUDE_SIMULADA, 4) + ",";
  dadosJson += "\"longitude\":" + String(LONGITUDE_SIMULADA, 4) + ",";
  dadosJson += "\"localizacaoDescricao\":\"Parque Ibirapuera - Sao Paulo/SP\",";
  dadosJson += "\"tipoLocalizacao\":\"SIMULADA\",";
  dadosJson += "\"origemDados\":\"ESP32 - Wokwi\",";
  dadosJson += "\"ultimaAtualizacao\":{\".sv\":\"timestamp\"}";
  dadosJson += "}";

  WiFiClientSecure clienteSeguro;


  clienteSeguro.setInsecure();

  HTTPClient http;

  if (!http.begin(clienteSeguro, URL_FIREBASE)) {
    Serial.println("Firebase: erro ao iniciar conexao HTTPS.");
    return;
  }

  http.addHeader("Content-Type", "application/json");

  // Patch que atualiza apenas os campos determinados
  int codigoResposta = http.sendRequest("PATCH", dadosJson);

  if (codigoResposta >= 200 && codigoResposta < 300) {
    Serial.print("Firebase atualizado com sucesso. Codigo HTTP: ");
    Serial.println(codigoResposta);
  } else {
    Serial.print("Erro ao enviar dados ao Firebase. Codigo HTTP: ");
    Serial.println(codigoResposta);

    String resposta = http.getString();
    Serial.print("Resposta do Firebase: ");
    Serial.println(resposta);
  }

  http.end();
}