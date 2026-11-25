import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const { appId } = JSON.parse(readFileSync(join(root, "capacitor.config.json"), "utf8"));
const sdk = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT ||
  (process.platform === "win32" ? join(process.env.LOCALAPPDATA, "Android", "Sdk")
    : join(homedir(), process.platform === "darwin" ? "Library/Android/sdk" : "Android/Sdk"));
const adb = join(sdk, "platform-tools", process.platform === "win32" ? "adb.exe" : "adb");
if (!existsSync(adb)) throw new Error("Android SDK platform-tools not found.");
const target = process.argv[2];
function run(...args) {
  const result = spawnSync(adb, [...(target ? ["-s", target] : []), ...args], { encoding: "utf8" });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr || result.stdout || "adb failed");
  return result.stdout.trim();
}
const receivers = run("shell", "cmd", "package", "query-receivers", "--components", "-n", `${appId}/kz.logistics360.forwarder.DebugPushReceiver`);
if (!receivers.includes("DebugPushReceiver")) {
  throw new Error("Install the debug APK, sign in and enable push notifications before running this local display check.");
}
run("shell", "input", "keyevent", "KEYCODE_HOME");
run("shell", "am", "kill", appId);
console.log(run("shell", "am", "broadcast", "--receiver-foreground", "-n", `${appId}/kz.logistics360.forwarder.DebugPushReceiver`));
run("shell", "cmd", "statusbar", "expand-notifications");
console.log("Local Android display check sent. Check the notification shade. This does not test delivery through FCM.");
