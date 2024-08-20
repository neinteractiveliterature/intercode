import { ApolloError, useSuspenseQuery } from '@apollo/client';
import { ErrorDisplay, LoadingIndicator } from '@neinteractiveliterature/litform';
import { useContext, useState } from 'react';
import Modal from 'react-bootstrap4-modal';
import { useTranslation } from 'react-i18next';
import AppRootContext from '../../AppRootContext';
import { Run, Signup } from '../../graphqlTypes.generated';
import { LazyStripeElementsContainer } from '../../LazyStripe';
import TicketPurchaseForm, { TicketPurchaseFormProps } from '../../MyTicket/TicketPurchaseForm';
import { OrderPaymentModalContents, OrderPaymentModalContentsProps } from '../../Store/OrderPaymentModal';
import { useHumanizeTime, useISODateTimeInAppZone } from '../../TimeUtils';
import useAsyncFunction from '../../useAsyncFunction';
import { CurrentPendingOrderPaymentIntentClientSecretQueryDocument } from '../../Store/queries.generated';
import { DeleteOrderEntryDocument } from '../../Store/mutations.generated';
import { client } from '../../useIntercodeApolloClient';

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
  const humanizeTime = useHumanizeTime();
  const expiresAt = useISODateTimeInAppZone(signup?.expires_at ?? '');
  const { data, error } = useSuspenseQuery(CurrentPendingOrderPaymentIntentClientSecretQueryDocument);

  const cancel = async () => {
    if (orderEntry) {
      await client.mutate({ mutation: DeleteOrderEntryDocument, variables: { input: { id: orderEntry.id } } });
      await client.resetStore();
    }

    close();
  };
  const [cancelAsync, cancelError, cancelInProgress] = useAsyncFunction(cancel);

  const complete = async () => {
    await client.resetStore();
    close();
  };

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <Modal visible={visible} dialogClassName="modal-lg">
      <div className="modal-header">
        {t('signups.eventTicketPurchase.title', {
          ticketName,
          eventTitle,
        })}
      </div>
      <div className="modal-body">
        {signup?.expires_at && (
          <div className="alert alert-info">
            {t('signups.eventTicketPurchase.spotHeldUntil', { ticketName, expiresAt: humanizeTime(expiresAt) })}
          </div>
        )}
        {orderEntry ? (
          <LazyStripeElementsContainer
            options={{ clientSecret: data.convention.my_profile?.current_pending_order?.payment_intent_client_secret }}
          >
            <OrderPaymentModalContents onCancel={cancelAsync} onComplete={complete} order={orderEntry.order} />
          </LazyStripeElementsContainer>
        ) : (
          <TicketPurchaseForm run={run} availableProducts={availableProducts} onAddedToCart={setOrderEntry} />
        )}
      </div>
      <div className="modal-footer">
        {!orderEntry && (
          <button type="button" className="btn btn-secondary" onClick={cancelAsync}>
            {cancelInProgress ? <LoadingIndicator /> : t('buttons.cancel')}
          </button>
        )}
        <ErrorDisplay graphQLError={cancelError as ApolloError | null} />
      </div>
    </Modal>
  );
}
