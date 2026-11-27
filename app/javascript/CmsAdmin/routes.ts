import { index, layout, route } from '@react-router/dev/routes';
import { NamedRoute } from '../NamedRoute';

export default layout('CmsAdmin/index.tsx', { id: NamedRoute.CmsAdmin }, [
  route('/cms_pages', 'CmsAdmin/CmsPagesAdmin/route.ts', { id: NamedRoute.CmsPagesAdmin }, [
    route(':id', 'CmsAdmin/CmsPagesAdmin/SinglePageRoute.tsx', [
      route('edit', 'CmsAdmin/CmsPagesAdmin/EditCmsPage.tsx'),
      route('view_source', 'CmsAdmin/CmsPagesAdmin/ViewCmsPageSource.tsx'),
    ]),
    route('new', 'CmsAdmin/CmsPagesAdmin/NewCmsPage.tsx'),
    index('CmsAdmin/CmsPagesAdmin/CmsPagesAdminTable.tsx'),
  ]),
  route('/cms_partials', 'CmsAdmin/CmsPartialsAdmin/route.ts', { id: NamedRoute.CmsPartialsAdmin }, [
    route(':id', 'CmsAdmin/CmsPartialsAdmin/SinglePartialRoute.tsx', [
      route('edit', 'CmsAdmin/CmsPartialsAdmin/EditCmsPartial.tsx'),
      route('view_source', 'CmsAdmin/CmsPartialsAdmin/ViewCmsPartialSource.tsx'),
    ]),
    route('new', 'CmsAdmin/CmsPartialsAdmin/NewCmsPartial.tsx'),
    index('CmsAdmin/CmsPartialsAdmin/CmsPartialsAdminTable.tsx'),
  ]),
  route('/cms_files', 'CmsAdmin/CmsFilesAdmin/index.tsx', { id: NamedRoute.CmsFiles }),
  route('/cms_navigation_items', 'CmsAdmin/NavigationItemsAdmin/index.tsx'),
  route('/cms_layouts', 'CmsAdmin/CmsLayoutsAdmin/route.ts', { id: NamedRoute.CmsLayoutsAdmin }, [
    route(':id', 'CmsAdmin/CmsLayoutsAdmin/SingleLayoutRoute.tsx', [
      route('edit', 'CmsAdmin/CmsLayoutsAdmin/EditCmsLayout.tsx'),
      route('view_source', 'CmsAdmin/CmsLayoutsAdmin/ViewCmsLayoutSource.tsx'),
    ]),
    route('new', 'CmsAdmin/CmsLayoutsAdmin/NewCmsLayout.tsx'),
    index('CmsAdmin/CmsLayoutsAdmin/CmsLayoutsAdminTable.tsx'),
  ]),
  route('/cms_variables', 'CmsAdmin/CmsVariablesAdmin/index.tsx', [
    route(':key', 'CmsAdmin/CmsVariablesAdmin/SingleVariableRoute.ts'),
  ]),
  route('/cms_graphql_queries', 'CmsAdmin/CmsGraphqlQueriesAdmin/route.ts', { id: NamedRoute.CmsGraphqlQueriesAdmin }, [
    route(':id', 'CmsAdmin/CmsGraphqlQueriesAdmin/SingleGraphqlQueryRoute.ts', [
      route('edit', 'CmsAdmin/CmsGraphqlQueriesAdmin/EditCmsGraphqlQuery.tsx'),
      route('view_source', 'CmsAdmin/CmsGraphqlQueriesAdmin/ViewCmsGraphqlQuerySource.tsx'),
    ]),
    route('new', 'CmsAdmin/CmsGraphqlQueriesAdmin/NewCmsGraphqlQuery.tsx'),
    index('CmsAdmin/CmsGraphqlQueriesAdmin/CmsGraphqlQueriesAdminTable.tsx'),
  ]),
  route('/cms_content_groups', 'CmsAdmin/CmsContentGroupsAdmin/route.ts', { id: NamedRoute.CmsContentGroupsAdmin }, [
    route(':id', 'CmsAdmin/CmsContentGroupsAdmin/SingleCmsContentGroupRoute.ts', [
      route('edit', 'CmsAdmin/CmsContentGroupsAdmin/EditCmsContentGroup.tsx'),
      index('CmsAdmin/CmsContentGroupsAdmin/ViewCmsContentGroup.tsx'),
    ]),
    route('new', 'CmsAdmin/CmsContentGroupsAdmin/NewCmsContentGroup.tsx'),
    index('CmsAdmin/CmsContentGroupsAdmin/CmsContentGroupsAdminTable.tsx'),
  ]),
  layout('RootSiteAdmin/route.ts', [route('/root_site', 'RootSiteAdmin/EditRootSite.tsx')]),
]);
