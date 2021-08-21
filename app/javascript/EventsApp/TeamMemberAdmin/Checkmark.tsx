import classNames from 'classnames';

export type CheckmarkProps = {
  value: boolean;
  className?: string;
};

function Checkmark({ value, className }: CheckmarkProps) {
  if (!value) {
    return null;
  }

  return (
    <i className={classNames('bi-check', className)}>
      <span className="visually-hidden">✓</span>
    </i>
  );
}

export default Checkmark;
