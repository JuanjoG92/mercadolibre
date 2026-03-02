// ===== EcoMarket Admin Panel JS =====

// ----- Translations -----
var AL = {
  es: {
    'admin.enterPin':'Ingrese el PIN de administrador',
    'admin.enter':'Ingresar',
    'admin.invalidPin':'PIN incorrecto',
    'admin.connectionError':'Error de conexión',
    'admin.totalProducts':'Total productos',
    'admin.active':'Activos',
    'admin.paused':'Pausados',
    'admin.products':'Productos',
    'admin.addNew':'Agregar',
    'admin.search':'Buscar producto...',
    'admin.addProduct':'Agregar producto',
    'admin.editProduct':'Editar producto',
    'admin.title':'Título *',
    'admin.price':'Precio (USD) *',
    'admin.category':'Categoría',
    'admin.condition':'Condición',
    'admin.brand':'Marca',
    'admin.model':'Modelo',
    'admin.photo':'Foto',
    'admin.takePhoto':'Tomar foto o elegir imagen',
    'admin.orPasteUrl':'o pegar URL',
    'admin.uploading':'Subiendo foto...',
    'admin.uploadError':'Error al subir foto',
    'admin.photoUploaded':'¡Foto subida!',
    'admin.removePhoto':'Quitar foto',
    'admin.location':'Ubicación',
    'admin.description':'Descripción',
    'admin.moreOptions':'Más opciones',
    'admin.lessOptions':'Menos opciones',
    'admin.year':'Año',
    'admin.range':'Autonomía (km)',
    'admin.battery':'Batería',
    'admin.save':'Guardar',
    'admin.cancel':'Cancelar',
    'admin.edit':'Editar',
    'admin.delete':'Eliminar',
    'admin.pause':'Pausar',
    'admin.activate':'Activar',
    'admin.confirmDelete':'¿Eliminar este producto?',
    'admin.confirmDeleteMsg':'Esta acción no se puede deshacer.',
    'admin.yes':'Sí, eliminar',
    'admin.no':'No, volver',
    'admin.saved':'¡Producto guardado!',
    'admin.deleted':'Producto eliminado',
    'admin.noProducts':'No hay productos todavía',
    'admin.statusActive':'Activo',
    'admin.statusPaused':'Pausado',
    'admin.catAutos':'Autos eléctricos',
    'admin.catMotos':'Motos eléctricas',
    'admin.catBikes':'Bicicletas eléctricas',
    'admin.catScooters':'Scooters',
    'admin.catParts':'Repuestos',
    'admin.catAccs':'Accesorios',
    'admin.new':'Nuevo',
    'admin.used':'Usado'
  },
  en: {
    'admin.enterPin':'Enter the admin PIN',
    'admin.enter':'Log in',
    'admin.invalidPin':'Invalid PIN',
    'admin.connectionError':'Connection error',
    'admin.totalProducts':'Total products',
    'admin.active':'Active',
    'admin.paused':'Paused',
    'admin.products':'Products',
    'admin.addNew':'Add new',
    'admin.search':'Search product...',
    'admin.addProduct':'Add product',
    'admin.editProduct':'Edit product',
    'admin.title':'Title *',
    'admin.price':'Price (USD) *',
    'admin.category':'Category',
    'admin.condition':'Condition',
    'admin.brand':'Brand',
    'admin.model':'Model',
    'admin.photo':'Photo',
    'admin.takePhoto':'Take photo or choose image',
    'admin.orPasteUrl':'or paste URL',
    'admin.uploading':'Uploading photo...',
    'admin.uploadError':'Error uploading photo',
    'admin.photoUploaded':'Photo uploaded!',
    'admin.removePhoto':'Remove photo',
    'admin.location':'Location',
    'admin.description':'Description',
    'admin.moreOptions':'More options',
    'admin.lessOptions':'Less options',
    'admin.year':'Year',
    'admin.range':'Range (km)',
    'admin.battery':'Battery',
    'admin.save':'Save',
    'admin.cancel':'Cancel',
    'admin.edit':'Edit',
    'admin.delete':'Delete',
    'admin.pause':'Pause',
    'admin.activate':'Activate',
    'admin.confirmDelete':'Delete this product?',
    'admin.confirmDeleteMsg':'This action cannot be undone.',
    'admin.yes':'Yes, delete',
    'admin.no':'No, go back',
    'admin.saved':'Product saved!',
    'admin.deleted':'Product deleted',
    'admin.noProducts':'No products yet',
    'admin.statusActive':'Active',
    'admin.statusPaused':'Paused',
    'admin.catAutos':'Electric cars',
    'admin.catMotos':'Electric motorcycles',
    'admin.catBikes':'Electric bicycles',
    'admin.catScooters':'Scooters',
    'admin.catParts':'Parts',
    'admin.catAccs':'Accessories',
    'admin.new':'New',
    'admin.used':'Used'
  }
};

// ----- State -----
var adminLang = localStorage.getItem('em_admin_lang') || 'es';
var adminPin = localStorage.getItem('em_admin_pin') || '';
var adminProducts = [];
var isEditing = false;

// ----- Translation helpers -----
function at(k) { return (AL[adminLang] || AL.es)[k] || AL.es[k] || k; }

function applyAdminLang() {
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    var v = at(el.getAttribute('data-i18n'));
    if (v) el.textContent = v;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
    var v = at(el.getAttribute('data-i18n-placeholder'));
    if (v) el.placeholder = v;
  });
  document.querySelectorAll('.lang-btn').forEach(function(b) {
    b.classList.toggle('active', b.textContent.trim().toLowerCase() === adminLang);
  });
  updateDropdownLabels();
}

function setAdminLang(l) {
  adminLang = l;
  localStorage.setItem('em_admin_lang', l);
  applyAdminLang();
  if (adminProducts.length) renderAdminProducts(adminProducts);
}

function updateDropdownLabels() {
  var cat = document.getElementById('fCategory');
  if (!cat) return;
  var catLabels = {
    'autos': at('admin.catAutos'), 'motos': at('admin.catMotos'),
    'bicicletas': at('admin.catBikes'), 'scooters': at('admin.catScooters'),
    'repuestos': at('admin.catParts'), 'accesorios': at('admin.catAccs')
  };
  for (var i = 0; i < cat.options.length; i++) {
    if (catLabels[cat.options[i].value]) cat.options[i].textContent = catLabels[cat.options[i].value];
  }
  var cond = document.getElementById('fCondition');
  if (cond) {
    cond.options[0].textContent = at('admin.new');
    cond.options[1].textContent = at('admin.used');
  }
}

// ----- PIN Authentication -----
function verifyPin() {
  var pin = document.getElementById('pinInput').value;
  if (!pin) return;
  var btn = document.querySelector('.login-box .admin-btn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  fetch('api/admin.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'verify_pin', pin: pin })
  })
  .then(function(r) { return r.json(); })
  .then(function(res) {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-lock-open"></i> ' + at('admin.enter');
    if (res.success) {
      adminPin = pin;
      localStorage.setItem('em_admin_pin', pin);
      showPanel();
    } else {
      showAdminAlert('loginAlert', at('admin.invalidPin'), 'error');
    }
  })
  .catch(function() {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-lock-open"></i> ' + at('admin.enter');
    showAdminAlert('loginAlert', at('admin.connectionError'), 'error');
  });
}

function showPanel() {
  document.getElementById('loginView').style.display = 'none';
  document.getElementById('panelView').style.display = 'block';
  loadAdminStats();
  loadAdminProducts();
}

function adminLogout() {
  adminPin = '';
  localStorage.removeItem('em_admin_pin');
  document.getElementById('panelView').style.display = 'none';
  document.getElementById('loginView').style.display = 'block';
  document.getElementById('pinInput').value = '';
}

// ----- Stats -----
function loadAdminStats() {
  fetch('api/admin.php?action=stats&pin=' + encodeURIComponent(adminPin))
  .then(function(r) { return r.json(); })
  .then(function(d) {
    if (d.error) return;
    document.getElementById('statTotal').textContent = d.total || 0;
    document.getElementById('statActive').textContent = d.active || 0;
    document.getElementById('statPaused').textContent = d.paused || 0;
  });
}

// ----- Products List -----
function loadAdminProducts() {
  var list = document.getElementById('adminProductsList');
  list.innerHTML = '<div class="admin-loading"><i class="fas fa-spinner fa-spin"></i></div>';
  fetch('api/admin.php?action=list&pin=' + encodeURIComponent(adminPin))
  .then(function(r) { return r.json(); })
  .then(function(d) {
    if (d.error) { adminLogout(); return; }
    adminProducts = d.products || [];
    renderAdminProducts(adminProducts);
  })
  .catch(function() {
    list.innerHTML = '<div class="admin-empty"><i class="fas fa-exclamation-triangle"></i><p>Error</p></div>';
  });
}

function renderAdminProducts(list) {
  var container = document.getElementById('adminProductsList');
  if (!list.length) {
    container.innerHTML = '<div class="admin-empty"><i class="fas fa-box-open"></i><p>' + at('admin.noProducts') + '</p></div>';
    return;
  }
  container.innerHTML = '';
  var catMap = {
    autos: at('admin.catAutos'), motos: at('admin.catMotos'),
    bicicletas: at('admin.catBikes'), scooters: at('admin.catScooters'),
    repuestos: at('admin.catParts'), accesorios: at('admin.catAccs')
  };
  list.forEach(function(p) {
    var card = document.createElement('div');
    card.className = 'admin-product';
    var img = p.photo || 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=200';
    var statusClass = p.status === 'active' ? 'status-active' : 'status-paused';
    var statusText = p.status === 'active' ? at('admin.statusActive') : at('admin.statusPaused');
    var toggleText = p.status === 'active' ? at('admin.pause') : at('admin.activate');
    var toggleIcon = p.status === 'active' ? 'fa-pause' : 'fa-play';

    card.innerHTML = '<div class="admin-product-main">'
      + '<img class="admin-product-img" src="' + img + '" alt="" loading="lazy" onerror="this.src=\'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=200\'">'
      + '<div class="admin-product-info">'
      + '<div class="admin-product-title">' + escHtml(p.title) + '</div>'
      + '<div class="admin-product-price">U$S ' + Number(p.price).toLocaleString('es') + '</div>'
      + '<div class="admin-product-meta">'
      + '<span class="admin-product-status ' + statusClass + '">' + statusText + '</span>'
      + '<span>' + (catMap[p.category] || p.category) + '</span>'
      + '</div></div></div>'
      + '<div class="admin-product-actions">'
      + '<button class="btn-edit" onclick="editProduct(' + p.id + ')"><i class="fas fa-edit"></i> ' + at('admin.edit') + '</button>'
      + '<button class="btn-toggle" onclick="toggleStatus(' + p.id + ')"><i class="fas ' + toggleIcon + '"></i> ' + toggleText + '</button>'
      + '<button class="btn-delete" onclick="confirmDelete(' + p.id + ')"><i class="fas fa-trash"></i> ' + at('admin.delete') + '</button>'
      + '</div>';
    container.appendChild(card);
  });
}

function escHtml(s) {
  var d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function filterAdminProducts() {
  var q = (document.getElementById('adminSearch').value || '').toLowerCase();
  var filtered = adminProducts.filter(function(p) {
    return !q
      || p.title.toLowerCase().indexOf(q) >= 0
      || (p.brand || '').toLowerCase().indexOf(q) >= 0
      || (p.category || '').toLowerCase().indexOf(q) >= 0
      || (p.location || '').toLowerCase().indexOf(q) >= 0;
  });
  renderAdminProducts(filtered);
}

// ----- Tabs -----
function showTab(tab) {
  document.getElementById('tabProducts').classList.toggle('active', tab === 'products');
  document.getElementById('tabAdd').classList.toggle('active', tab === 'add');
  document.getElementById('productsView').style.display = tab === 'products' ? 'block' : 'none';
  document.getElementById('formView').style.display = tab === 'add' ? 'block' : 'none';
  if (tab === 'add' && !isEditing) {
    resetForm();
    document.getElementById('formTitle').textContent = at('admin.addProduct');
  }
}

function cancelForm() {
  isEditing = false;
  showTab('products');
}

// ----- Form -----
function resetForm() {
  document.getElementById('editId').value = '';
  document.getElementById('fTitle').value = '';
  document.getElementById('fPrice').value = '';
  document.getElementById('fCategory').value = 'autos';
  document.getElementById('fCondition').value = 'new';
  document.getElementById('fBrand').value = '';
  document.getElementById('fModel').value = '';
  document.getElementById('fPhoto').value = '';
  document.getElementById('fPhotoFile').value = '';
  document.getElementById('photoUploading').style.display = 'none';
  document.getElementById('fLocation').value = '';
  document.getElementById('fDescription').value = '';
  document.getElementById('fYear').value = '';
  document.getElementById('fRange').value = '';
  document.getElementById('fBattery').value = '';
  document.getElementById('photoPreview').innerHTML = '';
  document.getElementById('optionalFields').style.display = 'none';
  document.getElementById('optionalIcon').className = 'fas fa-chevron-down';
  document.getElementById('formAlert').style.display = 'none';
  isEditing = false;
}

function editProduct(id) {
  var p = adminProducts.find(function(x) { return x.id === id; });
  if (!p) return;
  isEditing = true;
  document.getElementById('editId').value = p.id;
  document.getElementById('fTitle').value = p.title || '';
  document.getElementById('fPrice').value = p.price || '';
  document.getElementById('fCategory').value = p.category || 'autos';
  document.getElementById('fCondition').value = p.condition || 'used';
  document.getElementById('fBrand').value = p.brand || '';
  document.getElementById('fModel').value = p.model || '';
  document.getElementById('fPhoto').value = p.photo || '';
  document.getElementById('fLocation').value = p.location || '';
  document.getElementById('fDescription').value = p.description || '';
  document.getElementById('fYear').value = p.year || '';
  document.getElementById('fRange').value = p.range_km || '';
  document.getElementById('fBattery').value = p.battery || '';
  if (p.photo) {
    showPhotoPreview(p.photo);
  } else {
    document.getElementById('photoPreview').innerHTML = '';
  }
  if (p.year || p.range_km || p.battery) {
    document.getElementById('optionalFields').style.display = 'block';
    document.getElementById('optionalIcon').className = 'fas fa-chevron-up';
  }
  document.getElementById('formTitle').textContent = at('admin.editProduct');
  showTab('add');
  window.scrollTo(0, 0);
}

function handleAdminSubmit(e) {
  e.preventDefault();
  var editId = document.getElementById('editId').value;
  var data = {
    pin: adminPin,
    action: editId ? 'update' : 'create',
    title: document.getElementById('fTitle').value.trim(),
    price: parseFloat(document.getElementById('fPrice').value),
    category: document.getElementById('fCategory').value,
    condition: document.getElementById('fCondition').value,
    brand: document.getElementById('fBrand').value.trim(),
    model: document.getElementById('fModel').value.trim(),
    photo: document.getElementById('fPhoto').value.trim(),
    location: document.getElementById('fLocation').value.trim(),
    description: document.getElementById('fDescription').value.trim(),
    year: document.getElementById('fYear').value,
    range_km: document.getElementById('fRange').value.trim(),
    battery: document.getElementById('fBattery').value.trim()
  };
  if (editId) data.id = parseInt(editId);

  var btn = document.querySelector('#adminForm button[type=submit]');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

  fetch('api/admin.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(function(r) { return r.json(); })
  .then(function(res) {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-save"></i> ' + at('admin.save');
    if (res.success) {
      showAdminAlert('formAlert', at('admin.saved'), 'success');
      loadAdminStats();
      loadAdminProducts();
      setTimeout(function() {
        isEditing = false;
        showTab('products');
      }, 1200);
    } else {
      showAdminAlert('formAlert', res.error || 'Error', 'error');
    }
  })
  .catch(function(err) {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-save"></i> ' + at('admin.save');
    showAdminAlert('formAlert', at('admin.connectionError'), 'error');
  });
}

// ----- Toggle Status -----
function toggleStatus(id) {
  fetch('api/admin.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'toggle_status', pin: adminPin, id: id })
  })
  .then(function(r) { return r.json(); })
  .then(function(res) {
    if (res.success) { loadAdminStats(); loadAdminProducts(); }
  });
}

// ----- Delete -----
function confirmDelete(id) {
  var overlay = document.createElement('div');
  overlay.className = 'admin-overlay';
  overlay.innerHTML = '<div class="admin-dialog">'
    + '<h3>' + at('admin.confirmDelete') + '</h3>'
    + '<p>' + at('admin.confirmDeleteMsg') + '</p>'
    + '<div class="admin-dialog-actions">'
    + '<button style="background:#e5e7eb;color:#1a1a1a" onclick="this.closest(\'.admin-overlay\').remove()">' + at('admin.no') + '</button>'
    + '<button style="background:#ef4444;color:#fff" onclick="doDelete(' + id + ');this.closest(\'.admin-overlay\').remove()">' + at('admin.yes') + '</button>'
    + '</div></div>';
  document.body.appendChild(overlay);
}

function doDelete(id) {
  fetch('api/admin.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'delete', pin: adminPin, id: id })
  })
  .then(function(r) { return r.json(); })
  .then(function(res) {
    if (res.success) { loadAdminStats(); loadAdminProducts(); }
  });
}

// ----- Photo Upload -----
function handlePhotoUpload(input) {
  if (!input.files || !input.files[0]) return;
  var file = input.files[0];
  if (file.size > 5 * 1024 * 1024) {
    showAdminAlert('formAlert', at('admin.uploadError') + ' (max 5MB)', 'error');
    input.value = '';
    return;
  }
  var uploading = document.getElementById('photoUploading');
  uploading.style.display = 'flex';
  var formData = new FormData();
  formData.append('photo', file);
  formData.append('pin', adminPin);
  fetch('api/upload.php', { method: 'POST', body: formData })
  .then(function(r) { return r.json(); })
  .then(function(res) {
    uploading.style.display = 'none';
    if (res.success && res.url) {
      document.getElementById('fPhoto').value = res.url;
      showPhotoPreview(res.url);
    } else {
      showAdminAlert('formAlert', at('admin.uploadError') + ': ' + (res.error || ''), 'error');
    }
  })
  .catch(function() {
    uploading.style.display = 'none';
    showAdminAlert('formAlert', at('admin.uploadError'), 'error');
  });
  input.value = '';
}

function showPhotoPreview(url) {
  var preview = document.getElementById('photoPreview');
  if (url) {
    preview.innerHTML = '<img src="' + url + '" alt="" onerror="this.parentNode.innerHTML=\'\'">'
      + '<button type="button" class="photo-remove" onclick="clearPhoto()" title="' + at('admin.removePhoto') + '"><i class="fas fa-times"></i></button>';
  } else {
    preview.innerHTML = '';
  }
}

function clearPhoto() {
  document.getElementById('fPhoto').value = '';
  document.getElementById('photoPreview').innerHTML = '';
}

function setupPhotoPreview() {
  var input = document.getElementById('fPhoto');
  if (!input) return;
  var debounce = null;
  input.addEventListener('input', function() {
    var url = this.value.trim();
    clearTimeout(debounce);
    debounce = setTimeout(function() {
      if (url && (url.indexOf('http://') === 0 || url.indexOf('https://') === 0 || url.indexOf('uploads/') === 0)) {
        showPhotoPreview(url);
      } else {
        document.getElementById('photoPreview').innerHTML = '';
      }
    }, 500);
  });
}

// ----- Optional Fields Toggle -----
function toggleOptional() {
  var el = document.getElementById('optionalFields');
  var icon = document.getElementById('optionalIcon');
  var btn = icon.parentNode;
  if (el.style.display === 'none') {
    el.style.display = 'block';
    icon.className = 'fas fa-chevron-up';
    btn.querySelector('span').textContent = at('admin.lessOptions');
  } else {
    el.style.display = 'none';
    icon.className = 'fas fa-chevron-down';
    btn.querySelector('span').textContent = at('admin.moreOptions');
  }
}

// ----- Alert Helper -----
function showAdminAlert(id, msg, type) {
  var el = document.getElementById(id);
  if (!el) return;
  el.className = 'admin-alert admin-alert-' + type;
  el.textContent = msg;
  el.style.display = 'block';
  setTimeout(function() { el.style.display = 'none'; }, 4000);
}

// ----- PIN Enter Key -----
document.getElementById('pinInput').addEventListener('keyup', function(e) {
  if (e.key === 'Enter') verifyPin();
});

// ----- Init -----
(function() {
  applyAdminLang();
  setupPhotoPreview();
  // Auto-login if PIN is saved
  if (adminPin) {
    fetch('api/admin.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'verify_pin', pin: adminPin })
    })
    .then(function(r) { return r.json(); })
    .then(function(res) {
      if (res.success) showPanel();
      else adminLogout();
    })
    .catch(function() { /* stay on login */ });
  }
})();
