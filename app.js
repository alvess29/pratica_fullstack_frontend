const API_URL = "https://pratica-fullstack-backend-cfcs.onrender.com";

const formulario = document.querySelector("#form-produto");
const campoId = document.querySelector("#produto-id");
const campoNome = document.querySelector("#nome");
const campoPreco = document.querySelector("#preco");
const campoEstoque = document.querySelector("#estoque");
const tituloFormulario = document.querySelector("#titulo-formulario");
const botaoSalvar = document.querySelector("#botao-salvar");
const botaoCancelar = document.querySelector("#botao-cancelar");
const listaProdutos = document.querySelector("#lista-produtos");
const mensagem = document.querySelector("#mensagem");
const formularioBusca = document.querySelector("#form-busca");
const campoBuscaId = document.querySelector("#busca-id");

async function fazerRequisicao(url, opcoes = {}) {
  const resposta = await fetch(url, opcoes);

  if (!resposta.ok) {
    const erro = await resposta.json().catch(() => ({}));
    throw new Error(erro.mensagem || "Não foi possível concluir a operação");
  }

  if (resposta.status === 204) {
    return null;
  }

  return resposta.json();
}

function mostrarMensagem(texto, erro = false) {
  mensagem.textContent = texto;
  mensagem.classList.toggle("erro", erro);
}

function formatarPreco(preco) {
  return preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function criarCartaoProduto(produto) {
  const cartao = document.createElement("article");
  cartao.className = "produto";

  const nome = document.createElement("h3");
  nome.textContent = produto.nome;

  const preco = document.createElement("p");
  preco.textContent = `Preço: ${formatarPreco(produto.preco)}`;

  const estoque = document.createElement("p");
  estoque.textContent = `Estoque: ${produto.estoque ?? 0}`;

  const id = document.createElement("p");
  id.textContent = `ID: ${produto._id}`;

  const acoes = document.createElement("div");
  acoes.className = "acoes-produto";

  const botaoEditar = document.createElement("button");
  botaoEditar.type = "button";
  botaoEditar.textContent = "Editar";
  botaoEditar.addEventListener("click", () => carregarProdutoParaEdicao(produto._id));

  const botaoExcluir = document.createElement("button");
  botaoExcluir.type = "button";
  botaoExcluir.className = "perigo";
  botaoExcluir.textContent = "Excluir";
  botaoExcluir.addEventListener("click", () => excluirProduto(produto._id));

  acoes.append(botaoEditar, botaoExcluir);
  cartao.append(nome, preco, estoque, id, acoes);

  return cartao;
}

function exibirProdutos(produtos) {
  listaProdutos.innerHTML = "";

  if (produtos.length === 0) {
    mostrarMensagem("Nenhum produto cadastrado");
    return;
  }

  produtos.forEach((produto) => {
    listaProdutos.appendChild(criarCartaoProduto(produto));
  });

  mostrarMensagem(`${produtos.length} produto(s) encontrado(s)`);
}

async function listarProdutos() {
  try {
    mostrarMensagem("Carregando produtos...");
    const produtos = await fazerRequisicao(API_URL);
    exibirProdutos(produtos);
  } catch (erro) {
    listaProdutos.innerHTML = "";
    mostrarMensagem(erro.message, true);
  }
}

async function buscarProdutoPorId(id) {
  const produto = await fazerRequisicao(`${API_URL}/${id}`);
  exibirProdutos([produto]);
  return produto;
}

async function salvarProduto(evento) {
  evento.preventDefault();

  const produto = {
    nome: campoNome.value.trim(),
    preco: Number(campoPreco.value)
  };

  if (campoEstoque.value !== "") {
    produto.estoque = Number(campoEstoque.value);
  }

  const id = campoId.value;
  const estaEditando = Boolean(id);
  const url = estaEditando ? `${API_URL}/${id}` : API_URL;
  const metodo = estaEditando ? "PUT" : "POST";

  try {
    await fazerRequisicao(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(produto)
    });

    limparFormulario();
    mostrarMensagem(estaEditando ? "Produto atualizado" : "Produto cadastrado");
    await listarProdutos();
  } catch (erro) {
    mostrarMensagem(erro.message, true);
  }
}

async function carregarProdutoParaEdicao(id) {
  try {
    const produto = await fazerRequisicao(`${API_URL}/${id}`);

    campoId.value = produto._id;
    campoNome.value = produto.nome;
    campoPreco.value = produto.preco;
    campoEstoque.value = produto.estoque ?? "";
    tituloFormulario.textContent = "Editar produto";
    botaoSalvar.textContent = "Salvar alterações";
    botaoCancelar.classList.remove("oculto");
    campoNome.focus();
  } catch (erro) {
    mostrarMensagem(erro.message, true);
  }
}

async function excluirProduto(id) {
  const confirmou = window.confirm("Deseja excluir este produto?");

  if (!confirmou) {
    return;
  }

  try {
    await fazerRequisicao(`${API_URL}/${id}`, { method: "DELETE" });
    limparFormulario();
    mostrarMensagem("Produto excluído");
    await listarProdutos();
  } catch (erro) {
    mostrarMensagem(erro.message, true);
  }
}

function limparFormulario() {
  formulario.reset();
  campoId.value = "";
  tituloFormulario.textContent = "Novo produto";
  botaoSalvar.textContent = "Cadastrar";
  botaoCancelar.classList.add("oculto");
}

formulario.addEventListener("submit", salvarProduto);
botaoCancelar.addEventListener("click", limparFormulario);
document.querySelector("#botao-atualizar").addEventListener("click", listarProdutos);
document.querySelector("#botao-limpar-busca").addEventListener("click", () => {
  campoBuscaId.value = "";
  listarProdutos();
});

formularioBusca.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const id = campoBuscaId.value.trim();

  if (!id) {
    mostrarMensagem("Informe um ID para realizar a busca", true);
    return;
  }

  try {
    await buscarProdutoPorId(id);
  } catch (erro) {
    listaProdutos.innerHTML = "";
    mostrarMensagem(erro.message, true);
  }
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}

listarProdutos();
