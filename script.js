let selectedType = "";
let cart = [];

const modal = document.getElementById('modal');
const carpetTypeEl = document.getElementById('carpetType');
const toast = document.getElementById('toast');
const headerCartBtn = document.getElementById('headerCartBtn');
const cartCountEl = document.getElementById('cartCount');
const cartPanel = document.getElementById('cartPanel');
const panelList = document.getElementById('panelCartItems');

function openModal(type) {
  selectedType = type;
  if(carpetTypeEl) carpetTypeEl.innerText = type;
  if(modal) modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  if(modal) modal.setAttribute('aria-hidden', 'true');
}

if(modal) {
  modal.addEventListener('click', (e) => {
    // Check if clicked strictly on backdrop or modal wrapper
    if (e.target.classList.contains('modal-backdrop') || e.target === modal) {
      closeModal();
    }
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    closeCartPanel();
  }
});

function showToast(text, ms = 2500) {
  if(!toast) return;
  toast.textContent = text;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), ms);
}

function addToCart() {
  const lengthVal = document.getElementById('length').value;
  const widthVal = document.getElementById('width').value;
  const quantityVal = document.getElementById('quantity').value;
  const shapeEl = document.querySelector('input[name="shape"]:checked');

  const length = Number(lengthVal);
  const width = Number(widthVal);
  const quantity = Number(quantityVal);
  const shape = shapeEl ? shapeEl.value : '';

  if (!lengthVal || isNaN(length) || length <= 0 || !widthVal || isNaN(width) || width <= 0) {
    showToast('⚠️ يرجى إدخال الأبعاد بشكل صحيح');
    return;
  }

  if (!quantityVal || isNaN(quantity) || quantity < 1) {
    showToast('⚠️ أقل كمية هي 1');
    return;
  }

  if (!shape) {
    showToast('⚠️ يرجى اختيار الشكل');
    return;
  }

  cart.push({ selectedType, length, width, quantity, shape });
  updateCart();
  closeModal();
  showToast('✅ تمت الإضافة للسلة بنجاح');
  
  // Reset inputs
  document.getElementById('length').value = '';
  document.getElementById('width').value = '';
  document.getElementById('quantity').value = '1';
  if (shapeEl) document.querySelector('input[name="shape"][value="دائري"]').checked = true;
}

function updateCart() {
  if (panelList) {
    panelList.innerHTML = '';
    
    if (cart.length === 0) {
      panelList.innerHTML = '<li style="text-align:center; padding:20px; color:#666">السلة فارغة حالياً</li>';
    }

    cart.forEach((item, idx) => {
      const li = document.createElement('li');
      li.className = 'panel-item';

      const info = document.createElement('div');
      info.className = 'item-info';
      // Format: Type on one line, details on next
      info.innerHTML = `<strong style="color:#fff">${item.selectedType}</strong><br>
                        <span style="font-size:12px; opacity:0.7">${item.length}م × ${item.width}م | شكل: ${item.shape || '–'} | عدد: ${item.quantity}</span>`;

      const btn = document.createElement('button');
      btn.className = 'item-remove';
      btn.type = 'button';
      btn.innerText = 'حذف';
      btn.onclick = (e) => {
        e.stopPropagation();
        removeCartItem(idx);
      };

      li.appendChild(info);
      li.appendChild(btn);
      panelList.appendChild(li);
    });
  }

  if (cartCountEl) {
    cartCountEl.textContent = cart.length;
    // Animate badge
    cartCountEl.style.transform = 'scale(1.2)';
    setTimeout(() => cartCountEl.style.transform = 'scale(1)', 200);
  }
}

function removeCartItem(index){
  if (index < 0 || index >= cart.length) return;
  cart.splice(index,1);
  updateCart();
  showToast('تم حذف العنصر');
}

function toggleCartPanel(){
  if (!cartPanel) return;
  const open = cartPanel.getAttribute('aria-hidden') === 'false';
  if(open) closeCartPanel();
  else cartPanel.setAttribute('aria-hidden', 'false');
}

function closeCartPanel(){
  if (!cartPanel) return;
  cartPanel.setAttribute('aria-hidden','true');
}

if (headerCartBtn) headerCartBtn.addEventListener('click', toggleCartPanel);

function sendWhatsApp() {
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const address = document.getElementById('address').value.trim();

  if (!name || !phone) {
    showToast('⚠️ يرجى كتابة الاسم ورقم الهاتف');
    return;
  }

  if (cart.length === 0) {
    showToast('⚠️ السلة فارغة، اختر زربية أولاً');
    return;
  }

  let message = `*طلب جديد - رويال كلين* ✨\n\n`;
  message += `*العميل:* ${name}\n`;
  message += `*الهاتف:* ${phone}\n`;
  message += `*العنوان:* ${address}\n\n`;
  message += `*--- الطلبات ---*\n`;
  
  cart.forEach((item, index) => {
    message += `${index + 1}. ${item.selectedType}\n   📏 ${item.length}×${item.width}م | الشكل: ${item.shape || 'غير محدد'} | العدد: ${item.quantity}\n`;
  });

  const phoneNumber = '213666530413'; // استبدل برقمك
  window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
}