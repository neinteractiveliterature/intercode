import { ApolloError, useApolloClient } from '@apollo/client';
import { ErrorDisplay, LoadingIndicator } from '@neinteractiveliterature/litform';
import { useContext, useState } from 'react';
import Modal from 'react-bootstrap4-modal';
import { useTranslation } from 'react-i18next';
import AppRootContext from '../../AppRootContext';
import { Run, Signup } from '../../graphqlTypes.generated';
import { LazyStripeElementsContainer } from '../../LazyStripe';
import TicketPurchaseForm, { TicketPurchaseFormProps } from '../../MyTicket/TicketPurchaseForm';
import { useDeleteOrderEntryMutation } from '../../Store/mutations.generated';
import { OrderPaymentModalContents, OrderPaymentModalContentsProps } from '../../Store/OrderPaymentModal';
import { useHumanizeTime, useISODateTimeInAppZone } from '../../TimeUtils';
import useAsyncFunction from '../../useAsyncFunction';

export type EventTicketPurchaseModalProps = {
  visible: boolean;
  close: () => void;
  availableProducts: TicketPurchaseFormProps['availableProducts'];
  eventTitle: string;
  run?: Pick<Run, 'id'>;
  signup?: Pick<Signup, 'expires_at'>;
};

export default function EventTicketPurchaseModal({
  visible,
  close,
  availableProducts,
  eventTitle,
  run,
  signup,
}: EventTicketPurchaseModalProps) {
  const { t } = useTranslation();
  const { ticketName } = useContext(AppRootContext);
  const [orderEntry, setOrderEntry] = useState<{ id: string; order: OrderPaymentModalContentsProps['order'] }>();
  const [deleteOrderEntry] = useDeleteOrderEntryMutation();
  const apolloClient = useApolloClient();
  const humanizeTime = useHumanizeTime();
  const expiresAt = useISODateTimeInAppZone(signup?.expires_at ?? '');

  const cancel = async () => {
    if (orderEntry) {
      await deleteOrderEntry({ variables: { input: { id: orderEntry.id } } });
      await apolloClient.resetStore();
    }

    close();
  };
  const [cancelAsync, cancelError, cancelInProgress] = useAsyncFunction(cancel);

  const complete = async () => {
    await apolloClient.resetStore();
    close();
  };

  return (
    <Modal visible={visible} dialogClassName="modal-lg">
      <div className="modal-header">
        {t('signups.eventTicketPurchase.title', 'Your {{ ticketName }} for {{ eventTitle }}', {
          ticketName,
          eventTitle,
        })}
      </div>
      <div className="modal-body">
        {signup?.expires_at && (
          <div className="alert alert-info">
            {t(
              'signups.eventTicketPurchase.spotHeldUntil',
              'Your spot is being held.  You have until {{ expiresAt }} to purchase a {{ ticketName }}.',
              { ticketName, expiresAt: humanizeTime(expiresAt) },
            )}
          </div>
        )}
        {orderEntry ? (
          <LazyStripeElementsContainer>
            <OrderPaymentModalContents onCancel={cancelAsync} onComplete={complete} order={orderEntry.order} />
          </LazyStripeElementsContainer>
        ) : (
          <TicketPurchaseForm run={run} availableProducts={availableProducts} onAddedToCart={setOrderEntry} />
        )}
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={cancelAsync}>
          {cancelInProgress ? <LoadingIndicator /> : t('buttons.cancel', 'Cancel')}
        </button>
        <ErrorDisplay graphQLError={cancelError as ApolloError | null} />
      </div>
    </Modal>
  );
}
