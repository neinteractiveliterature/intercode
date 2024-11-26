// React Router generated types for route:
// EventsApp/SignupAdmin/RunHeader.tsx

import type * as T from "react-router/route-module"

import type { Info as Parent0 } from "../../../+types/root"
import type { Info as Parent1 } from "../../../+types/AppRoot"
import type { Info as Parent2 } from "../../../+types/AppRootLayout"
import type { Info as Parent3 } from "../../../+types/NonCMSPageWrapper"
import type { Info as Parent4 } from "../../+types/$eventId"
import type { Info as Parent5 } from "../../../RouteGuards/+types/EventPageGuard"

type Module = typeof import("../RunHeader")

export type Info = {
  parents: [Parent0, Parent1, Parent2, Parent3, Parent4, Parent5],
  id: "EventsApp/SignupAdmin/RunHeader"
  file: "EventsApp/SignupAdmin/RunHeader.tsx"
  path: "runs/:runId"
  params: {"eventId": string; "runId": string}
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