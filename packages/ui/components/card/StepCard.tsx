const StepCard: React.FC<{ children: React.ReactNode }> = (props) => {
  return (
    <div className="sm:border-default bg-default mt-10 border p-4 sm:rounded-xl sm:p-8">{props.children}</div>
  );
};

export { StepCard };
