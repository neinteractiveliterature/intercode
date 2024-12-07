// React Router generated types for route:
// EventsApp/schedule_by_room.tsx

import type * as T from "react-router/route-module"

import type { Info as Parent0 } from "../../+types/root.js"
import type { Info as Parent1 } from "../../+types/AppRoot.js"
import type { Info as Parent2 } from "../../+types/AppRootLayout.js"
import type { Info as Parent3 } from "../../+types/NonCMSPageWrapper.js"
import type { Info as Parent4 } from "../../RouteGuards/+types/MultiEventConventionRouteGuard.js"

type Module = typeof import("../schedule_by_room.js")

export type Info = {
  parents: [Parent0, Parent1, Parent2, Parent3, Parent4],
  id: "EventsApp/schedule_by_room"
  file: "EventsApp/schedule_by_room.tsx"
  path: "events/schedule_by_room/*"
  params: {"*": string} & { [key: string]: string | undefined }
  module: Module
  loaderData: T.CreateLoaderData<Module>
  actionData: T.CreateActionData<Module>
}

export namespace Route {
  export type LinkDescriptors = T.LinkDescriptors
  export type LinksFunction = () => LinkDescriptors

  export type MetaArgs = T.CreateMetaArgs<Info>
  export type MetaDescriptors = T.MetaDescriptors
  export type MetaFunction = (args: MetaArgs) => MetaDescriptors

  export type HeadersArgs = T.HeadersArgs
  export type HeadersFunction = (args: HeadersArgs) => Headers | HeadersInit

  export type LoaderArgs = T.CreateServerLoaderArgs<Info>
  export type ClientLoaderArgs = T.CreateClientLoaderArgs<Info>
  export type ActionArgs = T.CreateServerActionArgs<Info>
  export type ClientActionArgs = T.CreateClientActionArgs<Info>

  export type HydrateFallbackProps = T.CreateHydrateFallbackProps<Info>
  export type ComponentProps = T.CreateComponentProps<Info>
  export type ErrorBoundaryProps = T.CreateErrorBoundaryProps<Info>
}