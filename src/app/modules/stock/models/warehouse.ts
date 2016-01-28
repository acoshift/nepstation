import { Operatable } from '../../../models'

export interface Warehouse extends Operatable {
  name: string
  remark: string
  taxId: string
  contact: {
    address: string
    subdistrict: string
    district: string
    province: string
    postalCode: string
    country: string
    phone: string
    fax: string
    email: string
    website: string
  }
}
