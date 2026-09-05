# 🧾 Desafio Frontend — Formulário Dinâmico (GetNinjas)

**Desafio técnico de auto-estudo — sem prazo, sem entrega, feito para aprender fundamentos de HTML/CSS/JS puro e Node.js sem framework.**

Servidor Node.js puro servindo um formulário de pedidos cujos campos são inteiramente gerados a partir de um JSON (`fields.json`), sem nenhuma linha de HTML escrita à mão para os campos.

![Status](https://img.shields.io/badge/status-em%20pausa%20%2F%20aprendizado-yellow?style=flat)
![Node](https://img.shields.io/badge/Node.js-puro-339933?style=flat&logo=node.js&logoColor=white)
![JS](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=flat&logo=javascript&logoColor=black)

---

## 📌 Sobre

Referência visual do formulário: [GetNinjas — Cabeleireiros](https://www.getninjas.com.br/moda-e-beleza/cabeleireiros).

A ideia central do desafio **não é** montar 9 campos manualmente — é fazer o sistema **interpretar uma estrutura de dados** e gerar o formulário sozinho:

```
fields.json → servidor entrega como API → JS interpreta → formulário aparece
```

Se um décimo campo for adicionado ao JSON amanhã, a aplicação deveria lidar com ele sem precisar de reconstrução manual.

---

## 📋 Requisitos do desafio

#### Permitido
- ES6
- Linters (JS e CSS)
- Task runners / build tools (Webpack, Gulp, Grunt)
- Sass/SCSS, se justificável
- Ferramentas de teste (jest, jasmine, mocha, chai, sinon, supertest)

#### Não permitido
- Frameworks JS (React, Vue, Angular, Ember...)
- Bibliotecas de utilidades (Lodash, Underscore...)
- Frameworks/bibliotecas CSS (Bootstrap, Foundation...)

#### Especificações funcionais
- Servidor **Node.js** servindo `fields.json` (raiz do projeto) como API — Express é opcional, não usado aqui.
- Campos `enumerable` devem virar `<select>`.
- Campos com `required: true` devem exibir **"este campo é requerido"** quando vazios.
- O formulário **não precisa** fazer `POST`.
- Pelo menos um teste (unitário ou de integração) é essencial.

---

## ✅ Status atual — requisito x implementado

| Requisito do desafio | Status |
|---|---|
| Servidor Node.js servindo `fields.json` como API | ✅ Feito (`http` nativo, sem Express) |
| Servir o HTML/CSS/JS pelo próprio Node | ✅ Feito (roteamento manual por `req.url`) |
| Gerar os campos dinamicamente a partir do JSON | ✅ Feito (loop sobre `request_fields` + `user_fields`) |
| `enumerable` → `<select>` | ✅ Feito |
| Mensagem "este campo é requerido" | 🟡 Parcial — o elemento existe no HTML, mas ainda **sempre visível** (falta a lógica condicional no submit) |
| Fluxo passo-a-passo (wizard), como no site de referência | ❌ Não iniciado — decisão consciente de adiar |
| Estilização (CSS) | ❌ Não iniciado |
| Testes (unitário ou integração) | ❌ Não iniciado |
| Nomenclatura em inglês no código | 🟡 Em refatoração |

> Este projeto está **pausado de propósito**: a decisão foi voltar para projetos vanilla mais simples antes de avançar para o fluxo em wizard e o conceito de estado (state), que é onde o aprendizado travou.

---

## 🏗️ Arquitetura

![Arquitetura](./docs/assets/architecture.svg)

- **Servidor** (`api/server.js`): módulo `http` nativo. Sem Express. Lê os arquivos do disco (`fs`) e decide o que responder comparando `req.url` manualmente (sem roteador automático).
- **Frontend** (`web/`): HTML com um container vazio (`<div id="form">` ou `<form id="form">`), populado inteiramente via JavaScript depois do `DOMContentLoaded`.
- **Dados**: `fields.json` na raiz — única fonte da verdade sobre quais campos existem.

---

## 🔄 Fluxo de renderização

![Fluxo](./docs/assets/flow.svg)

1. Página carrega → evento `DOMContentLoaded` dispara.
2. `fetch('/api/fields')` é chamado.
3. Servidor lê `fields.json` do disco e responde com `Content-Type: application/json`.
4. JS percorre `request_fields` + `user_fields` (dois grupos, unidos com spread).
5. Para cada campo, gera o HTML certo por `type` (`select` para `enumerable`, `textarea` para `big_text`, `input` para os demais).
6. Todo o HTML é escrito **de uma vez só** em `form.innerHTML` (evita reprocessar o DOM a cada campo).

---

## 📁 Estrutura

```
frontend-challenge/
├── api/
│   └── server.js        # servidor HTTP puro (sem Express)
├── web/
│   ├── index.html        # container vazio para o formulário
│   ├── script.js         # fetch + geração dinâmica dos campos
│   └── style.css         # ainda não trabalhado
├── docs/
│   └── assets/
│       ├── architecture.svg
│       └── flow.svg
├── fields.json            # fonte da verdade dos campos
└── README.md
```

---

## ▶️ Como executar

```bash
git clone <url-do-repo>
cd frontend-challenge
node api/server.js
```

Acesse `http://localhost:3000`.

---

## 🧠 Decisões e conceitos praticados

- **`http` nativo em vez de Express**: propositalmente, para entender o que o Express abstrai (roteamento, parsing) antes de usar a abstração.
- **Leitura de arquivos em variáveis, fora do handler**: evita reler do disco a cada requisição.
- **Roteamento manual por `req.url`**: cada tipo de arquivo (`html`, `css`, `js`, `json`) tem seu próprio `Content-Type` correto.
- **Renderização orientada por dados**: nenhum `<input>`/`<select>` dos 9 campos é escrito à mão — todos vêm do loop sobre o JSON.
- **Acúmulo de string antes de tocar o DOM**: uma única atribuição a `innerHTML`, em vez de `+=` dentro do loop (evita reparse repetido do HTML).

---

## ⚠️ Limitações conhecidas

- Validação de campo obrigatório ainda não reage ao submit (mensagem de erro sempre visível).
- Sem estilização.
- Sem testes automatizados.
- Fluxo é uma página única com todos os campos, não o wizard passo-a-passo do site de referência.
- Máscaras de CEP/telefone não implementadas.

## 🚀 Próximos passos

- Implementar validação real (mostrar erro só quando o campo obrigatório estiver vazio no submit).
- Estilizar com CSS puro (ou Sass justificável).
- Escrever ao menos um teste (jest ou mocha) para a lógica de geração de campos.
- Avaliar o wizard passo-a-passo, revisitando o conceito de estado.

---

## 👨‍💻 Autor

**Luis Botelho**
