import { Store} from "../schemas/store.schema"

export default function storeMapper(store: any | unknown): Store {
  return {
    code: store.code ?? '', 
    name: store.name ?? '',
    address: store.address ?? '',
    state: store.state ?? '',
    county: store.county ?? undefined,
    postalCode: store.postalCode ?? undefined
  }
}
