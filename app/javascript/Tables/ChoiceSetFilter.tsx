import { useMemo, useState, ReactNode } from 'react';
import classNames from 'classnames';
import { size, type SizeOptions } from '@floating-ui/react-dom';
import { useTranslation } from 'react-i18next';
import { ChoiceSet, useLitformFloatingWithAutoClosing, useToggleOpen } from '@neinteractiveliterature/litform';

import { FilterCodec } from './FilterUtils';
import { type AppColumn } from './tableFeatures';

export type ChoiceSetFilterChoice = {
  label: string;
  value: string;
  disabled?: boolean;
};

function choiceHasValue(
  choice: Omit<ChoiceSetFilterChoice, 'value'> & { value: string | null | undefined },
): choice is ChoiceSetFilterChoice {
  return choice.value != null;
}

function sortChoices(choices: readonly ChoiceSetFilterChoice[]) {
  return [...choices].sort(({ label: labelA }, { label: labelB }) =>
    labelA.localeCompare(labelB, undefined, { sensitivity: 'base' }),
  );
}

type ChoiceSetFilterValue = ChoiceSetFilterChoice['value'];

type LenientFilterProps<TData extends Record<string, unknown>, TValue> = {
  column: Pick<AppColumn<TData, TValue>, 'getFilterValue' | 'setFilterValue'>;
};

type ChoiceSetFilterCommonProps<TData extends Record<string, unknown>, TValue> = LenientFilterProps<TData, TValue> & {
  choices: readonly ChoiceSetFilterChoice[];
  filterCodec?: FilterCodec<ChoiceSetFilterValue>;
};

export type ChoiceSetFilterSingleProps<TData extends Record<string, unknown>, TValue> = ChoiceSetFilterCommonProps<
  TData,
  TValue
> & {
  multiple: false;
  renderHeaderCaption?: (value: ChoiceSetFilterValue) => ReactNode;
};

export type ChoiceSetFilterMultipleProps<TData extends Record<string, unknown>, TValue> = ChoiceSetFilterCommonProps<
  TData,
  TValue
> & {
  multiple: true;
  hideSelectNone?: boolean;
  renderHeaderCaption?: (value: ChoiceSetFilterValue[]) => ReactNode;
};

export type ChoiceSetFilterProps<TData extends Record<string, unknown>, TValue> =
  ChoiceSetFilterSingleProps<TData, TValue> | ChoiceSetFilterMultipleProps<TData, TValue>;

function ChoiceSetFilter<TData extends Record<string, unknown>, TValue>(
  props: ChoiceSetFilterProps<TData, TValue>,
): React.JSX.Element {
  const { choices: rawChoices, column, multiple, ...otherProps } = props;
  // (call the column's methods on the column, rather than taking them out of it: they need to know which column they
  // belong to.  And it's the filter value itself, not the method that reads it, that the memo below depends on.)
  const currentFilterValue = column.getFilterValue();
  const setFilterValue = (value: unknown) => column.setFilterValue(value);
  const { t } = useTranslation();
  const [dropdownButton, setDropdownButton] = useState<HTMLDivElement | null>(null);
  const [dropdownMenu, setDropdownMenu] = useState<HTMLDivElement | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const middleware = useMemo(() => {
    const sizeOptions: SizeOptions = {
      apply({ rects, elements }) {
        Object.assign(elements.floating.style, { minWidth: `${rects.reference.width}px` });
      },
    };
    return [size(sizeOptions)];
  }, []);

  const { styles, attributes, update } = useLitformFloatingWithAutoClosing(
    dropdownMenu,
    dropdownButton,
    undefined,
    setDropdownOpen,
    {
      placement: 'bottom-start',
      offset: -3,
      middleware,
    },
  );

  const toggleOpen = useToggleOpen(setDropdownOpen, update);

  const filterValue = useMemo(() => {
    const filterCodec = props.filterCodec;
    if (props.multiple) {
      const rawFilterValue = (currentFilterValue ?? []) as (string | undefined)[];
      if (filterCodec) {
        return rawFilterValue.map((singleValue) => filterCodec.encode(singleValue)?.toString());
      } else {
        return rawFilterValue.map((singleValue) => singleValue?.toString());
      }
    } else {
      const rawFilterValue = (currentFilterValue ?? undefined) as string | undefined;
      if (filterCodec) {
        return filterCodec.encode(rawFilterValue)?.toString();
      } else {
        return rawFilterValue?.toString();
      }
    }
  }, [currentFilterValue, props.filterCodec, props.multiple]);

  const choices = useMemo(() => {
    const filterCodec = props.filterCodec;
    if (filterCodec) {
      return sortChoices(
        rawChoices
          .map((choice) => ({
            ...choice,
            value: filterCodec.encode(choice.value),
          }))
          .filter(choiceHasValue),
      );
    }

    return sortChoices(rawChoices);
  }, [rawChoices, props.filterCodec]);

  const valueChanged = (value: string | string[] | null) => {
    const filterCodec = props.filterCodec;
    if (props.multiple && filterCodec && Array.isArray(value)) {
      setFilterValue(value.map((singleValue: string) => filterCodec.decode(singleValue)));
    }
    if (!props.multiple && filterCodec && !Array.isArray(value)) {
      setFilterValue(filterCodec.decode(value));
    }
    setFilterValue(value);
  };

  const renderHeaderCaptionWithChoices = () => {
    if (dropdownOpen) {
      return null;
    }

    if (props.renderHeaderCaption) {
      return (
        <span className="me-2">
          {props.multiple
            ? props.renderHeaderCaption(currentFilterValue as string[])
            : props.renderHeaderCaption(currentFilterValue as string)}
        </span>
      );
    }

    const anyText = t('tables.choiceSetFilter.anyText');

    if (Array.isArray(filterValue)) {
      if (filterValue.length > 0) {
        return filterValue
          .map((item) => choices.find((choice) => choice.value === item) || { label: item })
          .map(({ label }) => (
            <span key={label} className="me-2">
              {label}
            </span>
          ));
      }

      return <span className="me-2">{anyText}</span>;
    }

    const choice = choices.find((c) => c.value === filterValue) || { label: filterValue };
    return <span className="me-2">{choice.label || anyText}</span>;
  };

  const renderHeader = () => (
    <div className="card-header p-1 d-flex">
      <div className="flex-grow-1 d-flex flex-wrap" style={{ overflow: 'hidden' }}>
        {renderHeaderCaptionWithChoices()}
      </div>
      <button
        type="button"
        className="btn btn-outline-secondary btn-sm py-0 align-self-start"
        onClick={toggleOpen}
        aria-label={dropdownOpen ? t('buttons.close') : t('buttons.open')}
      >
        <i
          className={classNames({
            'bi-caret-down': !dropdownOpen,
            'bi-caret-up': dropdownOpen,
          })}
        />
      </button>
    </div>
  );

  return (
    <>
      <div className="card" ref={setDropdownButton}>
        {renderHeader()}
      </div>
      <div
        className={classNames('card align-items-stretch', { invisible: !dropdownOpen })}
        ref={setDropdownMenu}
        style={{
          ...styles.floating,
          borderTop: 'none',
          zIndex: 1100,
        }}
        {...attributes.floating}
      >
        <div className="card-body p-2">
          {props.multiple ? (
            <ChoiceSet
              multiple
              value={currentFilterValue as string[]}
              choices={choices}
              onChange={valueChanged}
              {...otherProps}
            />
          ) : (
            <ChoiceSet value={currentFilterValue as string} choices={choices} onChange={valueChanged} {...otherProps} />
          )}
        </div>

        {props.multiple && (
          <div className="card-footer p-2 bg-light">
            <button
              type="button"
              className="btn btn-link btn-sm"
              onClick={() => valueChanged(choices.map((c) => c.value))}
            >
              {t('buttons.selectAll')}
            </button>

            {!props.hideSelectNone && (
              <button type="button" className="btn btn-link btn-sm" onClick={() => valueChanged([])}>
                {t('buttons.selectNone')}
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default ChoiceSetFilter;
