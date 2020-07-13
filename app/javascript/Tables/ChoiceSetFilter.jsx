import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Manager, Reference, Popper } from 'react-popper';
import { useTranslation } from 'react-i18next';

import ChoiceSet from '../BuiltInFormControls/ChoiceSet';

function sortChoices(choices) {
  return [...choices].sort((
    { label: labelA },
    { label: labelB },
  ) => labelA.localeCompare(labelB, { sensitivity: 'base' }));
}

const ValueType = PropTypes.oneOfType([PropTypes.number, PropTypes.string]);

function ChoiceSetFilter({
  choices: rawChoices, filter, filterCodec, multiple, onChange, renderHeaderCaption, ...otherProps
}) {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(true);

  const filterValue = useMemo(
    () => {
      const rawFilterValue = (filter || {}).value || [];
      if (filterCodec) {
        if (multiple) {
          return rawFilterValue.map((singleValue) => filterCodec.encode(singleValue));
        }

        return filterCodec.encode(rawFilterValue);
      }
      return rawFilterValue;
    },
    [filter, filterCodec, multiple],
  );

  const choices = useMemo(
    () => {
      if (filterCodec) {
        return sortChoices(rawChoices.map((choice) => ({
          ...choice,
          value: filterCodec.encode(choice.value),
        })));
      }

      return sortChoices(rawChoices);
    },
    [rawChoices, filterCodec],
  );

  const valueChanged = (value) => {
    if (filterCodec) {
      if (multiple) {
        onChange(value.map((singleValue) => filterCodec.decode(singleValue)));
      } else {
        onChange(filterCodec.decode(value));
      }
    }
    onChange(value);
  };

  const uncollapse = () => { setCollapsed(false); };

  const collapse = () => { setCollapsed(true); };

  const renderHeaderCaptionWithChoices = () => {
    if (!collapsed) {
      return null;
    }

    if (renderHeaderCaption) {
      return <span className="mr-2">{renderHeaderCaption(filterValue)}</span>;
    }

    const anyText = t('tables.choiceSetFilter.anyText', 'Any');

    if (Array.isArray(filterValue)) {
      if (filterValue.length > 0) {
        return filterValue.map(
          (item) => (
            choices.find((choice) => choice.value === item)
            || { label: item }
          ),
        ).map(({ label }) => <span key={label} className="mr-2">{label}</span>);
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
      <button type="button" className="btn btn-outline-secondary btn-sm py-0 align-self-start" onClick={collapsed ? uncollapse : collapse}>
        <i className={classNames('fa', { 'fa-caret-down': collapsed, 'fa-caret-up': !collapsed })} />
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
                multiple={multiple}
                {...otherProps}
              />
            </div>
          </div>
        )}
      </Popper>
    </Manager>
  );
}

ChoiceSetFilter.propTypes = {
  choices: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: ValueType.isRequired,
    }),
  ).isRequired,
  filter: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.arrayOf(ValueType), ValueType]),
  }),
  filterCodec: PropTypes.shape({
    decode: PropTypes.func.isRequired,
    encode: PropTypes.func.isRequired,
  }),
  multiple: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  renderHeaderCaption: PropTypes.func,
};

ChoiceSetFilter.defaultProps = {
  multiple: true,
  filter: null,
  filterCodec: null,
  renderHeaderCaption: null,
};

export default ChoiceSetFilter;
