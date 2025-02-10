import {
  BarChartIcon,
  ClubIcon,
  GlobeIcon,
  HistoryIcon,
  PlusIcon,
  UsersIcon,
} from "lucide-react";

type SubItem = {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
};

type MenuItem = {
  title: string;
  href?: string;
  subItems?: SubItem[];
};

export const MENU_ITEMS: MenuItem[] = [
  {
    title: "Spill",
    subItems: [
      {
        title: "Nytt spill",
        description: "Opprett en ny runde",
        href: "/spill/opprett",
        icon: <ClubIcon />,
      },
      {
        title: "Historikk",
        description: "Se gjennom tidligere runder",
        href: "/spill",
        icon: <HistoryIcon />,
      },
    ],
  },
  {
    title: "Klubber",
    subItems: [
      {
        title: "Klubber",
        description: "Se gjennom alle klubber",
        href: "/klubber",
        icon: <UsersIcon />,
      },
      {
        title: "Ny klubb",
        description: "Opprett en ny klubb",
        href: "/klubber/opprett",
        icon: <PlusIcon />,
      },
    ],
  },
  {
    title: "Statistikk",
    subItems: [
      {
        title: "All statistikk",
        description: "Se gjennom alt av statistikk",
        href: "/statistikk",
        icon: <BarChartIcon />,
      },
      {
        title: "Spillerstatistikk",
        description: "Se statistikk for spesifikke spillere",
        href: "/statistikk/spillere",
        icon: <UsersIcon />,
      },
      {
        title: "Metastatistikk",
        description: "Se overordnet statistikk om LauBridge",
        href: "/statistikk/meta",
        icon: <GlobeIcon />,
      },
    ],
  },
  { title: "Regler", href: "/regler" },
  { title: "Om LauBridge", href: "/about" },
];
