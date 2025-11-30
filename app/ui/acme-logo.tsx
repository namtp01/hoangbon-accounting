import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { montserrat } from './fonts';

export default function AcmeLogo() {
  return (
    <div
      className={`${montserrat.className} flex flex-row items-center leading-none text-white truncate`}
    >
      <GlobeAltIcon className="h-9 w-9 rotate-[15deg]" />
      <p className="text-[24px] md:text-[24px]">Hoang Bon</p>
    </div>
  );
}