import dotenv from "dotenv";
import * as ftp from "basic-ftp";

dotenv.config({ path: ".env.ftp" });

const required = ["FTP_HOST", "FTP_USER", "FTP_PASSWORD"];
const missing = required.filter((key) => !process.env[key]);

if (missing.length) {
  console.error(`[CONFIG ERROR] Missing env variables: ${missing.join(", ")}`);
  process.exit(1);
}

const config = {
  host: process.env.FTP_HOST,
  port: Number(process.env.FTP_PORT || 21),
  user: process.env.FTP_USER,
  password: process.env.FTP_PASSWORD,
  secure: process.env.FTP_SECURE === "true",
  remoteDir: process.env.FTP_REMOTE_DIR || "/",
  timeout: Number(process.env.FTP_TIMEOUT || 30000),
};

const client = new ftp.Client(config.timeout);

function logStage(number, name, message) {
  console.log(`\n[STAGE ${number}/3] ${name}`);
  console.log(message);
}

function fail(stage, error) {
  console.error(`\n[ERROR] ${stage}`);
  console.error(`Message: ${error?.message || error}`);
  if (error?.code) console.error(`Code: ${error.code}`);
}

async function run() {
  let handshakeOk = false;
  let authOk = false;
  let listOk = false;

  console.log("=== FTP THREE-STAGE CHECK ===");
  console.log(`Host: ${config.host}:${config.port}`);

  try {
    // STAGE 1: TCP connection + FTP server greeting.
    logStage(1, "HANDSHAKE", "Connecting to FTP server...");
    await client.connect(config.host, config.port);
    handshakeOk = true;
    console.log("OK: FTP server connection established.");

    // STAGE 2: USER/PASS authentication.
    logStage(2, "AUTH", `Authenticating as "${config.user}"...`);
    await client.login(config.user, config.password);
    if (config.secure) {
      await client.useTLS();
    }
    authOk = true;
    console.log("OK: Authentication successful.");

    // Passive mode is selected automatically by basic-ftp for data commands.
    // STAGE 3: open data connection and retrieve directory listing.
    logStage(3, "DATA", `Getting file list from "${config.remoteDir}"...`);
    await client.cd(config.remoteDir);
    const files = await client.list();
    listOk = true;

    if (files.length === 0) {
      console.log("OK: Directory is empty.");
    } else {
      console.table(
        files.map((file) => ({
          name: file.name,
          type: file.isDirectory ? "DIR" : "FILE",
          size: file.size,
          modified: file.modifiedAt?.toISOString?.() || "-",
        })),
      );
      console.log(`OK: Received ${files.length} item(s).`);
    }
  } catch (error) {
    if (!handshakeOk) fail("HANDSHAKE FAILED", error);
    else if (!authOk) fail("AUTH FAILED", error);
    else fail("DATA/LIST FAILED", error);

    process.exitCode = 1;
  } finally {
    client.close();

    console.log("\n=== RESULT ===");
    console.log(`Handshake : ${handshakeOk ? "OK" : "FAILED"}`);
    console.log(`Auth      : ${authOk ? "OK" : "FAILED"}`);
    console.log(`File list : ${listOk ? "OK" : "FAILED"}`);
    console.log(
      listOk
        ? "FTP check completed successfully."
        : "FTP check completed with errors.",
    );
  }
}

run();
