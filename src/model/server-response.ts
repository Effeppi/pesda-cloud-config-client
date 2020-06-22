export interface PropertySources {
    name: string,
    source: Source
}

export interface SpringCloudConfigServerResponse {
    name: string,
    profiles: string[],
    label: string,
    version: string,
    state: string,
    propertySources: PropertySources[]
}

export interface Source {
    [key: string]: any,
}