import CartProduct from './CartProduct.js';
import { select, settings, classNames, templates } from './settings.js';
import utils from './utils.js';

class Cart {
  constructor(element) {
    const thisCart = this;

    thisCart.products = [];

    thisCart.getElements(element);
    thisCart.initActions();

    console.log('new Cart', thisCart);
  }

  getElements(element) {
    const thisCart = this;

    thisCart.dom = {};

    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
    thisCart.dom.deliveryFee = thisCart.dom.wrapper.querySelector(select.cart.deliveryFee);
    thisCart.dom.subtotalPrice = thisCart.dom.wrapper.querySelector(select.cart.subtotalPrice);
    thisCart.dom.totalPrice = thisCart.dom.wrapper.querySelectorAll(select.cart.totalPrice);
    thisCart.dom.totalNumber = thisCart.dom.wrapper.querySelector(select.cart.totalNumber);
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
  }

  initActions() {
    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener('click', function () {
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });
    thisCart.dom.productList.addEventListener('updated', function () {
      thisCart.update();
    });

    thisCart.dom.productList.addEventListener('remove', function (event) {
      const cartProduct = event.detail.cartProduct;

      thisCart.remove(cartProduct);
    });

    thisCart.dom.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisCart.sendOrder();
    });
  }

  update() {
    const thisCart = this;

    // zdefiniowanie stałej deliveryFee
    const deliveryFee = settings.cart.defaultDeliveryFee;

    // inicjalizacja zmiennych pomocniczych
    let totalNumber = 0;
    let subtotalPrice = 0;

    // pętla for...of po wszystkich produktach w koszyku
    for (let product of thisCart.products) {
      totalNumber += product.amount;
      subtotalPrice += product.price;
    }

    // przypisanie aktualnej wartości subtotalPrice do właściwości obiektu thisCart
    thisCart.subtotalPrice = subtotalPrice;

    // dodanie kosztu dostawy, jeśli są jakieś produkty w koszyku
    if (totalNumber > 0) {
      thisCart.totalPrice = subtotalPrice + deliveryFee;
    } else {
      thisCart.totalPrice = 0;
    }

    // aktualizacja wartości właściwości HTML koszyka
    thisCart.dom.totalNumber.textContent = totalNumber;
    thisCart.dom.subtotalPrice.textContent = subtotalPrice;
    for (let totalPriceElement of thisCart.dom.totalPrice) {
      totalPriceElement.textContent = thisCart.totalPrice;
    }
    thisCart.dom.deliveryFee.textContent = deliveryFee;

    console.log('totalNumber', totalNumber);
    console.log('subtotalPrice', subtotalPrice);
    console.log('thisCart.totalPrice', thisCart.totalPrice);
  }

  sendOrder() {
    const thisCart = this;

    const url = settings.db.url + '/' + settings.db.orders;
    const payload = {
      address: thisCart.dom.form.querySelector(select.cart.address).value,
      phone: thisCart.dom.form.querySelector(select.cart.phone).value,
      totalPrice: thisCart.totalPrice,
      subtotalPrice: thisCart.subtotalPrice,
      totalNumber: thisCart.dom.totalNumber.textContent,
      deliveryFee: thisCart.dom.deliveryFee.textContent,
      products: [],
    };

    for (let prod of thisCart.products) {
      payload.products.push(prod.getData());
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options)
      .then(function (response) {
        return response.json();
      })
      .then(function (parsedResponse) {
        console.log('parsedResponse', parsedResponse);
      });
  }

  add(menuProduct) {
    const thisCart = this;

    /* wygeneruj kod HTML na podstawie szablonu */
    const generatedHTML = templates.cartProduct(menuProduct);
    /* stwórz element DOM z kodu HTML */
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    /* znajdź kontener dla listy produktów */
    const productListContainer = thisCart.dom.productList;
    /* dodaj element do kontenera */
    productListContainer.appendChild(generatedDOM);

    console.log('adding product', menuProduct);

    const cartProduct = new CartProduct(menuProduct, generatedDOM);
    thisCart.products.push(cartProduct);
    thisCart.update();
    console.log('thisCart.products', thisCart.products);
  }

  remove(cartProduct) {
    const thisCart = this;
    const productIndex = thisCart.products.indexOf(cartProduct);

    if (productIndex !== -1) {
      thisCart.products.splice(productIndex, 1);
      cartProduct.dom.wrapper.remove();
      thisCart.update();
    }
  }
}

export default Cart;