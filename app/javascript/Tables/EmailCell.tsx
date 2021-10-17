export type EmailCellProps = {
  value?: string | null;
};

function EmailCell({ value }: EmailCellProps): JSX.Element {
  return (
    <a
      href={`mailto:${value}`}
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      {value}
    </a>
  );
}

export default EmailCell;
