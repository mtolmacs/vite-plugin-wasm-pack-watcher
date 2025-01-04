import { ChildProcess, spawn } from "child_process";
import { PluginOption, WebSocketServer } from "vite";

let ws: WebSocketServer | null = null;

const debounce = <Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay: number
) => {
  let timer: NodeJS.Timeout | null = null;

  return (...args: Args) => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

const builder = () => {
  let buildProcess: ChildProcess | null = null;

  return (buildCommand?: string) => {
    if (buildProcess) {
      buildProcess.kill();
    }

    const parts = buildCommand?.split(" ");
    const command = parts?.[0] ?? "wasm-pack";
    const args = parts?.slice(1) ?? ["build", "--dev"];

    buildProcess = spawn(command, args);
    buildProcess.stdout.on("data", (data) => {
      console.log(data.toString());
    });
    buildProcess.stderr.on("data", (data) => {
      console.error(data.toString());
    });
    buildProcess.on("close", (code) => {
      if (code === 0 && ws) {
        ws.send({ type: "full-reload", path: "*" });
      }
    });
  };
};

const buildWithWasmPack = debounce(builder(), 100);

export default function wasmPackWatchPlugin(options?: {
  buildCommand?: string;
}): PluginOption {
  return {
    name: "wasm-pack-watch",
    watchChange(id) {
      if (id.endsWith(".rs")) {
        buildWithWasmPack(options?.buildCommand);
      }
    },
    configureServer(server) {
      ws = server.ws;
    },
  };
}
