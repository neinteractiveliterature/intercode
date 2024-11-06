// React Router generated types for route:
// EventsApp/SignupAdmin/SignupsIndex.tsx

import * as T from "react-router/types"

export type Params = {
  eventId: string
  runId: string
}

type Route = typeof import("./SignupsIndex")

export type LoaderData = T.CreateLoaderData<Route>
export type ActionData = T.CreateActionData<Route>

export type LoaderArgs = T.CreateServerLoaderArgs<Params>
export type ClientLoaderArgs = T.CreateClientLoaderArgs<Params, Route>
export type ActionArgs = T.CreateServerActionArgs<Params>
export type ClientActionArgs = T.CreateClientActionArgs<Params, Route>

export type HydrateFallbackProps = T.CreateHydrateFallbackProps<Params>
export type ComponentProps = T.CreateComponentProps<Params, LoaderData, ActionData>
export type ErrorBoundaryProps = T.CreateErrorBoundaryProps<Params, LoaderData, ActionData>