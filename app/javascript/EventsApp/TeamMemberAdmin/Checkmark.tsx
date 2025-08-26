import classNames from 'classnames';

export type CheckmarkProps = {
  value: boolean;
  className?: string;
};

function Checkmark({ value, className }: CheckmarkProps): React.JSX.Element {
  if (!value) {
    return <></>;
  }

  return (
    <i className={classNames('bi-check', className)}>
      <span className="visually-hidden">✓</span>
    </i>
  );
}

export default Checkmark;
