interface ErrorMessageProps {
  message: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  if (!message) return null;

  return <div className="mt-3 text-red-500 text-xs">{message}</div>;
};

export default ErrorMessage;
