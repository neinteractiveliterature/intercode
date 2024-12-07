// React Router generated types for route:
// EventsApp/SignupAdmin/RunSignupsTable.tsx

import type * as T from "react-router/route-module"

import type { Info as Parent0 } from "../../../+types/root.js"
import type { Info as Parent1 } from "../../../+types/AppRoot.js"
import type { Info as Parent2 } from "../../../+types/AppRootLayout.js"
import type { Info as Parent3 } from "../../../+types/NonCMSPageWrapper.js"
import type { Info as Parent4 } from "../../+types/$eventId.js"
import type { Info as Parent5 } from "../../../RouteGuards/+types/EventPageGuard.js"
import type { Info as Parent6 } from "./RunHeader.js"
import type { Info as Parent7 } from "./route.js"
import type { Info as Parent8 } from "./SignupsIndex.js"

type Module = typeof import("../RunSignupsTable.js")

export type Info = {
  parents: [Parent0, Parent1, Parent2, Parent3, Parent4, Parent5, Parent6, Parent7, Parent8],
  id: "RunSignupsTable"
  file: "EventsApp/SignupAdmin/RunSignupsTable.tsx"
  path: "undefined"
  params: {"eventId": string; "runId": string} & { [key: string]: string | undefined }
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