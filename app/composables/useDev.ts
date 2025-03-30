export default function () {
  const config = useRuntimeConfig();
  const dev = config.hostname !== "endquote.com";
  // console.log({ dev });
  return dev;
}
