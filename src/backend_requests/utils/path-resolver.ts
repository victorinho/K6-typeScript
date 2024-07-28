export class PathResolver {

    private static PATH_SEPARATOR: string = "/"

    static resolve(base: string, path: string): string {
        if (base.endsWith(this.PATH_SEPARATOR)) {
            base = base.slice(0, -1)
        }

        if (path.startsWith(this.PATH_SEPARATOR)) {
            path = path.slice(1)
        }

        return [base, path].join(this.PATH_SEPARATOR)
    }

    static resolveQueryParams(url: string, queryParams: Record<string, string>): string {
        const queryString = Object.keys(queryParams)
            .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
            .join('&');

        return queryString ? `${url}?${queryString}` : url
    }
}