import React from "react";
import { Animated, Platform, StyleSheet, View } from "react-native";

const CustomSpinner = () => {
  const spinValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );
    spinAnimation.start();
    return () => spinAnimation.stop();
  }, [spinValue]);

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.spinner, { transform: [{ rotate }] }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: Platform.OS === "web" ? "rgba(0,0,0,0.3)" : "transparent",
    zIndex: 1000,
  },
  spinner: {
    width: 60,
    height: 60,
    borderWidth: 6,
    borderColor: "#818cf8", // Tailwind indigo-400
    borderTopColor: "#fff",
    borderRadius: 30,
  },
});

export default CustomSpinner;
