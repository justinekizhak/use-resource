export interface DependencyMap_T {
  [key: string]: string[] | null | undefined;
}

export interface CreateDependencyMapReturn_T {
  dependencyMap: DependencyMap_T;
  start: string;
}

export interface RequestIndexMap_T {
  [key: string]: number;
}
