export default function () {
  const config = useRuntimeConfig();
  const dev = !config.public.hostname || !config.public.hostname.split(",").includes("endquote.com");
  console.log({ dev });
  return dev;
}
