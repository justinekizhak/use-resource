export interface DependencyMapType {
  [key: string]: string[] | null | undefined;
}

export interface CreateDependencyMapReturnType {
  dependencyMap: DependencyMapType;
  start: string;
}

export interface RequestIndexMapType {
  [key: string]: number;
}
