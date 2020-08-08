import React, { useContext, useMemo } from 'react';

import NewOrderModal from '../Store/NewOrderModal';
import useModal from '../ModalDialogs/useModal';
import AppRootContext from '../AppRootContext';
import { Money } from '../graphqlTypes.generated';

export type AddOrderToTicketButtonProps = {
  className?: string;
  ticket: {
    id: number;
    ticket_type: {
      id: number;
    };
  };
  convention: {
    ticket_types: {
      id: number;
      providing_products: {
        pricing_structure: {
          price: Money;
        };
      }[];
    }[];
  };
  userConProfile: {};
};

function AddOrderToTicketButton({
  ticket,
  userConProfile,
  convention,
  className,
}: AddOrderToTicketButtonProps) {
  const newOrderModal = useModal();
  const { myProfile } = useContext(AppRootContext);

  const providingProduct = useMemo(() => {
    if (!ticket.id) {
      return null;
    }

    const ticketType = convention.ticket_types.find((tt) => tt.id === ticket.ticket_type.id);
    return (ticketType?.providing_products ?? [])[0];
  }, [ticket, convention]);

  if (!providingProduct) {
    return null;
  }

  return (
    <>
      <button
        className={className || 'btn btn-outline-primary'}
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
          payment_note: `Entered manually by ${myProfile!.name_without_nickname}`,
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

export default AddOrderToTicketButton;
