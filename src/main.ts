import { provide, enableProdMode } from 'angular2/core'
import { bootstrap, ELEMENT_PROBE_PROVIDERS } from 'angular2/platform/browser'
import { ROUTER_PROVIDERS, LocationStrategy, PathLocationStrategy } from 'angular2/router'
import { HTTP_PROVIDERS } from 'angular2/http'
import { Services } from './app/services'
import { Pipes } from './app/pipes'
import { Services as ModuleServices } from './app/modules'

const ENV_PROVIDERS = []

if (process.env.ENV === 'production') {
  enableProdMode()
}
ENV_PROVIDERS.push(ELEMENT_PROBE_PROVIDERS)

import { App } from './app/app'

document.addEventListener('DOMContentLoaded', function main () {
  bootstrap(App, [
    ...ENV_PROVIDERS,
    ...HTTP_PROVIDERS,
    ...ROUTER_PROVIDERS,
    ...Services,
    ...Pipes,
    ...ModuleServices,
    provide(LocationStrategy, { useClass: PathLocationStrategy })
  ])
  .catch(err => console.error(err))
})
