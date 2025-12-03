# ⚡ GymTech OS - Titanium Ecosystem (v9.0)

![Version](https://img.shields.io/badge/version-9.0_Titanium-blueviolet)
![Status](https://img.shields.io/badge/status-production_ready-emerald)
![Stack](https://img.shields.io/badge/react-typescript-blue)
![Style](https://img.shields.io/badge/tailwind-dark_mode-grey)
![Project Status](https://img.shields.io/badge/status-active-emerald)
![Tech Stack](https://img.shields.io/badge/stack-React_TS_Tailwind-blue)
![License](https://img.shields.io/badge/license-MIT-grey)

> **Mais que um app, um sistema operacional para o seu corpo.**
> O GymTech Titanium é uma Progressive Web App (PWA) offline-first projetada para substituir personal trainers, nutricionistas e planilhas de papel.

---

## 📸 Preview das Auras (Temas)
<img width="135" height="859" alt="image" src="https://github.com/user-attachments/assets/ce83b103-3994-45bd-af12-fd452c97f0f8" />
<img width="136" height="861" alt="image" src="https://github.com/user-attachments/assets/695d70f7-82f3-439c-8630-609d19242015" />
<img width="135" height="858" alt="image" src="https://github.com/user-attachments/assets/d8ebc21b-f147-4063-a3d1-aa27df455673" />
<img width="135" height="861" alt="image" src="https://github.com/user-attachments/assets/428c726c-0e74-48ad-bd0f-b366ec18c450" />
<img width="137" height="858" alt="image" src="https://github.com/user-attachments/assets/30ca68b6-7f44-4e4a-aeb1-fe6fa295ae29" />
<img width="137" height="862" alt="image" src="https://github.com/user-attachments/assets/b633bbe5-acf9-4880-8178-3d1fc5618c1f" />



O sistema possui personalização visual completa com 6 "Auras" distintas:
- 🔴 **Sith Red** (Padrão Agressivo)
- 🔵 **Cyber Blue** (Foco Tecnológico)
- 🟢 **Matrix Green** (Hacker/Data)
- 🟣 **Neon Purple** (Synthwave)
- 🟡 **Gold Olympia** (Novo: Premium)
- ⚫ **Stealth Black** (Novo: Minimalista)

---



## 🚀 Sobre o Projeto

O **GymTech** é uma Progressive Web App (PWA) desenvolvida para substituir fichas de papel e apps genéricos. Focado em performance e usabilidade, ele oferece um sistema completo de gestão de treinos com **Gamificação (RPG)** e ferramentas de nível profissional.

Diferente de apps comuns, o GymTech roda 100% no navegador (Client-side) utilizando **LocalStorage**, garantindo privacidade total e funcionamento instantâneo sem necessidade de login ou backend.

---

## 🚀 O Que Há de Novo na v9.0?

A atualização **Titanium Ecosystem** transformou o app em um Hub de Performance completo:

### 🧬 Shape & Bio-Hacking
- **Calculadora de Macros (TDEE):** Calcula automaticamente suas calorias basais, Proteínas, Carbos e Gorduras baseado no seu peso/altura.
- **Rastreador de Medidas:** Registre a evolução de Braço, Peito, Cintura e Pernas (cm).
- **IMC em Tempo Real:** Classificação automática do Índice de Massa Corporal.
- **Hidratação:** Contador de água diário com meta visual.

### 🎮 Gamificação Avançada
- **Consistency Heatmap:** Visualização estilo GitHub dos seus últimos 30 dias de treino.
- **Sistema de Conquistas:** Badges desbloqueáveis (Primeiro Sangue, Heavy Lifter, God Mode, etc).
- **Citações Motivacionais:** Frases estoicas e de bodybuilding na dashboard.

### 🏋️‍♂️ Treinos de Elite
- **Banco de Dados Expandido:** Inclusão de **CrossFit (Murph)**, **Calistenia**, **Yoga** e **Powerlifting (SBD)**.
- **Live Coach (TTS):** O app fala com você ("Série liberada", "Descanso finalizado") usando síntese de voz.
- **Smart Feedback:** Vibração tátil ao finalizar o descanso (em dispositivos móveis).

### 📊 Dados & Privacidade
- **Exportação CSV:** Baixe todos os seus dados para Excel/Sheets com um clique.
- **Backup JSON Completo:** Salve e restaure seu progresso, configurações e histórico em qualquer dispositivo.
- **100% Offline:** Tudo roda no LocalStorage do navegador. Seus dados são seus.

---

## 🔥 Funcionalidades

### Gestão de Treinos
* **Fichas Inteligentes:** Sugestão de carga baseada no treino anterior (Progressive Overload).
* **Cronômetro Híbrido:** Timer de descanso automático ou cronômetro livre (`StopCircle`).
* **Editor "God Mode":** Crie fichas do zero com campos detalhados para carga, repetições, técnica e dicas.

### Gamificação RPG
* **Sistema de Ranks:** Evolua de *Iniciante* a *Mr. Olympia* baseado na sua constância.
* **Streak Counter:** Contador de ofensiva (dias seguidos) para manter a disciplina.
* **Histórico de Batalha:** Log completo de todos os treinos realizados.

### Ferramentas Pro
* **Plate Calculator (Calculadora de Anilhas):** Visualizador gráfico de quais anilhas colocar na barra.
* **1RM Estimada:** Algoritmo de Epley para calcular sua força máxima teórica. Ou seja uma calculadora de força máxima baseada na fórmula de Epley.
* **Diário de Cargas:** O app lembra quanto peso você pegou na última vez.
* **Shape Tracker:** Gráfico de evolução de peso corporal.

---

## 🛠️ Tecnologias Utilizadas

Este projeto utiliza o estado da arte do desenvolvimento Frontend moderno:

- **React 18** (Hooks, Custom Hooks, Context)
- **TypeScript** (Tipagem estrita para robustez)
- **Vite** (Build tool ultra-rápida)
- **Tailwind CSS** (Estilização utility-first)
- **Lucide React** (Ícones vetoriais leves)
- **Web APIs** (SpeechSynthesis, Vibration API, LocalStorage, FileReader)

---

## 💻 Como Rodar Localmente

Siga os passos abaixo para rodar o monstro na sua máquina:

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/SEU-USUARIO/gymtech.git
   ```
2. **Entre na pasta:**
   ```bash
   cd GymTech
   ```
3. **Instale as dependências:**
   ```bash
   npm install
   ```
4. **Rode o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
5. **Acesse: Abra `http://localhost:5173` no seu navegador.**

---

## 📱 Instalação Mobile (PWA)

O GymTech foi desenhado para ser instalado no celular sem precisar das lojas de app:

1. Acesse o link do projeto no seu navegador mobile (Chrome/Safari).
2. Abra o menu do navegador.
3. Selecione **"Adicionar à Tela Inicial"** ou **"Instalar App"**.
4. O app rodará em tela cheia, sem barra de endereços, como um aplicativo nativo.
5. 
---
## 🤝 Contribuição

Pull requests são bem-vindos. Para mudanças grandes, abra uma issue primeiro para discutir o que você gostaria de mudar.

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/RecursoIncrivel`)
3. Faça o Commit (`git commit -m 'Add some RecursoIncrivel'`)
4. Push para a Branch (`git push origin feature/RecursoIncrivel`)
5. Abra um Pull Request

---
## 📝 Licença
Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

---

<div align="center">
  <strong>GymTech OS</strong> • Desenvolvido para Monstros 💀
</div>
