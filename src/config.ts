import { config as configDotenv } from "dotenv";

function stringEnvVar(envVarName: keyof typeof process["env"]): string;

function stringEnvVar(
  envVarName: keyof typeof process["env"],
  defaultValue: string
): string;

function stringEnvVar(
  envVarName: keyof typeof process["env"],
  defaultValue: null
): string | undefined;
function stringEnvVar(
  envVarName: keyof typeof process["env"],
  defaultValue?: string | null,
): string | undefined {
  const value = process.env[envVarName];
  if (value == null && defaultValue === undefined) {
    console.error(`Missing env var ${envVarName}`);
    process.exit(1);
  }
  return value ?? defaultValue ?? undefined;
}
function intEnvVar(
  envVarName: keyof typeof process["env"],
  defaultValue?: number,
): number {
  if (defaultValue != null) {
    const value = stringEnvVar(envVarName, null);
    if (value == null) {
      return defaultValue;
    }
    return parseInt(value, 10);
  } else {
    const value = stringEnvVar(envVarName);
    return parseInt(value, 10);
  }
}
function boolEnvVar(
  envVarName: keyof typeof process["env"],
  defaultValue = false,
): boolean {
  const value = stringEnvVar(envVarName, null);
  if (value == null) {
    return defaultValue;
  }
  return value === "true";
}

function arrayEnvVar(
  envVarName: keyof typeof process["env"],
  defaultValue?: string[],
): string[] {
  if (defaultValue != null) {
    const value = stringEnvVar(envVarName, null);
    if (value == null) {
      return defaultValue;
    }
    return value.split(",");
  } else {
    const value = stringEnvVar(envVarName);
    return value.split(",");
  }
}
export function getConfig() {
  configDotenv();
  return {
    username: stringEnvVar("S2M_USER"),
    password: stringEnvVar("S2M_PASSWORD"),
    country: stringEnvVar("S2M_COUNTRY"),
    loginStore: stringEnvVar("S2M_LOGIN_STORE", "auth.data"),
    pollInterval: intEnvVar("S2M_POLL_INTERVAL", 30),
    mqttUrl: stringEnvVar("S2M_MQTT_URI"),
    mqttClientId: stringEnvVar("S2M_MQTT_CLIENT_ID", "solix2mqtt"),
    mqttUsername: stringEnvVar("S2M_MQTT_USERNAME", null),
    mqttPassword: stringEnvVar("S2M_MQTT_PASSWORD", null),
    mqttRetain: boolEnvVar("S2M_MQTT_RETAIN"),
    mqttTopic: stringEnvVar("S2M_MQTT_TOPIC", "solix"),
    verbose: boolEnvVar("S2M_VERBOSE", false),
  };
}

export function anonymizeConfig(
  config: ReturnType<typeof getConfig>,
): ReturnType<typeof getConfig> {
  const newConfig = { ...config };
  const hideKeys: Array<keyof ReturnType<typeof getConfig>> = [
    "password",
  ];
  for (const key of hideKeys) {
    if (config[key] != null) {
      (newConfig as any)[key] = "***";
    }
  }
  return newConfig;
}
