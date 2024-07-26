import ReactTableExportButtonWithColumnTransform, {
  ReactTableExportButtonWithColumnTransformProps,
} from './ReactTableExportButtonWithColumnTransform';

const transformColumnIdForExport = (columnId: string) => {
  if (columnId === 'action') {
    // eslint-disable-next-line i18next/no-literal-string
    return ['action', 'prev_state', 'state'];
  }

  if (columnId === 'bucket_change') {
    // eslint-disable-next-line i18next/no-literal-string
    return ['prev_bucket', 'bucket'];
  }

  return columnId;
};

export type SignupChangesTableExportButtonProps<RowType extends Record<string, unknown>> = Omit<
  ReactTableExportButtonWithColumnTransformProps<RowType>,
  'columnTransform'
>;

function SignupChangesTableExportButton<RowType extends Record<string, unknown>>({
  ...props
}: SignupChangesTableExportButtonProps<RowType>): JSX.Element {
  return <ReactTableExportButtonWithColumnTransform {...props} columnTransform={transformColumnIdForExport} />;
}

export default SignupChangesTableExportButton;
