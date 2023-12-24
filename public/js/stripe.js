/* eslint-disable */
import axios from 'axios';
const stripe = Stripe('pk_test_kJB2ti8sbTV6lS0qTvilKy5R');
import { showAlert } from './alert';

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout section
    const session = await axios.get(
      `/api/v1/bookings/checkout-session/${tourId}`,
    );
    console.log(session);
    // 2) Create checkout form + chare credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.section.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err.data.response.message);
  }
};
