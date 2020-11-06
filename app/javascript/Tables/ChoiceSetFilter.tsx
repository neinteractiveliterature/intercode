import { useMemo, useState, ReactNode } from 'react';
import * as React from 'react';
import classNames from 'classnames';
import { Modifier } from 'react-popper';
import { useTranslation } from 'react-i18next';
import { Filter } from 'react-table';
import max from 'lodash/max';

import ChoiceSet from '../BuiltInFormControls/ChoiceSet';
import { FilterCodec } from './FilterUtils';
import { useIntercodePopperWithAutoClosing, useToggleOpen } from '../UIComponents/PopperUtils';

export type ChoiceSetFilterChoice = {
  label: string;
  value: string;
  disabled?: boolean;
};

function sortChoices(choices: readonly ChoiceSetFilterChoice[]) {
  return [...choices].sort(({ label: labelA }, { label: labelB }) =>
    labelA.localeCompare(labelB, undefined, { sensitivity: 'base' }),
  );
}

type ChoiceSetFilterValue = ChoiceSetFilterChoice['value'];

type ChoiceSetFilterCommonProps = {
  choices: readonly ChoiceSetFilterChoice[];
  filter?: Filter;
  filterCodec?: FilterCodec<ChoiceSetFilterValue>;
};

export type ChoiceSetFilterSingleProps = ChoiceSetFilterCommonProps & {
  onChange: React.Dispatch<ChoiceSetFilterValue>;
  multiple: false;
  renderHeaderCaption?: (value: ChoiceSetFilterValue) => ReactNode;
};

export type ChoiceSetFilterMultipleProps = ChoiceSetFilterCommonProps & {
  onChange: React.Dispatch<ChoiceSetFilterValue[]>;
  multiple: true;
  renderHeaderCaption?: (value: ChoiceSetFilterValue[]) => ReactNode;
};

export type ChoiceSetFilterProps = ChoiceSetFilterSingleProps | ChoiceSetFilterMultipleProps;

function ChoiceSetFilter(props: ChoiceSetFilterProps) {
  const {
    choices: rawChoices,
    filter,
    onChange: originalOnChange,
    multiple: originalMultiple,
    ...otherProps
  } = props;
  const { t } = useTranslation();
  const [dropdownButton, setDropdownButton] = useState<HTMLDivElement | null>(null);
  const [dropdownMenu, setDropdownMenu] = useState<HTMLDivElement | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const modifiers: Modifier<any>[] = useMemo(
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
    ],
    [],
  );

  const { styles, attributes, update } = useIntercodePopperWithAutoClosing(
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
    const rawFilterValue = filter?.value ?? (props.multiple ? [] : undefined);
    if (props.filterCodec) {
      if (props.multiple) {
        return rawFilterValue.map((singleValue: any) =>
          props.filterCodec!.encode(singleValue)?.toString(),
        );
      }
      return props.filterCodec.encode(rawFilterValue)?.toString();
    }

    if (props.multiple) {
      return rawFilterValue.map((singleValue: any) => singleValue?.toString());
    }

    return rawFilterValue?.toString();
  }, [filter, props.filterCodec, props.multiple]);

  const choices = useMemo(() => {
    if (props.filterCodec) {
      return sortChoices(
        rawChoices.map((choice) => ({
          ...choice,
          value: props.filterCodec!.encode(choice.value)!,
        })),
      );
    }

    return sortChoices(rawChoices);
  }, [rawChoices, props.filterCodec]);

  const valueChanged = (value: any) => {
    if (props.multiple && props.filterCodec) {
      props.onChange(value.map((singleValue: string) => props.filterCodec!.decode(singleValue)));
    }
    if (!props.multiple && props.filterCodec) {
      props.onChange(props.filterCodec.decode(value)!);
    }
    props.onChange(value);
  };

  const renderHeaderCaptionWithChoices = () => {
    if (dropdownOpen) {
      return null;
    }

    if (props.renderHeaderCaption) {
      return <span className="mr-2">{props.renderHeaderCaption(filterValue)}</span>;
    }

    const anyText = t('tables.choiceSetFilter.anyText', 'Any');

    if (Array.isArray(filterValue)) {
      if (filterValue.length > 0) {
        return filterValue
          .map((item) => choices.find((choice) => choice.value === item) || { label: item })
          .map(({ label }) => (
            <span key={label} className="mr-2">
              {label}
            </span>
          ));
      }

      return <span className="mr-2">{anyText}</span>;
    }

    const choice = choices.find((c) => c.value === filterValue) || { label: filterValue };
    return <span className="mr-2">{choice.label || anyText}</span>;
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
      >
        <i
          className={classNames('fa', {
            'fa-caret-down': !dropdownOpen,
            'fa-caret-up': dropdownOpen,
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
        className={classNames('card align-items-start', { invisible: !dropdownOpen })}
        ref={setDropdownMenu}
        style={{
          ...styles.popper,
          marginTop: '-3px',
          borderTop: 'none',
        }}
        {...attributes.popper}
      >
        <div className="card-body p-2">
          <ChoiceSet
            value={filterValue}
            choices={choices}
            onChange={valueChanged}
            multiple={props.multiple}
            {...otherProps}
          />
        </div>
      </div>
    </>
  );
}

export default ChoiceSetFilter;
