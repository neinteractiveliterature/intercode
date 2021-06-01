import { useContext, useMemo } from 'react';
import { useModal } from '@neinteractiveliterature/litform';

import NewOrderModal from '../Store/NewOrderModal';
import AppRootContext from '../AppRootContext';
import { Money, OrderStatus, Product, UserConProfile } from '../graphqlTypes.generated';

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
      providing_products: (Pick<Product, 'id' | 'name' | '__typename'> & {
        pricing_structure?: null | {
          price?: Money | null;
        };
      })[];
    }[];
  };
  userConProfile: Pick<UserConProfile, 'id' | 'name_without_nickname'>;
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
          payment_amount: providingProduct.pricing_structure?.price ?? {
            __typename: 'Money',
            currency_code: 'USD',
            fractional: 0,
          },
          status: OrderStatus.Paid,
          payment_note: `Entered manually by ${myProfile!.name_without_nickname}`,
          coupon_applications: [],
          order_entries: [
            {
              generatedId: 'ticket',
              product: providingProduct,
              product_variant: null,
              quantity: 1,
              price_per_item: providingProduct.pricing_structure?.price ?? {
                __typename: 'Money',
                currency_code: 'USD',
                fractional: 0,
              },
              ticket_id: ticket.id,
            },
          ],
        }}
      />
    </>
  );
}

export default AddOrderToTicketButton;
