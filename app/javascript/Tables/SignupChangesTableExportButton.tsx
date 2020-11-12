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

export type SignupChangesTableExportButtonProps<RowType extends object> = Omit<
  ReactTableExportButtonWithColumnTransformProps<RowType>,
  'columnTransform'
>;

function SignupChangesTableExportButton<RowType extends object>(
  { ...props }: SignupChangesTableExportButtonProps<RowType>,
) {
  return (
    <ReactTableExportButtonWithColumnTransform
      {...props}
      columnTransform={transformColumnIdForExport}
    />
  );
}

export default SignupChangesTableExportButton;
