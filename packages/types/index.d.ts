declare module '@qlover/fe-scripts' {
  export type SearchConfigType = import('cosmiconfig').OptionsSync & {
    _default: any;
  };

  export type SerachConfig = {
    name: string;
    config: SearchConfigType;
  };
}
