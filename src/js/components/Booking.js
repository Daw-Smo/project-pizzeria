import {templates, select} from '../settings.js';
import AmountWidget from './AmountWidget.js';

class Booking {
  constructor(element) {
    const thisBooking = this;

    thisBooking.render(element);
    thisBooking.initWidgets();
  }

  render(element){
    const thisBooking = this;

    /* generate HTML using template */
    const generatedHTML = templates.bookingWidget();

    /* create empty object thisBooking.dom */
    thisBooking.dom = {};

    /* add wrapper property to thisBooking.dom and assign the wrapper element */
    thisBooking.dom.wrapper = element;

    /* change the content of the wrapper to the generated HTML */
    thisBooking.dom.wrapper.innerHTML = generatedHTML;

    /* assign properties for people and hours amount inputs */
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
  }

  initWidgets(){
    const thisBooking = this;

    /* create new instances of amount widgets */
    thisBooking.peopleAmountWidget = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmountWidget = new AmountWidget(thisBooking.dom.hoursAmount);

    /* add listeners to the amount widgets */
    thisBooking.dom.peopleAmount.addEventListener('updated', function(){
      // do nothing for now
    });

    thisBooking.dom.hoursAmount.addEventListener('updated', function(){
      // do nothing for now
    });
  }
}

export default Booking;
