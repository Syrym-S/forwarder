import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const android = join(root, "android");
const tools = join(root, ".android-tools");
const command = process.argv[2];
const releaseApk = command === "apk" && process.argv.includes("--release");
if (!["open", "run", "apk", "aab", "test-push"].includes(command)) {
  throw new Error("Usage: node tooling/android.mjs open|run|apk|aab|test-push");
}

const gradleJavaConfig = join(android, ".gradle", "config.properties");
const configuredJavaHome = existsSync(gradleJavaConfig)
  ? /^java\.home=(.+)$/m.exec(readFileSync(gradleJavaConfig, "utf8"))?.[1]?.trim()
  : undefined;
const candidates = [
  process.env.JAVA_HOME,
  configuredJavaHome,
  ...(existsSync(tools) ? readdirSync(tools).map((entry) => join(tools, entry)) : []),
];
const javaHome = candidates.find((candidate) => {
  if (!candidate || !existsSync(join(candidate, "release"))) return false;
  return /^JAVA_VERSION="21\./m.test(readFileSync(join(candidate, "release"), "utf8"));
});
if (!javaHome) {
  throw new Error("Install JDK 21 and set JAVA_HOME, or unpack JDK 21 into .android-tools/, then retry.");
}

const sdk = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT ||
  (process.platform === "win32"
    ? join(process.env.LOCALAPPDATA || join(homedir(), "AppData", "Local"), "Android", "Sdk")
    : join(homedir(), process.platform === "darwin" ? "Library/Android/sdk" : "Android/Sdk"));
if (!existsSync(sdk)) throw new Error("Android SDK not found. Set ANDROID_HOME to its directory.");

const propertiesPath = (value) => value.replaceAll("\\", "/");
const gradleCache = process.env.GRADLE_USER_HOME || join(homedir(), ".gradle");
if (!existsSync(join(android, "local.properties"))) {
  writeFileSync(join(android, "local.properties"), `sdk.dir=${propertiesPath(sdk)}\n`);
}
mkdirSync(join(android, ".gradle"), { recursive: true });
writeFileSync(join(android, ".gradle", "config.properties"), `java.home=${propertiesPath(javaHome)}\n`);

// Android Studio's default JBR may be newer than Gradle 8 supports.
mkdirSync(join(android, ".idea"), { recursive: true });
const ideGradle = join(android, ".idea", "gradle.xml");
if (!existsSync(ideGradle)) {
  writeFileSync(ideGradle, `<project version="4">
  <component name="GradleSettings">
    <option name="serviceDirectoryPath" value="${propertiesPath(gradleCache)}" />
    <option name="linkedExternalProjectsSettings">
      <GradleProjectSettings>
        <option name="externalProjectPath" value="$PROJECT_DIR$" />
        <option name="gradleJvm" value="#GRADLE_LOCAL_JAVA_HOME" />
      </GradleProjectSettings>
    </option>
  </component>
</project>
`);
}

const env = {
  ...process.env,
  JAVA_HOME: javaHome,
  ANDROID_HOME: sdk,
  ANDROID_SDK_ROOT: sdk,
  GRADLE_USER_HOME: gradleCache,
};
console.log(`JDK 21: ${javaHome}\nAndroid SDK: ${sdk}`);
const buildTask = command === "test-push"
  ? ":app:connectedDebugAndroidTest -Pandroid.testInstrumentationRunnerArguments.class=kz.logistics360.forwarder.ForwarderPushTest --console=plain"
  : command === "aab" ? "bundleRelease" : releaseApk ? "assembleRelease" : "assembleDebug";
const result = command === "apk" || command === "aab" || command === "test-push"
  ? spawnSync(process.platform === "win32" ? "cmd.exe" : "./gradlew",
    process.platform === "win32" ? ["/d", "/s", "/c", `gradlew.bat ${buildTask}`] : [buildTask],
    { cwd: android, env, stdio: "inherit" })
  : spawnSync(process.execPath, [join(root, "node_modules", "@capacitor", "cli", "bin", "capacitor"),
    command, "android", ...(command === "run" ? ["--no-sync"] : []), ...process.argv.slice(3)],
    { cwd: root, env, stdio: "inherit" });
if (result.error) throw result.error;
process.exit(result.status ?? 1);
