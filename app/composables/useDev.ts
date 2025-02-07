export default function () {
  const config = useRuntimeConfig();
  let dev = config.public.hostname !== "endquote.com";
  if (dev && import.meta.client && useRoute().query.dev === "false") {
    dev = false;
  }
  // console.log({ dev });
  return dev;
}
