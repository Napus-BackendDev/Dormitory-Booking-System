interface DashboardProps {
  headerIcon?: React.ReactNode;
  header: string;
  subheader?: string;
  buttonIcon?: React.ReactNode;
  buttonName?: string;
}

export function Dashboard({
  headerIcon,
  header,
  subheader,
  buttonIcon,
  buttonName,
}: DashboardProps) {
  return (
    <div className="flex justify-between items-center w-full bg-linear-to-b from-main to-sub-linear p-8 rounded-2xl text-white mb-8">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          {headerIcon}
          {header}
        </h1>
        {subheader && <span className="text-yellow">{subheader}</span>}
      </div>

      {buttonName && (
        <button className="flex items-center gap-2 m-1 bg-white text-main font-semibold py-2 px-4 rounded-xl w-fit hover:scale-105 transition-transform cursor-pointer">
          {buttonIcon}
          {buttonName}
        </button>
      )}
    </div>
  );
}


