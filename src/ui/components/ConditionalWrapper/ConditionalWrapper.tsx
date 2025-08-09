import { Loader } from "../Loader/Loader";

export const ConditionalWrapper: React.FC<{
  isLoading: boolean;
  children: React.ReactNode;
}> = ({ isLoading, children }) => {
  return isLoading ? <Loader /> : <>{children}</>;
};
