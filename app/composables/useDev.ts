export default function () {
  const config = useRuntimeConfig();
  const dev = config.public.hostname !== "endquote.com";
  // console.log(config.public.hostname, dev);
  return dev;
}
