import { Loader } from "../Loader/Loader";

interface ConditionalWrapperProps {
  isLoading: boolean;
  children: React.ReactNode;
}

export const ConditionalWrapper = ({
  isLoading,
  children,
}: ConditionalWrapperProps) => {
  return isLoading ? <Loader /> : <>{children}</>;
};
