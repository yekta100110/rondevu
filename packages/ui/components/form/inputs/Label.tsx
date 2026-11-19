import classNames from "@rondevu/ui/classNames";

export function Label(props: JSX.IntrinsicElements["label"]) {
  const { className, ...restProps } = props;
  return (
    <label
      className={classNames(
        "text-emphasis mb-2 block text-sm font-medium leading-snug",
        className
      )}
      {...restProps}>
      {props.children}
    </label>
  );
}
