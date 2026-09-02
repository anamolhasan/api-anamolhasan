export type TErrorSources = {
  path: string;
  message: string;
};

export type TErrorResponse = {
  statusCode: number;
  message: string;
  errorSources: TErrorSources[];
};
