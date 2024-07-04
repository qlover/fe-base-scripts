declare module '@qlover/fe-scripts' {
  export type SearchConfigType = import('cosmiconfig').OptionsSync & {
    _default: any;
  };

  export type SerachConfig = {
    name: string;
    config: SearchConfigType;
  };

  export type FeScriptsConfig = {
    protectedBranches?: string;
    cleanFiles?: string[];
    author?: string;
    repository?:
      | string
      | {
          name?: string;
          email?: string;
        };
    commitlint?: import('@commitlint/types').UserConfig;
    releaseIt?: import('release-it').Config;
  };
}
