import { ImageSourcePropType } from "react-native";

import { colors } from "@/theme/colors";

export interface ChurchTheme {
  churchName: string;
  shortName: string;
  tagline: string;
  logo: ImageSourcePropType | null;
  colors: {
    primaryColor: string;
    secondaryColor: string;
    dangerColor: string;
    successColor: string;
    backgroundColor: string;
    cardColor: string;
    textColor: string;
    mutedTextColor: string;
    borderColor: string;
  };
}

export const churchTheme: ChurchTheme = {
  churchName: "APP ICB",
  shortName: "ICB",
  tagline: "Gestão da igreja simples e conectada",
  logo: require("../../assets/images/icb-logo-official.jpg"),
  colors: {
    primaryColor: colors.primary,
    secondaryColor: colors.secondary,
    dangerColor: colors.danger,
    successColor: colors.success,
    backgroundColor: colors.background,
    cardColor: colors.card,
    textColor: colors.text,
    mutedTextColor: colors.textMuted,
    borderColor: colors.border,
  },
};
