import debug from "debug";

const getDebugger = () => {
  const d = debug("tsdm:debug");
  const e = debug("tsdm:error");
  const w = debug("tsdm:warn");
  const i = debug("tsdm:info");
  const t = debug("tsdm:trace");

  return {
    debug: (msg: string) => d(msg),
    error: (msg: string) => e(msg),
    warn: (msg: string) => w(msg),
    info: (msg: string) => i(msg),
    trace: (msg: string) => t(msg),
  };
};

export default getDebugger;
