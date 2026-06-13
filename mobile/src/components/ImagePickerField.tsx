import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors, radii, spacing, typography } from "@/theme";

interface ImagePickerFieldProps {
  aspect?: [number, number];
  imageUrl?: string | null;
  label: string;
  onChange: (asset: ImagePicker.ImagePickerAsset | null) => void;
  shape?: "circle" | "rectangle";
}

export function ImagePickerField({
  aspect = [1, 1],
  imageUrl,
  label,
  onChange,
  shape = "rectangle",
}: ImagePickerFieldProps) {
  async function pickImage() {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permissao necessaria",
        "Permita o acesso as fotos para selecionar uma imagem.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect,
      quality: 0.8,
    });

    if (!result.canceled) {
      onChange(result.assets[0]);
    }
  }

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        accessibilityRole="button"
        onPress={pickImage}
        style={({ pressed }) => [
          styles.picker,
          shape === "circle" && styles.circlePicker,
          pressed && styles.pressed,
        ]}
      >
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={[
              styles.image,
              shape === "circle" && styles.circleImage,
            ]}
          />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons color={colors.primary} name="image-outline" size={30} />
            <Text style={styles.placeholderTitle}>Selecionar imagem</Text>
            <Text style={styles.placeholderText}>JPG, PNG ou WEBP</Text>
          </View>
        )}

        <View style={styles.editBadge}>
          <Ionicons color={colors.surface} name="camera" size={17} />
        </View>
      </Pressable>

      {imageUrl ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => onChange(null)}
          style={styles.removeButton}
        >
          <Ionicons color={colors.danger} name="trash-outline" size={15} />
          <Text style={styles.removeText}>Remover imagem</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: spacing.sm,
  },
  label: {
    color: colors.text,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  picker: {
    height: 150,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    backgroundColor: colors.primaryLight,
  },
  circlePicker: {
    width: 112,
    height: 112,
    alignSelf: "center",
    borderRadius: 56,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  circleImage: {
    borderRadius: 56,
  },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderTitle: {
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    marginTop: spacing.sm,
  },
  placeholderText: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 3,
  },
  editBadge: {
    position: "absolute",
    right: spacing.sm,
    bottom: spacing.sm,
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 17,
    backgroundColor: colors.secondary,
  },
  removeButton: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    padding: spacing.xs,
  },
  removeText: {
    color: colors.danger,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  pressed: {
    opacity: 0.75,
  },
});
