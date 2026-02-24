// ===== EcoMarket - Main JS =====
var L = {
  es: {
    'nav.register':'Creá tu cuenta','nav.login':'Ingresá','nav.sell':'Vender','nav.searchPlaceholder':'Buscar vehículos eléctricos...',
    'cat.all':'Todos','cat.cars':'Autos eléctricos','cat.motos':'Motos eléctricas','cat.bikes':'Bicicletas eléctricas','cat.scooters':'Scooters','cat.parts':'Repuestos','cat.accessories':'Accesorios',
    'hero.badge':'Vehículos eléctricos','hero.title':'El futuro de la movilidad está acá','hero.desc':'Comprá y vendé vehículos eléctricos de forma segura.','hero.cta':'Ver publicaciones',
    'prod.title':'Publicaciones','sort.newest':'Más recientes','sort.priceAsc':'Menor precio','sort.priceDesc':'Mayor precio',
    'modal.buy':'Comprar ahora','modal.contact':'Contactar vendedor','modal.fav':'Agregar a favoritos','modal.specs':'Características','modal.desc':'Descripción','modal.condition':'Condición','modal.new':'Nuevo','modal.used':'Usado','modal.seller':'Vendedor','modal.location':'Ubicación','modal.freeShip':'Envío gratis','modal.since':'Vendiendo desde',
    'pub.title':'Publicar producto','pub.prodTitle':'Título','pub.price':'Precio (USD)','pub.category':'Categoría','pub.condition':'Condición','pub.brand':'Marca','pub.model':'Modelo','pub.year':'Año','pub.range':'Autonomía (km)','pub.battery':'Batería','pub.desc':'Descripción','pub.photos':'Fotos','pub.location':'Ubicación','pub.btn':'Publicar','pub.success':'¡Publicación creada!',
    'reg.title':'Crear cuenta','reg.subtitle':'Empezá a comprar y vender','reg.name':'Nombre completo','reg.email':'Email','reg.password':'Contraseña','reg.confirm':'Confirmar','reg.btn':'Crear cuenta','reg.has':'¿Ya tenés cuenta?','reg.login':'Ingresá',
    'login.title':'Ingresá a tu cuenta','login.subtitle':'Bienvenido de vuelta','login.btn':'Ingresar','login.no':'¿No tenés cuenta?','login.register':'Registrate',
    'my.title':'Mis publicaciones','my.empty':'No tenés publicaciones aún.','my.delete':'Eliminar','my.edit':'Editar',
    'footer.desc':'El marketplace #1 de movilidad eléctrica.','footer.categories':'Categorías','footer.help':'Ayuda','footer.rights':'Todos los derechos reservados.',
    'nav.myAccount':'Mi cuenta','nav.logout':'Salir','nav.myProducts':'Mis publicaciones',
    'fav.title':'Mis favoritos','fav.empty':'No tenés favoritos aún.',
    'topbar.slogan':'Movilidad sustentable para todos',
    'footer.howBuy':'Cómo comprar','footer.howSell':'Cómo vender','footer.contact':'Contacto',
    'nav.back':'Volver','prod.empty':'No hay publicaciones','confirm.delete':'¿Eliminar esta publicación?',
    'modal.shipAll':'a todo el país','modal.buyingSoon':'Función de compra próximamente','modal.chatSoon':'Función de mensajería próximamente',
    'pub.catAutos':'Autos eléctricos','pub.catMotos':'Motos eléctricas','pub.catBikes':'Bicicletas eléctricas','pub.catScooters':'Scooters','pub.catParts':'Repuestos','pub.catAccs':'Accesorios','pub.new':'Nuevo','pub.used':'Usado',
    'reg.noMatch':'Contraseñas no coinciden'
  },
  en: {
    'nav.register':'Create account','nav.login':'Log in','nav.sell':'Sell','nav.searchPlaceholder':'Search electric vehicles...',
    'cat.all':'All','cat.cars':'Electric cars','cat.motos':'Electric motorcycles','cat.bikes':'Electric bicycles','cat.scooters':'Scooters','cat.parts':'Parts','cat.accessories':'Accessories',
    'hero.badge':'Electric vehicles','hero.title':'The future of mobility is here','hero.desc':'Buy and sell electric vehicles safely.','hero.cta':'View listings',
    'prod.title':'Listings','sort.newest':'Newest','sort.priceAsc':'Lowest price','sort.priceDesc':'Highest price',
    'modal.buy':'Buy now','modal.contact':'Contact seller','modal.fav':'Add to favorites','modal.specs':'Specifications','modal.desc':'Description','modal.condition':'Condition','modal.new':'New','modal.used':'Used','modal.seller':'Seller','modal.location':'Location','modal.freeShip':'Free shipping','modal.since':'Selling since',
    'pub.title':'Publish product','pub.prodTitle':'Title','pub.price':'Price (USD)','pub.category':'Category','pub.condition':'Condition','pub.brand':'Brand','pub.model':'Model','pub.year':'Year','pub.range':'Range (km)','pub.battery':'Battery','pub.desc':'Description','pub.photos':'Photos','pub.location':'Location','pub.btn':'Publish','pub.success':'Listing created!',
    'reg.title':'Create account','reg.subtitle':'Start buying and selling','reg.name':'Full name','reg.email':'Email','reg.password':'Password','reg.confirm':'Confirm','reg.btn':'Create account','reg.has':'Already have an account?','reg.login':'Log in',
    'login.title':'Log in','login.subtitle':'Welcome back','login.btn':'Log in','login.no':'No account?','login.register':'Sign up',
    'my.title':'My listings','my.empty':'No listings yet.','my.delete':'Delete','my.edit':'Edit',
    'footer.desc':'The #1 electric mobility marketplace.','footer.categories':'Categories','footer.help':'Help','footer.rights':'All rights reserved.',
    'nav.myAccount':'My account','nav.logout':'Log out','nav.myProducts':'My listings',
    'fav.title':'My favorites','fav.empty':'No favorites yet.',
    'topbar.slogan':'Sustainable mobility for everyone',
    'footer.howBuy':'How to buy','footer.howSell':'How to sell','footer.contact':'Contact',
    'nav.back':'Back','prod.empty':'No listings found','confirm.delete':'Delete this listing?',
    'modal.shipAll':'nationwide','modal.buyingSoon':'Purchase feature coming soon','modal.chatSoon':'Messaging feature coming soon',
    'pub.catAutos':'Electric cars','pub.catMotos':'Electric motorcycles','pub.catBikes':'Electric bicycles','pub.catScooters':'Scooters','pub.catParts':'Parts','pub.catAccs':'Accessories','pub.new':'New','pub.used':'Used',
    'reg.noMatch':'Passwords do not match'
  }
};
var currentLang = localStorage.getItem('em_lang') || 'es';
function t(k) { return (L[currentLang]||L.es)[k] || L.es[k] || k; }
function applyLang(lang) {
  currentLang = lang;
  document.querySelectorAll('[data-i18n]').forEach(function(el) { var v=t(el.getAttribute('data-i18n')); if(v) el.innerHTML=v; });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) { var v=t(el.getAttribute('data-i18n-placeholder')); if(v) el.placeholder=v; });
  document.querySelectorAll('.lang-btn').forEach(function(b) { b.classList.toggle('active',b.textContent.trim().toLowerCase()===lang); });
}
window.setLang = function(l) { if(L[l]){localStorage.setItem('em_lang',l);applyLang(l);} };

// Auth
function getUser() { var u=localStorage.getItem('em_user'); return u?JSON.parse(u):null; }
function setUser(u) { localStorage.setItem('em_user',JSON.stringify(u)); }
function logout() { localStorage.removeItem('em_user');localStorage.removeItem('em_token');location.href='/'; }
function updateUserUI() {
  var u=getUser(), area=document.getElementById('topUserArea');
  if(!area) return;
  if(u) { area.innerHTML='<span style="color:#eee">'+u.name+'</span> <a href="#" onclick="logout()" style="margin-left:.5rem">'+t('nav.logout')+'</a>'; }
  else { area.innerHTML='<a href="register.html">'+t('nav.register')+'</a><a href="login.html">'+t('nav.login')+'</a>'; }
}

// Favorites
function getFavs() { return JSON.parse(localStorage.getItem('em_favs')||'[]'); }
function toggleFav(id,e) { if(e){e.stopPropagation();} var f=getFavs(),i=f.indexOf(id); if(i>=0)f.splice(i,1);else f.push(id); localStorage.setItem('em_favs',JSON.stringify(f)); loadProducts(); }
function isFav(id) { return getFavs().indexOf(id)>=0; }

// Products
var allProducts = [];
var currentCategory = '';
function loadProducts() {
  fetch('api/products.php?action=list')
  .then(function(r){return r.json()})
  .then(function(d){
    if(d.products){allProducts=d.products;renderProducts(allProducts);}
  }).catch(function(){renderProducts([])});
}
function renderProducts(list) {
  var grid=document.getElementById('productsGrid');
  if(!grid)return;
  if(list.length===0){grid.innerHTML='<div style="text-align:center;padding:3rem;color:var(--gray);grid-column:1/-1"><i class="fas fa-box-open" style="font-size:2rem;display:block;margin-bottom:.5rem;opacity:.4"></i>'+t('prod.empty')+'</div>';return;}
  grid.innerHTML='';
  list.forEach(function(p){
    var card=document.createElement('div');
    card.className='product-card';
    card.onclick=function(){openProductModal(p)};
    var img=p.photo||'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=400';
    var price=Number(p.price).toLocaleString('es');
    card.innerHTML='<div class="product-card-img">'
      +'<img src="'+img+'" alt="'+p.title+'" loading="lazy">'
      +'<button class="product-card-fav '+(isFav(p.id)?'active':'')+'" onclick="toggleFav('+p.id+',event)"><i class="fa'+(isFav(p.id)?'s':'r')+' fa-heart"></i></button>'
      +(p.condition==='new'?'<span class="product-card-badge">'+t('modal.new')+'</span>':'')
      +'</div>'
      +'<div class="product-card-info">'
      +'<div class="product-card-price"><span class="currency">U$S</span> '+price+'</div>'
      +'<div class="product-card-title">'+p.title+'</div>'
      +'<div class="product-card-meta"><span><i class="fas fa-map-marker-alt"></i> '+(p.location||'')+'</span></div>'
      +(p.free_shipping?'<div class="free-shipping"><i class="fas fa-truck"></i> '+t('modal.freeShip')+'</div>':'')
      +'</div>';
    grid.appendChild(card);
  });
}
function filterCategory(cat,el) {
  if(el){document.querySelectorAll('.cat-link').forEach(function(c){c.classList.remove('active')});el.classList.add('active');}
  currentCategory=cat;
  var filtered=cat?allProducts.filter(function(p){return p.category===cat}):allProducts;
  renderProducts(filtered);
  return false;
}
function searchProducts() {
  var q=(document.getElementById('searchInput').value||'').toLowerCase();
  var cat=document.getElementById('searchCategory');
  var c=cat?cat.value:'';
  var filtered=allProducts.filter(function(p){
    var matchQ=!q||p.title.toLowerCase().indexOf(q)>=0||(p.description||'').toLowerCase().indexOf(q)>=0||(p.brand||'').toLowerCase().indexOf(q)>=0;
    var matchC=!c||p.category===c;
    return matchQ&&matchC;
  });
  renderProducts(filtered);
}
function sortProducts() {
  var s=document.getElementById('sortSelect').value;
  var list=currentCategory?allProducts.filter(function(p){return p.category===currentCategory}):allProducts.slice();
  if(s==='price_asc')list.sort(function(a,b){return a.price-b.price});
  if(s==='price_desc')list.sort(function(a,b){return b.price-a.price});
  if(s==='newest')list.sort(function(a,b){return b.id-a.id});
  renderProducts(list);
}

// Product Modal
function openProductModal(p) {
  var modal=document.getElementById('productModal');
  var content=document.getElementById('modalContent');
  if(!modal||!content)return;
  var img=p.photo||'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=800';
  var price=Number(p.price).toLocaleString('es');
  var cond=p.condition==='new'?t('modal.new'):t('modal.used');
  content.innerHTML='<button class="modal-close" onclick="closeProductModal()"><i class="fas fa-times"></i></button>'
    +'<div class="modal-grid">'
    +'<div class="modal-gallery"><img src="'+img+'" alt="'+p.title+'"></div>'
    +'<div class="modal-details">'
    +'<span class="modal-condition">'+cond+'</span>'
    +'<h2 class="modal-title">'+p.title+'</h2>'
    +'<div class="modal-price">U$S '+price+'</div>'
    +'<div class="modal-installments">'+t('modal.freeShip')+'</div>'
    +'<div class="modal-shipping"><i class="fas fa-truck"></i> '+t('modal.freeShip')+' '+t('modal.shipAll')+'</div>'
    +'<div class="modal-seller"><h4><i class="fas fa-store"></i> '+(p.seller_name||t('modal.seller'))+'</h4><p><i class="fas fa-map-marker-alt"></i> '+(p.location||'')+'</p></div>'
    +'<div class="modal-actions">'
    +'<button class="btn btn-primary" onclick="alert(t(\'modal.buyingSoon\'))"><i class="fas fa-shopping-cart"></i> '+t('modal.buy')+'</button>'
    +'<button class="btn btn-outline" onclick="contactSeller('+p.id+')"><i class="fas fa-comment"></i> '+t('modal.contact')+'</button>'
    +'</div></div></div>'
    +'<div class="modal-specs"><h3>'+t('modal.specs')+'</h3><table>'
    +(p.brand?'<tr><td>'+t('pub.brand')+'</td><td>'+p.brand+'</td></tr>':'')
    +(p.model?'<tr><td>'+t('pub.model')+'</td><td>'+p.model+'</td></tr>':'')
    +(p.year?'<tr><td>'+t('pub.year')+'</td><td>'+p.year+'</td></tr>':'')
    +(p.range_km?'<tr><td>'+t('pub.range')+'</td><td>'+p.range_km+' km</td></tr>':'')
    +(p.battery?'<tr><td>'+t('pub.battery')+'</td><td>'+p.battery+'</td></tr>':'')
    +'<tr><td>'+t('modal.condition')+'</td><td>'+cond+'</td></tr>'
    +'</table></div>'
    +(p.description?'<div class="modal-desc"><h3>'+t('modal.desc')+'</h3><p>'+p.description+'</p></div>':'');
  modal.style.display='flex';
  document.body.style.overflow='hidden';
}
function closeProductModal() { var m=document.getElementById('productModal');if(m)m.style.display='none';document.body.style.overflow=''; }
function contactSeller(id){alert(t('modal.chatSoon'));}
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeProductModal()});

// Register
function handleRegister(e) {
  e.preventDefault();var f=e.target;
  if(f.password.value!==f.confirm.value){showAlert('regAlert',t('reg.noMatch'),'error');return;}
  var btn=f.querySelector('button[type=submit]');btn.disabled=true;btn.innerHTML='<i class="fas fa-spinner fa-spin"></i>';
  fetch('api/auth.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'register',name:f.name.value.trim(),email:f.email.value.trim(),password:f.password.value,location:f.location?f.location.value:''})})
  .then(function(r){return r.text()})
  .then(function(txt){btn.disabled=false;btn.textContent=t('reg.btn');
    var res;try{res=JSON.parse(txt)}catch(e){showAlert('regAlert','Error: '+txt.substring(0,100),'error');return;}
    if(res.success){setUser(res.user);localStorage.setItem('em_token',res.token);location.href='/';}
    else showAlert('regAlert',res.error||'Error','error');
  }).catch(function(err){btn.disabled=false;btn.textContent=t('reg.btn');showAlert('regAlert','Error: '+err.message,'error');});
}
function handleLogin(e) {
  e.preventDefault();var f=e.target;
  var btn=f.querySelector('button[type=submit]');btn.disabled=true;btn.innerHTML='<i class="fas fa-spinner fa-spin"></i>';
  fetch('api/auth.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'login',email:f.email.value.trim(),password:f.password.value})})
  .then(function(r){return r.text()})
  .then(function(txt){btn.disabled=false;btn.textContent=t('login.btn');
    var res;try{res=JSON.parse(txt)}catch(e){showAlert('loginAlert','Error: '+txt.substring(0,100),'error');return;}
    if(res.success){setUser(res.user);localStorage.setItem('em_token',res.token);location.href='/';}
    else showAlert('loginAlert',res.error||'Error','error');
  }).catch(function(err){btn.disabled=false;btn.textContent=t('login.btn');showAlert('loginAlert','Error: '+err.message,'error');});
}
function showAlert(id,msg,type){var el=document.getElementById(id);if(!el)return;el.className='alert alert-'+type;el.textContent=msg;el.style.display='block';setTimeout(function(){el.style.display='none'},5000);}

// Publish
function handlePublish(e) {
  e.preventDefault();var f=e.target;var u=getUser();
  if(!u){location.href='login.html';return;}
  var btn=f.querySelector('button[type=submit]');btn.disabled=true;btn.innerHTML='<i class="fas fa-spinner fa-spin"></i>';
  var data={user_id:u.id,token:localStorage.getItem('em_token'),title:f.prodTitle.value,price:parseFloat(f.price.value),category:f.category.value,condition:f.condition.value,brand:f.brand.value,model:f.model.value,year:f.year.value,range_km:f.range_km.value,battery:f.battery.value,description:f.description.value,location:f.location.value};
  fetch('api/products.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'create',...data})})
  .then(function(r){return r.text()})
  .then(function(txt){btn.disabled=false;btn.textContent=t('pub.btn');
    var res;try{res=JSON.parse(txt)}catch(e){showAlert('pubAlert','Error: '+txt.substring(0,100),'error');return;}
    if(res.success){showAlert('pubAlert',t('pub.success'),'success');f.reset();setTimeout(function(){location.href='/'},1500);}
    else showAlert('pubAlert',res.error||'Error','error');
  }).catch(function(err){btn.disabled=false;btn.textContent=t('pub.btn');showAlert('pubAlert','Error: '+err.message,'error');});
}

// My products
function loadMyProducts() {
  var u=getUser();if(!u)return;
  var grid=document.getElementById('myProductsGrid');if(!grid)return;
  grid.innerHTML='<div style="text-align:center;padding:2rem"><i class="fas fa-spinner fa-spin"></i></div>';
  fetch('api/products.php?action=my&user_id='+u.id+'&token='+localStorage.getItem('em_token'))
  .then(function(r){return r.json()})
  .then(function(d){
    if(!d.products||d.products.length===0){grid.innerHTML='<p style="text-align:center;color:var(--gray);padding:2rem">'+t('my.empty')+'</p>';return;}
    grid.innerHTML='';
    d.products.forEach(function(p){
      var item=document.createElement('div');item.className='my-product-item';
      var img=p.photo||'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=200';
      item.innerHTML='<img src="'+img+'" alt="'+p.title+'">'
        +'<div class="my-product-info"><h3>'+p.title+'</h3><p>U$S '+Number(p.price).toLocaleString('es')+' · '+(p.location||'')+'</p></div>'
        +'<div class="my-product-actions"><button class="btn btn-danger" onclick="deleteProduct('+p.id+')"><i class="fas fa-trash"></i></button></div>';
      grid.appendChild(item);
    });
  });
}
function deleteProduct(id) {
  if(!confirm(t('confirm.delete')))return;
  var u=getUser();
  fetch('api/products.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'delete',product_id:id,user_id:u.id,token:localStorage.getItem('em_token')})})
  .then(function(r){return r.json()})
  .then(function(res){if(res.success)loadMyProducts();});
}

// Favorites page
function loadFavorites() {
  var grid=document.getElementById('favsGrid');if(!grid)return;
  var favs=getFavs();
  if(favs.length===0){grid.innerHTML='<p style="text-align:center;color:var(--gray);padding:2rem;grid-column:1/-1">'+t('fav.empty')+'</p>';return;}
  fetch('api/products.php?action=list')
  .then(function(r){return r.json()})
  .then(function(d){
    var list=(d.products||[]).filter(function(p){return favs.indexOf(p.id)>=0});
    if(list.length===0){grid.innerHTML='<p style="text-align:center;color:var(--gray);padding:2rem;grid-column:1/-1">'+t('fav.empty')+'</p>';return;}
    grid.innerHTML='';
    list.forEach(function(p){
      var card=document.createElement('div');card.className='product-card';card.onclick=function(){openProductModal(p)};
      var img=p.photo||'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=400';
      card.innerHTML='<div class="product-card-img"><img src="'+img+'" alt="'+p.title+'" loading="lazy"></div>'
        +'<div class="product-card-info"><div class="product-card-price"><span class="currency">U$S</span> '+Number(p.price).toLocaleString('es')+'</div>'
        +'<div class="product-card-title">'+p.title+'</div></div>';
      grid.appendChild(card);
    });
  });
}

// Init
(function(){
  applyLang(currentLang);
  updateUserUI();
  if(document.getElementById('productsGrid'))loadProducts();
  if(document.getElementById('myProductsGrid'))loadMyProducts();
  if(document.getElementById('favsGrid'))loadFavorites();
  document.getElementById('searchInput')&&document.getElementById('searchInput').addEventListener('keyup',function(e){if(e.key==='Enter')searchProducts()});
})();
