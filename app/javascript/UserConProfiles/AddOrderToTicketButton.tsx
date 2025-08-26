import { useContext, useMemo } from 'react';
import { useModal } from '@neinteractiveliterature/litform';

import AppRootContext from '../AppRootContext';
import { Money, OrderStatus, Product, Ticket, TicketType, UserConProfile } from '../graphqlTypes.generated';
import { useTranslation } from 'react-i18next';
import NewOrderModal from 'Store/OrderAdmin/NewOrderModal';

export type AddOrderToTicketButtonProps = {
  className?: string;
  ticket: Pick<Ticket, 'id'> & {
    ticket_type: Pick<TicketType, 'id'>;
  };
  convention: {
    ticket_types: {
      id: string;
      providing_products: (Pick<Product, 'id' | 'name' | '__typename'> & {
        pricing_structure?: null | {
          price?: Money | null;
        };
      })[];
    }[];
  };
  userConProfile: Pick<UserConProfile, 'id' | '__typename' | 'name_without_nickname'>;
};

function AddOrderToTicketButton({
  ticket,
  userConProfile,
  convention,
  className,
}: AddOrderToTicketButtonProps): React.JSX.Element {
  const { t } = useTranslation();
  const newOrderModal = useModal();
  const { myProfile, defaultCurrencyCode } = useContext(AppRootContext);

  const providingProduct = useMemo(() => {
    if (!ticket.id) {
      return null;
    }

    const ticketType = convention.ticket_types.find((tt) => tt.id === ticket.ticket_type.id);
    return (ticketType?.providing_products ?? [])[0];
  }, [ticket, convention]);

  if (!providingProduct) {
    return <></>;
  }

  return (
    <>
      <button className={className || 'btn btn-outline-primary'} onClick={newOrderModal.open} type="button">
        {t('admin.userConProfiles.addOrderToTicket.buttonText')}
      </button>
      <NewOrderModal
        visible={newOrderModal.visible}
        close={newOrderModal.close}
        initialOrder={{
          user_con_profile: userConProfile,
          payment_amount: providingProduct.pricing_structure?.price ?? {
            __typename: 'Money',
            currency_code: defaultCurrencyCode,
            fractional: 0,
          },
          status: OrderStatus.Paid,
          payment_note: t('admin.userConProfiles.addOrderToTicket.defaultPaymentNote', {
            adminName: myProfile?.name_without_nickname,
          }),
          coupon_applications: [],
          order_entries: [
            {
              generatedId: 'ticket',
              product: providingProduct,
              product_variant: null,
              quantity: 1,
              price_per_item: providingProduct.pricing_structure?.price ?? {
                __typename: 'Money',
                currency_code: defaultCurrencyCode,
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
