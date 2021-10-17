import GraphQLAsyncSelect, {
  GraphQLAsyncSelectProps,
} from '../../BuiltInFormControls/GraphQLAsyncSelect';
import { SearchCmsContentQuery } from './queries';
import { SearchCmsContentQueryData } from './queries.generated';

export type CmsContentOption =
  SearchCmsContentQueryData['cmsParent']['typeaheadSearchCmsContent'][0];

export type CmsContentSelectProps<IsMulti extends boolean> = Omit<
  GraphQLAsyncSelectProps<SearchCmsContentQueryData, CmsContentOption, IsMulti>,
  'getOptions' | 'getVariables' | 'getOptionValue' | 'formatOptionLabel' | 'query'
>;

function CmsContentSelect<IsMulti extends boolean = false>(
  props: CmsContentSelectProps<IsMulti>,
): JSX.Element {
  const { ...otherProps } = props;

  return (
    <GraphQLAsyncSelect<SearchCmsContentQueryData, CmsContentOption, IsMulti>
      getOptions={(data) => data.cmsParent.typeaheadSearchCmsContent}
      getVariables={(inputValue) => ({ name: inputValue })}
      getOptionValue={({ id: optionId, __typename }: CmsContentOption) =>
        `${__typename}-${optionId}`
      }
      formatOptionLabel={(option: CmsContentOption) => (
        <>
          {option.name}{' '}
          <small className="badge bg-light text-dark">{option.__typename.replace('Cms', '')}</small>
        </>
      )}
      query={SearchCmsContentQuery}
      {...otherProps}
    />
  );
}

export default CmsContentSelect;
