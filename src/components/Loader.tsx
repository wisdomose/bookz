import clsx from "clsx";
import Spinner from "./Spinner";

export default function Loader({
  className = "",
  label,
}: {
  className?: string;
  label?: string;
}) {
  // const Spinner = (
  //   <div
  //     className={clsx(
  //       `w-14 h-14 rounded-full bg-transparent border-2 border-white border-b-primary-base animate-spin ${className}`
  //     )}
  //   ></div>
  // );

  return (
    <div className="flex items-center justify-center flex-col gap-5">
      <Spinner />
      {label && <p>{label}</p>}
    </div>
  );
}
