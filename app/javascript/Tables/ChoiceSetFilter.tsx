import { useMemo, useState, ReactNode } from 'react';
import classNames from 'classnames';
import { Modifier } from 'react-popper';
import { useTranslation } from 'react-i18next';
import max from 'lodash/max';
import { ChoiceSet, useLitformPopperWithAutoClosing, useToggleOpen } from '@neinteractiveliterature/litform';

import { FilterCodec } from './FilterUtils';
import { Column } from '@tanstack/react-table';

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
  column: Pick<Column<TData, TValue>, 'getFilterValue' | 'setFilterValue'>;
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
  | ChoiceSetFilterSingleProps<TData, TValue>
  | ChoiceSetFilterMultipleProps<TData, TValue>;

function ChoiceSetFilter<TData extends Record<string, unknown>, TValue>(
  props: ChoiceSetFilterProps<TData, TValue>,
): React.JSX.Element {
  const {
    choices: rawChoices,
    column: { getFilterValue, setFilterValue },
    multiple,
    ...otherProps
  } = props;
  const { t } = useTranslation();
  const [dropdownButton, setDropdownButton] = useState<HTMLDivElement | null>(null);
  const [dropdownMenu, setDropdownMenu] = useState<HTMLDivElement | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const modifiers: Modifier<unknown>[] = useMemo(
    () => [
      {
        name: 'sameWidth',
        enabled: true,
        fn: ({ state }) => ({
          ...state,
          styles: {
            ...state.styles,
            popper: {
              ...state.styles.popper,
              width: `${max([state.rects.reference.width, state.rects.popper.width])}px`,
            },
          },
        }),
        phase: 'beforeWrite',
        requires: ['computeStyles'],
      },
      {
        name: 'offset',
        options: { offset: [0, -3] },
      },
    ],
    [],
  );

  const { styles, attributes, update } = useLitformPopperWithAutoClosing(
    dropdownMenu,
    dropdownButton,
    undefined,
    setDropdownOpen,
    {
      placement: 'bottom-start',
      modifiers,
    },
  );

  const toggleOpen = useToggleOpen(setDropdownOpen, update);

  const filterValue = useMemo(() => {
    const filterCodec = props.filterCodec;
    if (props.multiple) {
      const rawFilterValue = (getFilterValue() ?? []) as (string | undefined)[];
      if (filterCodec) {
        return rawFilterValue.map((singleValue) => filterCodec.encode(singleValue)?.toString());
      } else {
        return rawFilterValue.map((singleValue) => singleValue?.toString());
      }
    } else {
      const rawFilterValue = (getFilterValue() ?? undefined) as string | undefined;
      if (filterCodec) {
        return filterCodec.encode(rawFilterValue)?.toString();
      } else {
        return rawFilterValue?.toString();
      }
    }
  }, [getFilterValue, props.filterCodec, props.multiple]);

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
            ? props.renderHeaderCaption(getFilterValue() as string[])
            : props.renderHeaderCaption(getFilterValue() as string)}
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
          ...styles.popper,
          borderTop: 'none',
          zIndex: 1100,
        }}
        {...attributes.popper}
      >
        <div className="card-body p-2">
          {props.multiple ? (
            <ChoiceSet
              multiple
              value={getFilterValue() as string[]}
              choices={choices}
              onChange={valueChanged}
              {...otherProps}
            />
          ) : (
            <ChoiceSet value={getFilterValue() as string} choices={choices} onChange={valueChanged} {...otherProps} />
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
