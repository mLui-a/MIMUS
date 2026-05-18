// PataFeliz - JS de interface

// Lista de produtos
const PRODUTOS = [
  {id:1,nome:"Ração Premium Adulto 15kg",categoria:"Alimentação",pet:"Cachorro",preco:189.90,emoji:"🥩",avaliacao:4.8},
  {id:2,nome:"Bola com Corda Colorida",categoria:"Brinquedos",pet:"Cachorro",preco:39.90,emoji:"🎾",avaliacao:4.6},
  {id:3,nome:"Coleira de Couro Marrom",categoria:"Acessórios",pet:"Cachorro",preco:79.90,emoji:"🦮",avaliacao:4.9},
  {id:4,nome:"Caminha Soft Bege",categoria:"Conforto",pet:"Todos",preco:159.90,emoji:"🛏️",avaliacao:4.7},
  {id:5,nome:"Shampoo Natural 500ml",categoria:"Higiene",pet:"Todos",preco:34.90,emoji:"🧴",avaliacao:4.5},
  {id:6,nome:"Arranhador de Sisal",categoria:"Acessórios",pet:"Gato",preco:99.90,emoji:"🐱",avaliacao:4.8},
  {id:7,nome:"Comedouro Inox",categoria:"Acessórios",pet:"Todos",preco:49.90,emoji:"🥣",avaliacao:4.9},
  {id:8,nome:"Ração Filhote Salmão 10kg",categoria:"Alimentação",pet:"Gato",preco:219.90,emoji:"🐟",avaliacao:4.7},
  {id:9,nome:"Petisco Natural 200g",categoria:"Alimentação",pet:"Cachorro",preco:24.90,emoji:"🦴",avaliacao:4.6},
  {id:10,nome:"Mordedor de Borracha",categoria:"Brinquedos",pet:"Cachorro",preco:29.90,emoji:"🧸",avaliacao:4.4},
  {id:11,nome:"Escova de Pelos",categoria:"Higiene",pet:"Todos",preco:39.90,emoji:"🪮",avaliacao:4.7},
  {id:12,nome:"Casinha de Madeira",categoria:"Conforto",pet:"Cachorro",preco:299.90,emoji:"🏠",avaliacao:4.8},
];

const CATEGORIAS = ["Todos","Alimentação","Brinquedos","Acessórios","Higiene","Conforto"];

// Carrinho persistido no localStorage
function obterCarrinho(){
  try{return JSON.parse(localStorage.getItem('carrinho')||'[]')}catch{return []}
}
function salvarCarrinho(c){
  localStorage.setItem('carrinho',JSON.stringify(c));
  atualizarBadge();
}
function adicionarAoCarrinho(id){
  const c = obterCarrinho();
  const item = c.find(i=>i.id===id);
  if(item) item.qtd++;
  else{
    const p = PRODUTOS.find(p=>p.id===id);
    c.push({id:p.id,nome:p.nome,preco:p.preco,emoji:p.emoji,qtd:1});
  }
  salvarCarrinho(c);
  mostrarNotificacao('Produto adicionado ao carrinho!');
}
function removerDoCarrinho(id){
  salvarCarrinho(obterCarrinho().filter(i=>i.id!==id));
  if(typeof renderizarCarrinho==='function') renderizarCarrinho();
}
function alterarQtd(id,delta){
  const c = obterCarrinho();
  const item = c.find(i=>i.id===id);
  if(!item) return;
  item.qtd += delta;
  if(item.qtd<=0){removerDoCarrinho(id);return}
  salvarCarrinho(c);
  if(typeof renderizarCarrinho==='function') renderizarCarrinho();
}
function atualizarBadge(){
  const total = obterCarrinho().reduce((s,i)=>s+i.qtd,0);
  document.querySelectorAll('.badge').forEach(b=>{
    b.textContent = total;
    b.style.display = total>0?'flex':'none';
  });
}

// Notificação
function mostrarNotificacao(msg){
  let n = document.getElementById('notificacao');
  if(!n){
    n = document.createElement('div');
    n.id = 'notificacao';
    n.style.cssText = 'position:fixed;bottom:30px;right:30px;background:#3a9a5c;color:#fff;padding:14px 22px;border-radius:30px;box-shadow:0 6px 20px rgba(0,0,0,.15);z-index:100;font-weight:500;transition:transform .3s,opacity .3s;';
    document.body.appendChild(n);
  }
  n.textContent = msg;
  n.style.transform = 'translateY(0)';
  n.style.opacity = '1';
  clearTimeout(n._t);
  n._t = setTimeout(()=>{n.style.transform='translateY(20px)';n.style.opacity='0'},2200);
}

// Renderizar card de produto
function cardProduto(p){
  return `
    <article class="produto">
      <div class="produto-imagem">
        <span class="produto-categoria">${p.categoria}</span>
        ${p.emoji}
      </div>
      <div class="produto-info">
        <div class="produto-avaliacao"><span class="estrela">★</span> ${p.avaliacao} · ${p.pet}</div>
        <div class="produto-nome">${p.nome}</div>
        <div class="produto-rodape">
          <span class="produto-preco">R$ ${p.preco.toFixed(2).replace('.',',')}</span>
          <button class="btn-adicionar" onclick="adicionarAoCarrinho(${p.id})" aria-label="Adicionar">+</button>
        </div>
      </div>
    </article>`;
}

// Página inicial - destaques
function renderizarDestaques(){
  const el = document.getElementById('destaques');
  if(!el) return;
  el.innerHTML = PRODUTOS.slice(0,4).map(cardProduto).join('');
}

// Catálogo
let filtroAtual = "Todos";
let buscaAtual = "";
function renderizarCatalogo(){
  const el = document.getElementById('catalogo');
  if(!el) return;
  const lista = PRODUTOS.filter(p=>{
    const okCat = filtroAtual==="Todos"||p.categoria===filtroAtual;
    const okBusca = !buscaAtual||p.nome.toLowerCase().includes(buscaAtual.toLowerCase());
    return okCat && okBusca;
  });
  el.innerHTML = lista.length
    ? lista.map(cardProduto).join('')
    : '<p style="grid-column:1/-1;text-align:center;color:#888;padding:40px;">Nenhum produto encontrado.</p>';
}
function renderizarFiltros(){
  const el = document.getElementById('filtros');
  if(!el) return;
  el.innerHTML = CATEGORIAS.map(c=>
    `<button class="filtro ${c===filtroAtual?'ativo':''}" onclick="trocarFiltro('${c}')">${c}</button>`
  ).join('');
}
function trocarFiltro(c){filtroAtual=c;renderizarFiltros();renderizarCatalogo()}
function trocarBusca(v){buscaAtual=v;renderizarCatalogo()}

// Carrinho
function renderizarCarrinho(){
  const el = document.getElementById('lista-carrinho');
  const resumo = document.getElementById('resumo-carrinho');
  if(!el) return;
  const c = obterCarrinho();
  if(c.length===0){
    el.innerHTML = `
      <div class="carrinho-vazio">
        <div class="emoji">🛒</div>
        <h3>Seu carrinho está vazio</h3>
        <p style="color:#888;margin:10px 0 20px;">Que tal dar uma olhada nos nossos produtos?</p>
        <a href="produtos.html" class="btn btn-primario">Ver produtos</a>
      </div>`;
    if(resumo) resumo.style.display = 'none';
    return;
  }
  if(resumo) resumo.style.display = 'block';
  el.innerHTML = c.map(i=>`
    <div class="item-carrinho">
      <div class="item-imagem">${i.emoji}</div>
      <div class="item-detalhes">
        <div class="item-nome">${i.nome}</div>
        <div class="item-preco">R$ ${i.preco.toFixed(2).replace('.',',')}</div>
      </div>
      <div class="item-controles">
        <button class="qtd-btn" onclick="alterarQtd(${i.id},-1)">−</button>
        <span class="qtd">${i.qtd}</span>
        <button class="qtd-btn" onclick="alterarQtd(${i.id},1)">+</button>
      </div>
      <button class="item-remover" onclick="removerDoCarrinho(${i.id})" aria-label="Remover">✕</button>
    </div>
  `).join('');
  const sub = c.reduce((s,i)=>s+i.preco*i.qtd,0);
  const frete = sub>=150?0:19.90;
  const total = sub+frete;
  if(resumo){
    resumo.innerHTML = `
      <h3>Resumo do pedido</h3>
      <div class="resumo-linha"><span>Subtotal</span><span>R$ ${sub.toFixed(2).replace('.',',')}</span></div>
      <div class="resumo-linha"><span>Frete</span><span>${frete===0?'Grátis':'R$ '+frete.toFixed(2).replace('.',',')}</span></div>
      <div class="resumo-linha resumo-total"><span>Total</span><span>R$ ${total.toFixed(2).replace('.',',')}</span></div>
      <button class="btn btn-secundario" style="width:100%;margin-top:16px;" onclick="finalizar()">Finalizar compra</button>
    `;
  }
}
function finalizar(){
  mostrarNotificacao('Pedido finalizado! 🎉');
  setTimeout(()=>{localStorage.removeItem('carrinho');renderizarCarrinho();atualizarBadge()},800);
}

// Login - alternar entre entrar/cadastrar
function alternarLogin(){
  const modo = document.getElementById('formulario').dataset.modo;
  const novo = modo==='entrar'?'cadastrar':'entrar';
  document.getElementById('formulario').dataset.modo = novo;
  document.getElementById('titulo-form').textContent = novo==='entrar'?'Bem-vindo de volta':'Crie sua conta';
  document.getElementById('sub-form').textContent = novo==='entrar'?'Entre para continuar suas compras':'Cadastre-se em poucos segundos';
  document.getElementById('campo-nome').style.display = novo==='cadastrar'?'block':'none';
  document.getElementById('btn-enviar').textContent = novo==='entrar'?'Entrar':'Cadastrar';
  document.getElementById('texto-alternar').innerHTML = novo==='entrar'
    ? 'Não tem conta? <a onclick="alternarLogin()">Cadastre-se</a>'
    : 'Já tem conta? <a onclick="alternarLogin()">Entrar</a>';
}
function enviarLogin(e){
  e.preventDefault();
  mostrarNotificacao('Login realizado com sucesso!');
  setTimeout(()=>window.location.href='index.html',900);
  return false;
}

// Busca no hero -> redireciona
function buscarDoHero(e){
  e.preventDefault();
  const q = document.getElementById('busca-hero').value.trim();
  window.location.href = 'produtos.html'+(q?'?q='+encodeURIComponent(q):'');
  return false;
}

// Inicialização
document.addEventListener('DOMContentLoaded',()=>{
  atualizarBadge();
  renderizarDestaques();
  if(document.getElementById('catalogo')){
    const params = new URLSearchParams(location.search);
    buscaAtual = params.get('q')||'';
    const inp = document.getElementById('input-busca');
    if(inp) inp.value = buscaAtual;
    renderizarFiltros();
    renderizarCatalogo();
  }
  renderizarCarrinho();
});
