import React, { useMemo, useState, ReactNode } from 'react';
import classNames from 'classnames';
import { Manager, Reference, Popper } from 'react-popper';
import { useTranslation } from 'react-i18next';
import { Filter } from 'react-table';

import ChoiceSet from '../BuiltInFormControls/ChoiceSet';
import { FilterCodec } from './FilterUtils';

export type ChoiceSetFilterChoice = {
  label: string;
  value: string;
  disabled?: boolean;
};

function sortChoices(choices: ChoiceSetFilterChoice[]) {
  return [...choices].sort(({ label: labelA }, { label: labelB }) =>
    labelA.localeCompare(labelB, undefined, { sensitivity: 'base' }),
  );
}

type ChoiceSetFilterValue = ChoiceSetFilterChoice['value'];

type ChoiceSetFilterCommonProps = {
  choices: ChoiceSetFilterChoice[];
  filter?: Filter;
  filterCodec?: FilterCodec<ChoiceSetFilterValue>;
};

type ChoiceSetFilterSingleProps = ChoiceSetFilterCommonProps & {
  onChange: React.Dispatch<ChoiceSetFilterValue>;
  multiple: false;
  renderHeaderCaption?: (value: ChoiceSetFilterValue) => ReactNode;
};

type ChoiceSetFilterMultipleProps = ChoiceSetFilterCommonProps & {
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
  const [collapsed, setCollapsed] = useState(true);

  const filterValue = useMemo(() => {
    const rawFilterValue = (filter || {}).value || [];
    if (props.multiple && props.filterCodec) {
      return rawFilterValue.map((singleValue: string) => props.filterCodec!.encode(singleValue));
    }
    if (!props.multiple && props.filterCodec) {
      return props.filterCodec.encode(rawFilterValue);
    }
    return rawFilterValue;
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

  const uncollapse = () => {
    setCollapsed(false);
  };

  const collapse = () => {
    setCollapsed(true);
  };

  const renderHeaderCaptionWithChoices = () => {
    if (!collapsed) {
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
        onClick={collapsed ? uncollapse : collapse}
      >
        <i
          className={classNames('fa', { 'fa-caret-down': collapsed, 'fa-caret-up': !collapsed })}
        />
      </button>
    </div>
  );

  return (
    <Manager>
      <Reference>
        {({ ref }) => (
          <div className="card" ref={ref}>
            {renderHeader()}
          </div>
        )}
      </Reference>
      <Popper
        placement="bottom-start"
        modifiers={{
          matchWidth: {
            enabled: true,
            order: 750,
            fn: (data) => {
              const { popper, reference } = data.offsets;
              if (popper.width < reference.width) {
                popper.width = reference.width;
              }
              return data;
            },
          },
          addWidthStyle: {
            enabled: true,
            order: 875,
            fn: (data) => ({
              ...data,
              styles: { ...data.styles, width: `${data.offsets.popper.width}px` },
            }),
          },
        }}
      >
        {({ ref, style, placement }) => (
          <div
            className={classNames('card align-items-start', { invisible: collapsed })}
            ref={ref}
            style={{
              ...style,
              marginTop: '-3px',
              borderTop: 'none',
            }}
            data-placement={placement}
          >
            <div className="card-body p-1">
              <ChoiceSet
                value={filterValue}
                choices={choices}
                onChange={valueChanged}
                multiple={props.multiple}
                {...otherProps}
              />
            </div>
          </div>
        )}
      </Popper>
    </Manager>
  );
}

export default ChoiceSetFilter;
