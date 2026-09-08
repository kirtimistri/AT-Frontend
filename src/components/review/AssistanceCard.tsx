import { LogoIcon } from '../Logo';

export const AssistanceCard = () => {
  return (
    <div className="rounded-lg border border-[#EEEEEE] bg-white p-5">
      <div className="flex items-start gap-3">
        <LogoIcon size="sm" />
        <div>
          <h4 className="text-[12px] font-medium text-[#171717]">Need assistance?</h4>
          <p className="mt-0.5 text-[10px] leading-relaxed text-[#999]">
            Call our corporate desk at 1800-22-8585 or chat with an expert.
          </p>
        </div>
      </div>
    </div>
  );
};
