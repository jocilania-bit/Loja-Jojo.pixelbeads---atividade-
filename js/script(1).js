// Interações do site Jojo.pixelbeads
document.addEventListener('DOMContentLoaded', () => {
  const botaoCarrinho = document.getElementById('adicionarCarrinho');
  if (botaoCarrinho) {
    botaoCarrinho.addEventListener('click', () => {
      document.getElementById('mensagemCarrinho').textContent =
        'Produto adicionado ao carrinho! 💗 (demonstração)';
    });
  }

  const form = document.getElementById('formProduto');
  if (!form) return;

  const chave = 'jojoPixelbeadsProdutos';
  const produtosIniciais = [
    { nome: 'Nossa Senhora Aparecida', categoria: 'Clássicos', preco: 15, estoque: 3, descricao: 'Chaveiro artesanal' },
    { nome: 'Pokémon Chikorita', categoria: 'Clássicos', preco: 12, estoque: 4, descricao: '' },
    { nome: 'Pokémon Snorunt', categoria: 'Clássicos', preco: 12, estoque: 4, descricao: '' },
    { nome: 'Chaveiro Yoshi', categoria: 'Clássicos', preco: 12, estoque: 2, descricao: '' },
    { nome: 'Chaveiro My Melody', categoria: 'Clássicos', preco: 12, estoque: 2, descricao: '' }
  ];
  let produtos = JSON.parse(localStorage.getItem(chave) || 'null') || produtosIniciais;
  const lista = document.getElementById('listaProdutos');
  const campoBusca = document.getElementById('busca');

  function salvar() {
    localStorage.setItem(chave, JSON.stringify(produtos));
    renderizar();
  }
  function renderizar() {
    const termo = (campoBusca.value || '').toLowerCase();
    lista.innerHTML = '';
    produtos.forEach((produto, indice) => {
      if (!produto.nome.toLowerCase().includes(termo)) return;
      const linha = document.createElement('tr');
      linha.innerHTML = `
        <td>${escapar(produto.nome)}</td>
        <td>${escapar(produto.categoria)}</td>
        <td>R$ ${Number(produto.preco).toFixed(2).replace('.', ',')}</td>
        <td>${Number(produto.estoque)}</td>
        <td>
          <button class="acao" data-editar="${indice}">Editar</button>
          <button class="acao excluir" data-excluir="${indice}">Excluir</button>
        </td>`;
      lista.appendChild(linha);
    });
  }
  function escapar(valor) {
    return String(valor).replace(/[&<>"']/g, caractere => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[caractere]);
  }

  form.addEventListener('submit', evento => {
    evento.preventDefault();
    const indice = document.getElementById('indiceEdicao').value;
    const produto = {
      nome: document.getElementById('nome').value.trim(),
      categoria: document.getElementById('categoria').value.trim(),
      preco: Number(document.getElementById('preco').value),
      descricao: document.getElementById('descricao').value.trim(),
      estoque: Number(document.getElementById('estoque').value)
    };
    if (indice === '') produtos.push(produto);
    else produtos[Number(indice)] = produto;
    salvar();
    form.reset();
    document.getElementById('indiceEdicao').value = '';
    document.getElementById('btnSalvar').textContent = 'Cadastrar produto';
  });

  lista.addEventListener('click', evento => {
    const editar = evento.target.dataset.editar;
    const excluir = evento.target.dataset.excluir;
    if (editar !== undefined) {
      const p = produtos[Number(editar)];
      document.getElementById('indiceEdicao').value = editar;
      document.getElementById('nome').value = p.nome;
      document.getElementById('categoria').value = p.categoria;
      document.getElementById('preco').value = p.preco;
      document.getElementById('descricao').value = p.descricao || '';
      document.getElementById('estoque').value = p.estoque;
      document.getElementById('btnSalvar').textContent = 'Salvar alterações';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (excluir !== undefined) {
      const p = produtos[Number(excluir)];
      if (confirm(`Deseja excluir "${p.nome}"?`)) {
        produtos.splice(Number(excluir), 1);
        salvar();
      }
    }
  });
  campoBusca.addEventListener('input', renderizar);
  renderizar();
});
