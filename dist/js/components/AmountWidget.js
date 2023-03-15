import { select, settings } from '../settings.js';

class AmountWidget {
  constructor(element) {
    const thisWidget = this;

    thisWidget.getElements(element);
    thisWidget.setValue(thisWidget.input.value);
    thisWidget.initActions();

    console.log('AmountWidget:', thisWidget);
    console.log('constructor arguments:', element);
  }

  getElements(element) {
    const thisWidget = this;

    thisWidget.element = element;
    thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
    thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
  }

  setValue(value) {
    const thisWidget = this;

    const newValue = parseInt(value);

    /* TODO: Add validation */
    if (thisWidget.value !== newValue && !isNaN(newValue)) {
      if (newValue < settings.amountWidget.defaultMin) {
        thisWidget.value = settings.amountWidget.defaultMin;
      } else if (newValue > settings.amountWidget.defaultMax) {
        thisWidget.value = settings.amountWidget.defaultMax;
      } else {
        thisWidget.value = newValue;
      }
      thisWidget.announce();
    }

    thisWidget.input.value = thisWidget.value;

  }

  announce() {
    const thisWidget = this;

    const event = new CustomEvent('updated', {
      bubbles: true
    });
    thisWidget.element.dispatchEvent(event);
  }

  initActions() {
    let previousValue = this.value;

    this.input.addEventListener('change', () => {
      this.setValue(event.target.value);
    });

    this.input.addEventListener('blur', () => {
      const currentValue = parseInt(this.input.value);
      if (isNaN(currentValue)) {
        this.setValue(previousValue);
      } else {
        previousValue = currentValue;
      }
    });

    this.linkDecrease.addEventListener('click', (event) => {
      event.preventDefault();
      this.setValue(this.value - 1);
    });

    this.linkIncrease.addEventListener('click', (event) => {
      event.preventDefault();
      this.setValue(this.value + 1);
    });
  }
}

export default AmountWidget;