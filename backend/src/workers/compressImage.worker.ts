import { parentPort, workerData } from "node:worker_threads";
import { Readable, Writable } from "node:stream";
import sharp from "sharp";

type WorkerData = { image: Uint8Array };
type WorkerResult =
  | { ok: true; image: Uint8Array }
  | { ok: false; error: string };

async function compress(input: Uint8Array): Promise<Buffer> {
  const chunks: Buffer[] = [];

  const collector = new Writable({
    write(chunk, _encoding, callback) {
      chunks.push(chunk);
      callback();
    },
  });

  await new Promise<void>((resolve, reject) => {
    Readable.from(Buffer.from(input))
      .pipe(
        sharp()
          .rotate()
          .resize({ width: 1600, withoutEnlargement: true })
          .jpeg({ quality: 70 }),
      )
      .pipe(collector)
      .on("finish", resolve)
      .on("error", reject);
  });

  return Buffer.concat(chunks);
}

async function main() {
  const { image } = workerData as WorkerData;

  try {
    const compressed = await compress(image);
    const result: WorkerResult = { ok: true, image: compressed };
    // Not using transferList here: Buffer.concat can return a view into
    // Node's shared allocation pool for small outputs, and transferring
    // that would detach memory other unrelated allocations still use.
    parentPort!.postMessage(result);
  } catch (err) {
    const result: WorkerResult = {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
    parentPort!.postMessage(result);
  }
}

main();
