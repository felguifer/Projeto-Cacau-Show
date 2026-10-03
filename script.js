const products = [
  {id:1,name:"Trufa Tradicional",category:"Bombons",price:4.90,stock:25,desc:"Chocolate ao leite com recheio cremoso.",icon:"🍫"},
  {id:2,name:"Tablete de Chocolate ao Leite",category:"Tabletes",price:14.90,stock:18,desc:"Tablete clássico para qualquer momento.",icon:"🍫"},
  {id:3,name:"Cesta Presente Especial",category:"Presentes",price:89.90,stock:7,desc:"Uma seleção especial para presentear.",icon:"🎁"},
  {id:4,name:"Chocolate Quente",category:"Bebidas",price:12.90,stock:12,desc:"Bebida cremosa para os dias frios.",icon:"☕"},
  {id:5,name:"Bombons Sortidos",category:"Bombons",price:29.90,stock:15,desc:"Mix de sabores em uma só embalagem.",icon:"🍬"},
  {id:6,name:"Tablete Cookies",category:"Tabletes",price:17.90,stock:20,desc:"Chocolate com pedacinhos crocantes.",icon:"🍪"},
  {id:7,name:"Kit Presente Cacau",category:"Presentes",price:59.90,stock:9,desc:"Kit compacto para surpreender alguém.",icon:"🎀"},
  {id:8,name:"Capuccino Cremoso",category:"Bebidas",price:15.90,stock:10,desc:"Capuccino cremoso com sabor de chocolate.",icon:"☕"}
];

const coupons = {
  CACAU10:{type:"percent",value:10,text:"Cupom válido! 10% de desconto."},
  BEMVINDO15:{type:"percent",value:15,text:"Cupom válido! 15% de desconto."},
  FRETEGRATIS:{type:"shipping",value:0,text:"Cupom válido! Frete grátis."}
};

const faqs = [
  ["Como encontro um produto específico?","Use a busca por nome ou combine a busca com os filtros de categoria e preço no catálogo."],
  ["Como sei se um produto está disponível?","A quantidade disponível é controlada pelo cadastro do produto. No sistema completo, esse estoque seria conectado ao banco de dados."],
  ["Como usar um cupom?","Digite o código na aba Cupons. O sistema identifica automaticamente se o código está cadastrado e mostra o benefício."],
  ["Meu cupom não funciona. O que faço?","Confira se o código foi digitado corretamente e se ele está entre os cupons válidos. Em um sistema real, também seriam verificadas validade e regras de uso."],
  ["Como cadastrar um produto?","Na aba Cadastro, preencha todos os campos. O formulário bloqueia dados obrigatórios inválidos antes de permitir o cadastro."],
  ["Posso alterar ou excluir um produto?","Neste protótipo o cadastro é demonstrativo. Em uma versão com banco de dados, essas ações ficariam disponíveis para usuários autorizados."]
];

let cart = [];

const money = n => n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});

function showSection(id){
  document.querySelectorAll(".section").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.section===id));
  window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll(".nav-btn").forEach(b=>b.addEventListener("click",()=>showSection(b.dataset.section)));
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>showSection(b.dataset.go)));

function renderProducts(){
  const q=document.getElementById("search").value.toLowerCase().trim();
  const cat=document.getElementById("category").value;
  const sort=document.getElementById("sort").value;
  let list=products.filter(p=>(!q||p.name.toLowerCase().includes(q)||p.desc.toLowerCase().includes(q))&&(cat==="all"||p.category===cat));
  if(sort==="priceAsc") list.sort((a,b)=>a.price-b.price);
  if(sort==="priceDesc") list.sort((a,b)=>b.price-a.price);
  if(sort==="name") list.sort((a,b)=>a.name.localeCompare(b.name));
  document.getElementById("resultCount").textContent=`${list.length} produto(s) encontrado(s)`;
  document.getElementById("productGrid").innerHTML=list.map(p=>`
    <article class="product">
      <div class="product-img">${p.icon}</div>
      <div class="product-body">
        <span class="tag">${p.category}</span>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="price">${money(p.price)}</div>
        <button class="primary" onclick="addToCart(${p.id})">Adicionar ao carrinho</button>
      </div>
    </article>`).join("") || `<div class="panel" style="grid-column:1/-1">Nenhum produto encontrado. Tente outro termo ou categoria.</div>`;
}
["search","category","sort"].forEach(id=>document.getElementById(id).addEventListener("input",renderProducts));
["category","sort"].forEach(id=>document.getElementById(id).addEventListener("change",renderProducts));

function addToCart(id){
  const p=products.find(x=>x.id===id);
  if(!p)return;
  const item=cart.find(x=>x.id===id);
  if(item)item.qty++;
  else cart.push({id,qty:1});
  updateCart();
}
function updateCart(){
  document.getElementById("cartCount").textContent=cart.reduce((a,b)=>a+b.qty,0);
  const items=document.getElementById("cartItems");
  if(!cart.length){items.innerHTML="<p class='muted'>Seu carrinho está vazio.</p>";document.getElementById("cartTotal").textContent=money(0);return;}
  let total=0;
  items.innerHTML=cart.map(i=>{const p=products.find(x=>x.id===i.id);total+=p.price*i.qty;return `<div class="cart-line"><span>${p.name} × ${i.qty}</span><strong>${money(p.price*i.qty)}</strong></div>`}).join("");
  document.getElementById("cartTotal").textContent=money(total);
}
document.getElementById("cartBtn").onclick=()=>{document.getElementById("cartModal").classList.remove("hidden");updateCart()};
document.getElementById("closeCart").onclick=()=>document.getElementById("cartModal").classList.add("hidden");
document.getElementById("checkoutBtn").onclick=()=>alert("Demonstração acadêmica: checkout concluído apenas no protótipo.");

document.getElementById("couponBtn").onclick=checkCoupon;
document.getElementById("couponInput").addEventListener("keydown",e=>{if(e.key==="Enter")checkCoupon()});
function checkCoupon(){
  const code=document.getElementById("couponInput").value.trim().toUpperCase();
  const box=document.getElementById("couponResult");
  if(!code){box.textContent="Digite um código.";box.style.color="#9a5b27";return;}
  const c=coupons[code];
  if(c){box.textContent="✓ "+c.text;box.style.color="#2e6a43";}
  else{box.textContent="✕ Cupom não encontrado ou inválido.";box.style.color="#9a352c";}
}

document.getElementById("faqGrid").innerHTML=faqs.map((f,i)=>`<article class="faq"><button onclick="this.parentElement.classList.toggle('open')">${f[0]} <span>＋</span></button><p>${f[1]}</p></article>`).join("");

document.getElementById("productForm").addEventListener("submit",e=>{
  e.preventDefault();
  const name=document.getElementById("productName").value.trim();
  const category=document.getElementById("productCategory").value;
  const price=Number(document.getElementById("productPrice").value);
  const stock=Number(document.getElementById("productStock").value);
  const desc=document.getElementById("productDescription").value.trim();
  const feedback=document.getElementById("formFeedback");
  if(!name||!category||!price||price<=0||stock<0||!desc){
    feedback.textContent="Confira os campos. Todos são obrigatórios e devem conter valores válidos.";
    feedback.style.color="#9a352c"; return;
  }
  products.push({id:Date.now(),name,category,price,stock,desc,icon:"🍫"});
  feedback.textContent="✓ Produto cadastrado com sucesso e disponível no catálogo.";
  feedback.style.color="#2e6a43";
  e.target.reset();
  renderProducts();
});
renderProducts();
updateCart();
