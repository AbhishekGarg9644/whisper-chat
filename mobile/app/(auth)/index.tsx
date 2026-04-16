import { AnimatedOrb } from "@/components/AnimatedOrb";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/store/useAuthStore";
import { useApi } from "@/lib/axios";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
// ✅ Safe defaults to prevent NaN/Yoga crashes during boot
const width = screenWidth || 375;
const height = screenHeight || 812;


type AuthMode = "sign-in" | "sign-up";

const AuthScreen = () => {
  const login = useAuthStore((state) => state.login);
  const { api } = useApi();

  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [name, setName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const normalizedEmail = emailAddress.trim().toLowerCase();

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setErrorMessage(null);
  };

  const handleAuth = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (mode === "sign-in") {
        const res = await api.post("/auth/login", {
          email: normalizedEmail,
          password,
        });
        await login(res.data.token, res.data.user);
      } else {
        if (!name.trim()) {
          setErrorMessage("Please enter your name");
          setIsSubmitting(false);
          return;
        }
        const res = await api.post("/auth/signup", {
          name: name.trim(),
          email: normalizedEmail,
          password,
        });
        await login(res.data.token, res.data.user);
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Something went wrong. Please try again.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-surface-dark">
      <View className="absolute inset-0 overflow-hidden">
        <LinearGradient
          colors={["#0D0D0F", "#1A1A2E", "#16213E", "#0D0D0F"]}
          style={{ position: "absolute", width: "100%", height: "100%" }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        {/* 
          ⚠️ Temporarily disabled complex background layers to find the crash source.
          Once the "Core" login renders, we will turn these back on one by one.
        */}
        {/* 
        <AnimatedOrb
          colors={["#F4A261", "#E76F51"]}
          size={300}
          initialX={-80}
          initialY={height * 0.1}
          duration={4000}
        />
        <AnimatedOrb
          colors={["#E76F51", "#F4A261"]}
          size={250}
          initialX={width - 100}
          initialY={height * 0.3}
          duration={5000}
        />
        <AnimatedOrb
          colors={["#FFD7BA", "#F4A261"]}
          size={200}
          initialX={width * 0.3}
          initialY={height * 0.6}
          duration={3500}
        />
        <AnimatedOrb
          colors={["#F4B183", "#E76F51"]}
          size={180}
          initialX={-50}
          initialY={height * 0.75}
          duration={4500}
        />

        <BlurView
          intensity={70}
          tint="dark"
          style={{ position: "absolute", width: "100%", height: "100%" }}
        />
        */}
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <SafeAreaView className="flex-1">
          <View className="items-center pt-10">
            <Image
              source={require("../../assets/images/logo.png")}
              style={{ width: 100, height: 100, marginVertical: -20 }}
              contentFit="contain"
            />
            <Text className="text-4xl font-bold text-primary font-serif tracking-wider uppercase">
              Whisper
            </Text>
          </View>

          <View className="flex-1 justify-center px-6 pb-8">
            <View className="items-center">
              <Image
                source={require("../../assets/images/auth.png")}
                style={{ width: width - 96, height: height * 0.18 }}
                contentFit="contain"
              />
              <Text className="mt-6 text-4xl font-bold text-foreground text-center">
                {mode === "sign-in" ? "Welcome back" : "Create account"}
              </Text>
              <Text className="mt-3 text-center text-base text-foreground/70">
                {mode === "sign-in"
                  ? "Sign in with your email and password."
                  : "Join Whisper and start chatting."}
              </Text>
            </View>

            <View className="mt-8 gap-4">
              {mode === "sign-up" && (
                <View className="rounded-2xl border border-white/12 bg-white/8 px-4 py-1">
                  <Text className="pt-3 text-xs font-semibold uppercase tracking-[1.5px] text-white/50">
                    Name
                  </Text>
                  <TextInput
                    autoCapitalize="words"
                    placeholder="John Doe"
                    placeholderTextColor="rgba(255,255,255,0.35)"
                    value={name}
                    onChangeText={setName}
                    className="pb-3 pt-2 text-base text-white"
                  />
                </View>
              )}

              <View className="rounded-2xl border border-white/12 bg-white/8 px-4 py-1">
                <Text className="pt-3 text-xs font-semibold uppercase tracking-[1.5px] text-white/50">
                  Email
                </Text>
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  placeholder="name@example.com"
                  placeholderTextColor="rgba(255,255,255,0.35)"
                  value={emailAddress}
                  onChangeText={setEmailAddress}
                  className="pb-3 pt-2 text-base text-white"
                />
              </View>

              <View className="rounded-2xl border border-white/12 bg-white/8 px-4 py-1">
                <Text className="pt-3 text-xs font-semibold uppercase tracking-[1.5px] text-white/50">
                  Password
                </Text>
                <TextInput
                  secureTextEntry
                  placeholder="Enter your password"
                  placeholderTextColor="rgba(255,255,255,0.35)"
                  value={password}
                  onChangeText={setPassword}
                  className="pb-3 pt-2 text-base text-white"
                />
              </View>
            </View>

            {errorMessage ? (
              <Text className="mt-4 text-center text-sm text-red-300">{errorMessage}</Text>
            ) : null}

            <Pressable
              className="mt-6 flex-row items-center justify-center rounded-2xl bg-white/95 py-4 active:scale-[0.98]"
              disabled={isSubmitting || !normalizedEmail || !password || (mode === "sign-up" && !name)}
              onPress={handleAuth}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#1a1a1a" />
              ) : (
                <Text className="text-base font-semibold text-gray-900">
                  {mode === "sign-in" ? "Sign in" : "Create account"}
                </Text>
              )}
            </Pressable>

            <Pressable
              className="mt-4 flex-row items-center justify-center gap-2"
              disabled={isSubmitting}
              onPress={() => switchMode(mode === "sign-in" ? "sign-up" : "sign-in")}
            >
              <Ionicons
                name={mode === "sign-in" ? "person-add-outline" : "log-in-outline"}
                size={18}
                color="#F4A261"
              />
              <Text className="text-sm font-semibold text-primary">
                {mode === "sign-in"
                  ? "Need an account? Create one"
                  : "Already have an account? Sign in"}
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AuthScreen;
