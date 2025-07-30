import { LandingHeader } from "~/components/partials/Landing/LandingHeader";

interface HeaderSectionProps {
  onCartClick: () => void;
  isSticky?: boolean;
}

export const HeaderSection = ({ onCartClick, isSticky }: HeaderSectionProps) => {
  return <LandingHeader onClick={onCartClick} isSticky={isSticky} />;
};
