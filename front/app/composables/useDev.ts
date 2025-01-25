export default function () {
  const config = useRuntimeConfig();
  return !config.public.hostname || !config.public.hostname.split(",").includes("endquote.com");
}
