import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

import NewOrderModal from '../Store/NewOrderModal';
import useModal from '../ModalDialogs/useModal';
import AppRootContext from '../AppRootContext';

function AddOrderToTicketButton({ ticket, userConProfile, convention }) {
  const newOrderModal = useModal();
  const { myProfile } = useContext(AppRootContext);

  const providingProduct = useMemo(
    () => {
      if (!ticket.id) {
        return null;
      }

      const ticketType = convention.ticket_types.find((tt) => tt.id === ticket.ticket_type.id);
      return (ticketType.providing_products ?? [])[0];
    },
    [ticket, convention],
  );

  if (!providingProduct) {
    return null;
  }

  return (
    <>
      <button
        className="btn btn-outline-primary"
        onClick={newOrderModal.open}
        type="button"
      >
        Add order
      </button>
      <NewOrderModal
        visible={newOrderModal.visible}
        close={newOrderModal.close}
        initialOrder={{
          user_con_profile: userConProfile,
          payment_amount: providingProduct.pricing_structure.price,
          status: 'paid',
          payment_note: `Entered manually by ${myProfile.name_without_nickname}`,
          order_entries: [
            {
              generatedId: 'ticket',
              product: providingProduct,
              product_variant: null,
              quantity: 1,
              price_per_item: providingProduct.pricing_structure.price,
              ticket_id: ticket.id,
            },
          ],
        }}
      />
    </>
  );
}

AddOrderToTicketButton.propTypes = {
  ticket: PropTypes.shape({
    id: PropTypes.number,
    ticket_type: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  convention: PropTypes.shape({
    ticket_types: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  }).isRequired,
  userConProfile: PropTypes.shape({}).isRequired,
};

export default AddOrderToTicketButton;
