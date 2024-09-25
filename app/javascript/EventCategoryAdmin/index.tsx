import OutletWithLoading from '../OutletWithLoading';
import NamedRouteBreadcrumbItem from '../Breadcrumbs/NamedRouteBreadcrumbItem';

function EventCategoryAdmin(): JSX.Element {
  return (
    <>
      <ol className="breadcrumb">
        <NamedRouteBreadcrumbItem routeId={['EventCategoryAdmin', 'EventCategoryIndex']}>
          Event categories
        </NamedRouteBreadcrumbItem>

        <NamedRouteBreadcrumbItem routeId="NewEventCategory">New event category</NamedRouteBreadcrumbItem>

        <NamedRouteBreadcrumbItem routeId="EditEventCategory">Edit event category</NamedRouteBreadcrumbItem>
      </ol>

      <OutletWithLoading />
    </>
  );
}

export default EventCategoryAdmin;
