export default function () {
  const config = useRuntimeConfig();
  let dev = config.public.hostname !== "endquote.com";
  // console.log({ dev });
  return dev;
}
