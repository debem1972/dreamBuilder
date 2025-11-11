# 🎰 DreamBuild - Calculadora de Horas de Trabalho

<div align="center">

![DreamBuild](image/capaJobCalc3-Photoroom.png-Photoroom.png)

**Uma experiência única de registro de horas com interface vintage de máquina registradora**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

[Demo ao Vivo](#) • [Reportar Bug](https://github.com/debem1972/dreamBuilder/issues) • [Solicitar Feature](https://github.com/debem1972/dreamBuilder/issues)

</div>

---

## 📋 Sobre o Projeto

**DreamBuild** é uma aplicação web moderna com design vintage que transforma o registro de horas de trabalho em uma experiência interativa e divertida. Inspirada em máquinas registradoras antigas, combina nostalgia visual com tecnologia moderna.

### ✨ Destaques

- 🎨 **Interface Vintage**: Design inspirado em máquinas registradoras clássicas
- 🔊 **Efeitos Sonoros**: Feedback sonoro imersivo em cada interação
- 💾 **Persistência Local**: Dados armazenados com IndexedDB
- 📱 **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- 📄 **Exportação PDF**: Gere relatórios profissionais instantaneamente
- 💾 **Import/Export JSON**: Backup e restauração de dados
- ✏️ **Edição em Tempo Real**: Modifique registros diretamente na tabela
- 🔍 **Busca Avançada**: Filtre registros com múltiplos critérios

---

## 🚀 Funcionalidades

### 🎯 Principais Recursos

| Recurso | Descrição |
|---------|-----------|
| **Registro de Horas** | Adicione data, tipo de serviço, hora de início e fim |
| **Cálculo Automático** | Subtotais e total geral calculados automaticamente |
| **Letreiro Neon** | Efeito visual de neon com animação ao ligar |
| **Áudio Interativo** | Sons de teclado, registro e alertas |
| **Edição de Dados** | Edite qualquer campo diretamente na tabela |
| **Exclusão Múltipla** | Selecione e delete várias linhas de uma vez |
| **Filtro Inteligente** | Busque por data, serviço ou qualquer informação |
| **Relatório PDF** | Exporte relatórios formatados com nome e período |
| **Backup JSON** | Exporte e importe seus dados com segurança |
| **Ajuda com Áudio** | Instruções narradas com controles de reprodução |

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5** - Estrutura semântica
- **CSS3** - Estilização avançada com animações
- **JavaScript (ES6+)** - Lógica e interatividade

### Bibliotecas
- **[SweetAlert2](https://sweetalert2.github.io/)** - Modais elegantes
- **[html2pdf.js](https://github.com/eKoopmans/html2pdf.js)** - Geração de PDF
- **[Animate.css](https://animate.style/)** - Animações CSS
- **[Font Awesome](https://fontawesome.com/)** - Ícones vetoriais

### Armazenamento
- **IndexedDB** - Banco de dados local do navegador

---

## 📦 Instalação

### Pré-requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional, mas recomendado)

### Passos

1. **Clone o repositório**
```bash
git clone https://github.com/debem1972/dreamBuilder.git
```

2. **Navegue até o diretório**
```bash
cd dreamBuilder
```

3. **Abra o projeto**
   - **Opção 1**: Abra `index.html` diretamente no navegador
   - **Opção 2**: Use um servidor local
   ```bash
   # Com Python 3
   python -m http.server 8000
   
   # Com Node.js (npx)
   npx serve
   
   # Com PHP
   php -S localhost:8000
   ```

4. **Acesse no navegador**
```
http://localhost:8000
```

---

## 🎮 Como Usar

### 1️⃣ Ligar a Máquina
- Clique no botão **Power** (ícone de energia)
- Aguarde o letreiro neon acender com efeito sonoro

### 2️⃣ Iniciar Novo Trabalho
- Clique no botão **New Job**
- O formulário de registro será exibido

### 3️⃣ Registrar Horas
1. Digite a data no formato `dd/mm/aaaa`
2. Selecione o tipo de serviço (Garçom, Massa ou Garçom + Massa)
3. Informe a hora de início
4. Informe a hora de fim
5. Clique em **Lançar**

### 4️⃣ Gerenciar Registros
- **Editar**: Clique no ícone ✏️, edite os campos, clique em ✅
- **Deletar**: Marque as linhas desejadas e clique em 🗑️
- **Filtrar**: Digite no campo de busca para filtrar registros

### 5️⃣ Exportar Dados
- **PDF**: Clique em 📊, informe nome/mês/ano, gere o relatório
- **JSON**: Clique em 📤, informe mês/ano, baixe o arquivo

### 6️⃣ Importar Dados
- Clique em 📥
- Selecione um arquivo JSON previamente exportado
- Confirme a importação

---

## 🎨 Estrutura do Projeto

```
dreamBuilder/
├── index.html              # Página principal
├── assets/
│   ├── css/
│   │   └── style.css       # Estilos da aplicação
│   └── js/
│       └── script.js       # Lógica JavaScript
├── audio/                  # Efeitos sonoros
│   ├── alertaModal.mp3
│   ├── chachRegister.mp3
│   ├── compSingleKeyb.mp3
│   ├── electricCurto.mp3
│   └── helpJobCalcRachel.mp3
├── image/                  # Imagens
│   └── capaJobCalc3-Photoroom.png-Photoroom.png
├── README.md
└── LICENSE
```

---

## 🎵 Efeitos Sonoros

| Ação | Som | Descrição |
|------|-----|-----------|
| Ligar Power | `compSingleKeyb.mp3` | Som de tecla de computador |
| Acender Neon | `electricCurto.mp3` | Som elétrico (500ms delay) |
| New Job | `compSingleKeyb.mp3` | Som de tecla |
| Lançar Dados | `chachRegister.mp3` | Som de registradora |
| Alerta | `alertaModal.mp3` | Som de alerta |
| Ajuda | `helpJobCalcRachel.mp3` | Narração de instruções |

---

## 🌐 Compatibilidade

| Navegador | Versão Mínima | Status |
|-----------|---------------|--------|
| Chrome | 80+ | ✅ Suportado |
| Firefox | 75+ | ✅ Suportado |
| Safari | 13+ | ✅ Suportado |
| Edge | 80+ | ✅ Suportado |
| Opera | 67+ | ✅ Suportado |

---

## 📱 Responsividade

O DreamBuild é totalmente responsivo e se adapta a diferentes tamanhos de tela:

- 📱 **Mobile**: 320px - 480px
- 📱 **Tablet**: 481px - 768px
- 💻 **Desktop**: 769px - 1024px
- 🖥️ **Large Desktop**: 1025px+

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga os passos:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📝 Roadmap

- [ ] Adicionar temas de cores personalizáveis
- [ ] Implementar gráficos de estatísticas
- [ ] Adicionar suporte a múltiplos usuários
- [ ] Criar versão PWA (Progressive Web App)
- [ ] Adicionar sincronização em nuvem
- [ ] Implementar modo escuro
- [ ] Adicionar mais tipos de serviços customizáveis

---

## 🐛 Problemas Conhecidos

Nenhum problema conhecido no momento. Se encontrar algum bug, por favor [reporte aqui](https://github.com/debem1972/dreamBuilder/issues).

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**Daniel Lopes Bemfica**

- GitHub: [@debem1972](https://github.com/debem1972)
- LinkedIn: [Daniel Lopes Bemfica](https://www.linkedin.com/in/seu-perfil)

---

## 🙏 Agradecimentos

- Inspiração no design de máquinas registradoras vintage
- Comunidade open source pelas bibliotecas utilizadas
- Todos que contribuíram com feedback e sugestões

---

## 📸 Screenshots

### Tela Inicial
![Tela Inicial](docs/screenshots/home.png)

### Formulário de Registro
![Formulário](docs/screenshots/form.png)

### Tabela de Registros
![Tabela](docs/screenshots/table.png)

### Relatório PDF
![Relatório](docs/screenshots/report.png)

---

<div align="center">

**⭐ Se este projeto foi útil para você, considere dar uma estrela!**

Feito com ❤️ e ☕ por [Daniel Lopes Bemfica](https://github.com/debem1972)

</div>
