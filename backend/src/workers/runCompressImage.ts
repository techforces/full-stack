import path from "node:path";
import { Worker } from "node:worker_threads";

const isTsRuntime = __filename.endsWith(".ts");
const workerPath = path.join(
  __dirname,
  isTsRuntime ? "compressImage.worker.ts" : "compressImage.worker.js",
);

type WorkerResult =
  | { ok: true; image: Uint8Array }
  | { ok: false; error: string };

export function compressImageInWorker(image: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    let settled = false;

    const worker = new Worker(workerPath, {
      workerData: { image },
      execArgv: isTsRuntime ? ["-r", "ts-node/register/transpile-only"] : [],
    });

    worker.once("message", (result: WorkerResult) => {
      settled = true;
      worker.terminate();
      if (result.ok) {
        resolve(Buffer.from(result.image));
      } else {
        reject(new Error(result.error));
      }
    });

    worker.once("error", (err) => {
      settled = true;
      worker.terminate();
      reject(err);
    });

    worker.once("exit", (code) => {
      if (!settled && code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}
