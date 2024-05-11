// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as RedirectImport } from './routes/redirect'
import { Route as LazyComponentImport } from './routes/lazy-component'
import { Route as IndexImport } from './routes/index'
import { Route as AdminIndexImport } from './routes/admin.index'
import { Route as AdminMembersImport } from './routes/admin.members'
import { Route as AdminMembersMemberIdImport } from './routes/admin.members.$memberId'

// Create Virtual Routes

const AdminLazyImport = createFileRoute('/admin')()
const AdminMembersIndexLazyImport = createFileRoute('/admin/members/')()

// Create/Update Routes

const AdminLazyRoute = AdminLazyImport.update({
  path: '/admin',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/admin.lazy').then((d) => d.Route))

const RedirectRoute = RedirectImport.update({
  path: '/redirect',
  getParentRoute: () => rootRoute,
} as any)

const LazyComponentRoute = LazyComponentImport.update({
  path: '/lazy-component',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const AdminIndexRoute = AdminIndexImport.update({
  path: '/',
  getParentRoute: () => AdminLazyRoute,
} as any)

const AdminMembersRoute = AdminMembersImport.update({
  path: '/members',
  getParentRoute: () => AdminLazyRoute,
} as any)

const AdminMembersIndexLazyRoute = AdminMembersIndexLazyImport.update({
  path: '/',
  getParentRoute: () => AdminMembersRoute,
} as any).lazy(() =>
  import('./routes/admin.members.index.lazy').then((d) => d.Route),
)

const AdminMembersMemberIdRoute = AdminMembersMemberIdImport.update({
  path: '/$memberId',
  getParentRoute: () => AdminMembersRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/lazy-component': {
      preLoaderRoute: typeof LazyComponentImport
      parentRoute: typeof rootRoute
    }
    '/redirect': {
      preLoaderRoute: typeof RedirectImport
      parentRoute: typeof rootRoute
    }
    '/admin': {
      preLoaderRoute: typeof AdminLazyImport
      parentRoute: typeof rootRoute
    }
    '/admin/members': {
      preLoaderRoute: typeof AdminMembersImport
      parentRoute: typeof AdminLazyImport
    }
    '/admin/': {
      preLoaderRoute: typeof AdminIndexImport
      parentRoute: typeof AdminLazyImport
    }
    '/admin/members/$memberId': {
      preLoaderRoute: typeof AdminMembersMemberIdImport
      parentRoute: typeof AdminMembersImport
    }
    '/admin/members/': {
      preLoaderRoute: typeof AdminMembersIndexLazyImport
      parentRoute: typeof AdminMembersImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexRoute,
  LazyComponentRoute,
  RedirectRoute,
  AdminLazyRoute.addChildren([
    AdminMembersRoute.addChildren([
      AdminMembersMemberIdRoute,
      AdminMembersIndexLazyRoute,
    ]),
    AdminIndexRoute,
  ]),
])