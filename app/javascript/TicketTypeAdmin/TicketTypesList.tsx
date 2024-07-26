import { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  LoadQueryWrapper,
  ErrorDisplay,
  useConfirm,
  useDeleteMutationWithReferenceArrayUpdater,
  useModal,
} from '@neinteractiveliterature/litform';
import capitalize from 'lodash/capitalize';
import { v4 as uuidv4 } from 'uuid';

import sortTicketTypes from './sortTicketTypes';
import usePageTitle from '../usePageTitle';
import { describeAdminPricingStructure } from '../Store/describePricingStructure';
import { AdminTicketTypesQueryData, EventTicketTypesQueryData } from './queries.generated';
import { useDeleteTicketTypeMutation } from './mutations.generated';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import AppRootContext from '../AppRootContext';
import { useTicketTypesQueryFromRoute } from './useTicketTypesQueryFromRoute';
import { useDeleteProductMutation } from '../Store/mutations.generated';
import { PricingStrategy } from '../graphqlTypes.generated';
import { ModalData } from '@neinteractiveliterature/litform/dist/useModal';
import NewTicketProvidingProductModal from './NewTicketProvidingProductModal';
import EditTicketProvidingProductModal, {
  EditTicketProvidingProductModalProps,
} from './EditTicketProvidingProductModal';

type TicketTypeType = AdminTicketTypesQueryData['convention']['ticket_types'][0];

function cardClassForTicketType(ticketType: TicketTypeType) {
  if (ticketType.providing_products.filter((product) => product.available).length > 0) {
    return '';
  }

  if (ticketType.maximum_event_provided_tickets > 0) {
    // eslint-disable-next-line i18next/no-literal-string
    return 'bg-info-light';
  }

  // eslint-disable-next-line i18next/no-literal-string
  return 'bg-dark text-white';
}

function describeTicketTypeOptions(
  ticketType: TicketTypeType,
  ticketName: string,
  ticketNamePlural: string,
  t: TFunction,
) {
  let eventProvidedDescription: string | undefined;
  if (ticketType.maximum_event_provided_tickets > 0) {
    eventProvidedDescription = t('admin.ticketTypes.eventProvidedDescription', {
      count: ticketType.maximum_event_provided_tickets,
      ticketName: ticketType.maximum_event_provided_tickets === 1 ? ticketName : ticketNamePlural,
    });
  }

  if (eventProvidedDescription != null) {
    return capitalize(eventProvidedDescription);
  }

  return null;
}

export function buildBlankProduct(currencyCode: string) {
  return {
    // eslint-disable-next-line i18next/no-literal-string
    __typename: 'Product' as const,
    available: true,
    delete_variant_ids: [],
    generatedId: uuidv4(),
    name: '',
    // eslint-disable-next-line i18next/no-literal-string
    payment_options: ['stripe'],
    product_variants: [],
    pricing_structure: {
      // eslint-disable-next-line i18next/no-literal-string
      __typename: 'PricingStructure' as const,
      pricing_strategy: PricingStrategy.Fixed,
      // eslint-disable-next-line i18next/no-literal-string
      value: { __typename: 'Money' as const, currency_code: currencyCode, fractional: 0 },
    },
  };
}

function TicketTypeDisplay({
  parent,
  ticketType,
  newProductModal,
  editProductModal,
}: {
  parent: EventTicketTypesQueryData['convention']['event'] | AdminTicketTypesQueryData['convention'];
  ticketType: TicketTypeType;
  newProductModal: ModalData<{ ticketType: TicketTypeType }>;
  editProductModal: ModalData<EditTicketProvidingProductModalProps['state']>;
}) {
  const { ticketName, ticketNamePlural, defaultCurrencyCode } = useContext(AppRootContext);
  const { t } = useTranslation();
  const confirm = useConfirm();
  const [deleteTicketType] = useDeleteMutationWithReferenceArrayUpdater(
    useDeleteTicketTypeMutation,
    parent,
    'ticket_types',
    (ticketType) => ({ input: { id: ticketType.id } }),
  );
  const [deleteProduct] = useDeleteMutationWithReferenceArrayUpdater(
    useDeleteProductMutation,
    ticketType,
    'providing_products',
    (product) => ({ id: product.id }),
  );

  return (
    <div className={`card my-4 overflow-hidden ${cardClassForTicketType(ticketType)}`} key={ticketType.id}>
      <div className="card-header">
        <div className="row">
          <div className="col-md-8">
            <strong>{ticketType.description}</strong>
            <code> ({ticketType.name})</code>
          </div>
          <div className="col-md-4 text-end">
            <button
              type="button"
              className="btn btn-danger btn-sm mx-1"
              onClick={() =>
                confirm({
                  prompt: `Are you sure you want to delete the ticket type “${ticketType.description}”?`,
                  action: () => deleteTicketType(ticketType),
                  renderError: (error) => <ErrorDisplay graphQLError={error} />,
                })
              }
            >
              <i className="bi-trash me-1" />
              {t('buttons.delete')}
            </button>
            <Link to={`${ticketType.id}/edit`} className="btn btn-secondary btn-sm mx-1">
              <i className="bi-pencil-square me-1" />
              {t('buttons.edit')}
            </Link>
          </div>
        </div>

        <div className="small font-italic">
          {describeTicketTypeOptions(ticketType, ticketName ?? 'ticket', ticketNamePlural ?? 'tickets', t)}
          {!ticketType.counts_towards_convention_maximum && (
            <div>{t('admin.ticketTypes.doesNotCountTowardsConventionMaximum')}</div>
          )}
          {!ticketType.allows_event_signups && <div>{t('admin.ticketTypes.doesNotAllowEventSignups')}</div>}
        </div>
      </div>
      <div className="card-body bg-white text-body">
        <p>
          <strong>{t('admin.ticketTypes.providingProducts.header')}</strong>
        </p>
        {ticketType.providing_products.length > 0 ? (
          <table className="table table-striped">
            <tbody>
              {ticketType.providing_products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>
                    {product.available ? (
                      <div className="badge bg-success">
                        <i className="bi-check-lg" /> {t('admin.ticketTypes.providingProducts.available')}
                      </div>
                    ) : (
                      <div className="badge bg-secondary">
                        <i className="bi-x-lg" /> {t('admin.ticketTypes.providingProducts.unavailable')}
                      </div>
                    )}
                  </td>
                  <td>{describeAdminPricingStructure(product.pricing_structure, t)}</td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-danger me-2"
                      onClick={() =>
                        confirm({
                          prompt: `Are you sure you want to delete the product “${product.name}”?`,
                          action: () => deleteProduct(product),
                          renderError: (error) => <ErrorDisplay graphQLError={error} />,
                        })
                      }
                    >
                      <i className="bi-trash" />
                      <span className="visually-hidden">{t('buttons.delete')}</span>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() =>
                        editProductModal.open({
                          ticketType,
                          initialProduct: { ...buildBlankProduct(defaultCurrencyCode), ...product },
                        })
                      }
                    >
                      {t('buttons.edit')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          t('admin.ticketTypes.providingProducts.none', { ticketName })
        )}
        <div>
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => newProductModal.open({ ticketType })}
          >
            {t('admin.tickets.createProduct')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoadQueryWrapper(useTicketTypesQueryFromRoute, function TicketTypesList({ data }) {
  const { t } = useTranslation();
  const { ticketName } = useContext(AppRootContext);
  const event = 'event' in data.convention ? data.convention.event : undefined;

  usePageTitle(`${capitalize(ticketName)} types${event ? ` - ${event.title}` : ''}`);

  const newProductModal = useModal<{ ticketType: TicketTypeType }>();
  const editProductModal = useModal<EditTicketProvidingProductModalProps['state']>();

  const sortedTicketTypes = useMemo(
    () =>
      'ticket_types' in data.convention
        ? sortTicketTypes(data.convention.ticket_types)
        : sortTicketTypes(data.convention.event.ticket_types),
    [data.convention],
  );

  return (
    <div>
      <h1 className="mb-4">{event ? `${event.title} ${ticketName}` : capitalize(ticketName)} types</h1>

      {sortedTicketTypes.map((ticketType) => (
        <TicketTypeDisplay
          key={ticketType.id}
          parent={'ticket_types' in data.convention ? data.convention : data.convention.event}
          newProductModal={newProductModal}
          editProductModal={editProductModal}
          ticketType={ticketType}
        />
      ))}

      <Link to="new" className="btn btn-primary">
        {t('admin.ticketTypes.newButton', { ticketName })}
      </Link>

      <NewTicketProvidingProductModal
        visible={newProductModal.visible}
        close={newProductModal.close}
        ticketType={newProductModal.state?.ticketType}
      />

      <EditTicketProvidingProductModal
        visible={editProductModal.visible}
        close={editProductModal.close}
        state={editProductModal.state}
      />
    </div>
  );
});
