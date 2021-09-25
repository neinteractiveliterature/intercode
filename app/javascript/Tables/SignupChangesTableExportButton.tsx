import ReactTableExportButtonWithColumnTransform, {
  ReactTableExportButtonWithColumnTransformProps,
} from './ReactTableExportButtonWithColumnTransform';

const transformColumnIdForExport = (columnId: string) => {
  if (columnId === 'action') {
    return ['action', 'prev_state', 'state'];
  }

  if (columnId === 'bucket_change') {
    return ['prev_bucket', 'bucket'];
  }

  return columnId;
};

export type SignupChangesTableExportButtonProps<RowType extends Record<string, undefined>> = Omit<
  ReactTableExportButtonWithColumnTransformProps<RowType>,
  'columnTransform'
>;

function SignupChangesTableExportButton<RowType extends Record<string, undefined>>({
  ...props
}: SignupChangesTableExportButtonProps<RowType>): JSX.Element {
  return (
    <ReactTableExportButtonWithColumnTransform
      {...props}
      columnTransform={transformColumnIdForExport}
    />
  );
}

export default SignupChangesTableExportButton;
