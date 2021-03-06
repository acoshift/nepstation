/* Modules */

import { Services as AdminServices } from './modules/admin/module'
import { Services as CollectionServices } from './modules/collection/module'
import { Services as SaleServices } from './modules/sale/module'
import { Services as StockServices } from './modules/stock/module'
import { Services as EmsServices } from './modules/ems/module'

export var Services = [
  AdminServices,
  CollectionServices,
  SaleServices,
  StockServices,
  EmsServices,
]
