import type Ionicons from "@expo/vector-icons/Ionicons";

/**
 * Glyph names accepted by the icon set the app draws from.
 *
 * Derived from the component instead of hard-coding the string union, so the
 * check stays in one place rather than being redeclared by every consumer.
 */
export type IconName = React.ComponentProps<typeof Ionicons>["name"];
