import { EmptyDataIcon } from "@/icons";
import MainButton from "../shared/MainButton";
import { Plus } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
  buttonText: string;
  href: string;
};

const EmptyState = ({
  title,
  description,
  buttonText,
  href,
}: EmptyStateProps) => {
  return (
    <div className="relative flex min-h-[430px] w-full flex-col items-center justify-center overflow-hidden rounded-3xl border border-[#E7E8EA] bg-white px-5 py-12 text-center shadow-[0_8px_35px_rgba(15,18,25,0.06)]">
      <div className="relative z-10 flex flex-col items-center">
        {/* Icon */}
        <EmptyDataIcon />

        {/* Content */}
        <h2 className="text-[22px] font-bold leading-relaxed text-[#0F1219] sm:text-[26px]">
          {title}
        </h2>

        <p className="mt-3 max-w-md text-[15px] font-medium leading-8 text-[#6B6E73] sm:text-[17px]">
          {description}
        </p>

        {/* Action */}
        <div className="mt-8">
          <MainButton
            text={buttonText}
            icon={<Plus size={20} strokeWidth={2.5} />}
            href={href}
          />
        </div>
      </div>
    </div>
  );
};

export default EmptyState;