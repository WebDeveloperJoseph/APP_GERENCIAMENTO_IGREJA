import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { AppButton } from "@/components/AppButton";
import { colors, radii, spacing, typography } from "@/theme";
import {
  dateToISOInput,
  displayDateToISO,
  isoDateToDisplay,
  isoInputToDate,
  maskDateText,
} from "@/utils/dateInput";

interface AppDateInputProps {
  label: string;
  value: string;
  onChangeDate: (value: string) => void;
  optional?: boolean;
  minimumDate?: Date;
  maximumDate?: Date;
}

export function AppDateInput({
  label,
  value,
  onChangeDate,
  optional = false,
  minimumDate,
  maximumDate,
}: AppDateInputProps) {
  const [displayValue, setDisplayValue] = useState(() =>
    isoDateToDisplay(value),
  );
  const [isFocused, setIsFocused] = useState(false);
  const [showIOSPicker, setShowIOSPicker] = useState(false);
  const [pickerDate, setPickerDate] = useState(
    () => isoInputToDate(value) || new Date(),
  );
  const lastEmittedValue = useRef(value);

  useEffect(() => {
    if (value !== lastEmittedValue.current) {
      setDisplayValue(isoDateToDisplay(value));
      lastEmittedValue.current = value;
    }
  }, [value]);

  function emitDate(date: Date) {
    const isoValue = dateToISOInput(date);
    lastEmittedValue.current = isoValue;
    setDisplayValue(isoDateToDisplay(isoValue));
    setPickerDate(date);
    onChangeDate(isoValue);
  }

  function handleTextChange(text: string) {
    const maskedValue = maskDateText(text);
    const isoValue = displayDateToISO(maskedValue) || maskedValue;

    setDisplayValue(maskedValue);
    lastEmittedValue.current = isoValue;
    onChangeDate(isoValue);
  }

  function openPicker() {
    Keyboard.dismiss();
    const selectedDate = isoInputToDate(value) || new Date();
    setPickerDate(selectedDate);

    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: selectedDate,
        mode: "date",
        display: "calendar",
        minimumDate,
        maximumDate,
        onValueChange: (_, date) => emitDate(date),
      });
      return;
    }

    setShowIOSPicker(true);
  }

  const hasInvalidDate =
    displayValue.length > 0 &&
    !displayDateToISO(displayValue) &&
    (!isFocused || displayValue.length === 10);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {optional ? " (opcional)" : ""}
      </Text>
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.focusedInput,
          hasInvalidDate && styles.invalidInput,
        ]}
      >
        <TextInput
          keyboardType="number-pad"
          maxLength={10}
          onBlur={() => setIsFocused(false)}
          onChangeText={handleTextChange}
          onFocus={() => setIsFocused(true)}
          placeholder="DD/MM/AAAA"
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.primary}
          style={styles.input}
          value={displayValue}
        />
        <Pressable
          accessibilityLabel={`Abrir calendário para ${label}`}
          accessibilityRole="button"
          hitSlop={8}
          onPress={openPicker}
          style={styles.calendarButton}
        >
          <Ionicons color={colors.primary} name="calendar" size={22} />
        </Pressable>
      </View>
      <Text
        style={[
          styles.helperText,
          hasInvalidDate && styles.invalidText,
        ]}
      >
        {hasInvalidDate
          ? "Informe uma data válida."
          : "Digite a data ou toque no calendário."}
      </Text>

      {Platform.OS === "ios" ? (
        <Modal
          animationType="slide"
          onRequestClose={() => setShowIOSPicker(false)}
          transparent
          visible={showIOSPicker}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>{label}</Text>
              <DateTimePicker
                display="spinner"
                locale="pt-BR"
                maximumDate={maximumDate}
                minimumDate={minimumDate}
                mode="date"
                onValueChange={(_, date) => setPickerDate(date)}
                themeVariant="light"
                value={pickerDate}
              />
              <View style={styles.modalActions}>
                <AppButton
                  onPress={() => setShowIOSPicker(false)}
                  title="Cancelar"
                  variant="secondary"
                />
                <AppButton
                  onPress={() => {
                    emitDate(pickerDate);
                    setShowIOSPicker(false);
                  }}
                  title="Confirmar data"
                />
              </View>
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  label: {
    color: colors.text,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  inputContainer: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.card,
    overflow: "hidden",
  },
  focusedInput: {
    borderColor: colors.primary,
  },
  invalidInput: {
    borderColor: colors.danger,
  },
  input: {
    flex: 1,
    minHeight: 50,
    paddingHorizontal: spacing.lg,
    color: colors.text,
    fontSize: typography.fontSize.md,
  },
  calendarButton: {
    width: 52,
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
    backgroundColor: colors.primaryLight,
  },
  helperText: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
  },
  invalidText: {
    color: colors.danger,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(4, 25, 70, 0.45)",
  },
  modalCard: {
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
    backgroundColor: colors.card,
  },
  modalTitle: {
    color: colors.text,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.extraBold,
    textAlign: "center",
  },
  modalActions: {
    gap: spacing.sm,
  },
});
