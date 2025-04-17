//STATUS
  export const STATUS = {
    Success: "success",
    Error: "error"
  } as const
  export type Status = (typeof STATUS)[keyof typeof STATUS];
  export type DataBaseResponse<T> =
    | { status: typeof STATUS.Success; data: T }
    | { status: typeof STATUS.Error; message: string };
// helper do rozpoznania czy odpowiedź to success
export const isSuccess = <T>(
  response: DataBaseResponse<T>
): response is { status: typeof STATUS.Success; data: T } => {
  return response.status === STATUS.Success;
};
  //----STATUS----