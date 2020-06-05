import type { AxiosInstance } from 'axios'
import axios from 'axios'

export type Filter = {
  name: string
  value: string
  filterOperation: string | undefined
}

export type TableFilter = {
  id: string
  value: Filter
}

export type Pagination = {
  page: number
  perPage: number
  count: number | undefined
  nextUrl: string | undefined
  prevUrl: string | undefined
}

export abstract class BaseProvider {
  constructor(private readonly http: AxiosInstance = axios.create({})) {
    this.http = http
  }

  getList = async (
    url: string,
    filters: Array<TableFilter> | null = null,
    page: number | null = null
  ): Promise<[Model[], Array<TableFilter>, Pagination]> => {
    const [resourceUrl, resourceFilters] = this.parseUrl(url)
    const generatedUrl = this.getUrl(resourceUrl, resourceFilters, filters, page)

    return this.navigate(generatedUrl, resourceFilters)
  }

  getObject = async (resourceUrl: string, objectId: string): Promise<Model> => {
    const response = await this.http.get(resourceUrl + objectId)
    return response.data.data
  }

  post = async (resourceUrl: string, payload: any): Promise<Model> => {
    const response = await this.http.post(resourceUrl, payload)
    return response.data.data
  }

  put = async (resourceUrl: string, payload: any): Promise<Model> => {
    const response = await this.http.put(resourceUrl, payload)
    return response.data.data
  }

  navigate = async (url: string, resourceFilters: Filter[]): Promise<[Model[], Array<TableFilter>, Pagination]> => {
    const response = await this.http.get(url)
    const { data, meta } = response.data
    const [tableFilters, pagination] = this.getFiltersAndPagination(meta, resourceFilters)
    return [data, tableFilters, pagination]
  }

  parseUrl = (baseUrl: string): [string, Filter[]] => {
    const filters: Array<Filter> = []
    const url = new URL(baseUrl)
    url.searchParams.forEach((value, param) => {
      const [name, filterOperation] = param.split('__', 1)
      filters.push({ name, value, filterOperation })
    })
    return [`${url.origin}${url.pathname}`, filters]
  }

  getFilterQuery = (filter: Filter): [string, string] => {
    const { name, value, filterOperation } = filter

    let filterQuery = name.toString()

    if (filterOperation) {
      filterQuery = `${name}__${filterOperation}`
    }

    return [filterQuery, value]
  }

  getUrl = (
    resourceUrl: string,
    resourceFilters: Filter[] | null = null,
    filters: Array<TableFilter> | null = null,
    page: number | null = null
  ): string => {
    const url = new URL(resourceUrl)

    if (filters) {
      filters.forEach(({ value }: TableFilter) => {
        const [queryParam, queryValue] = this.getFilterQuery(value)
        url.searchParams.set(queryParam, queryValue)
      })
    }

    if (resourceFilters) {
      resourceFilters.forEach((element: Filter) => {
        const [queryParam, queryValue] = this.getFilterQuery(element)
        url.searchParams.set(queryParam, queryValue)
      })
    }

    if (page) {
      url.searchParams.set('page', page.toString())
    }

    return url.href
  }

  getFiltersAndPagination = (meta: any, resourceFilters: Filter[]): [Array<TableFilter>, Pagination] => {
    const defaultPagination = { page: 1, perPage: 100, count: undefined, nextUrl: undefined, prevUrl: undefined }

    if (meta === undefined) {
      return [[], defaultPagination]
    }

    const { page, per_page: perPage, total: count, url, next_url: nextUrl, prev_url: prevUrl } = meta
    const [, backendFilters] = this.parseUrl(url)
    const pagination: Pagination = { page, perPage, nextUrl, prevUrl, count }
    const excludeNames = ['page', 'per_page', ...resourceFilters.map(({ name }: Filter) => name)]
    const tableFilters: Array<TableFilter> = []

    backendFilters.forEach((filter: Filter) => {
      if (!excludeNames.includes(filter.name)) {
        tableFilters.push({ id: filter.name, value: filter })
      }
    })
    return [tableFilters, pagination]
  }
}
