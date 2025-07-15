import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from './fonts';

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <GlobeAltIcon className="h-9 w-9 rotate-[15deg]" />
      <p className="text-[24px] md:text-[32px]">Hoang Bon</p>
    </div>
  );
}
