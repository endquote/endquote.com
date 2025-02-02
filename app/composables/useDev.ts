export default function () {
  const config = useRuntimeConfig();
  console.log(config);
  return !config.public.hostname || !config.public.hostname.split(",").includes("endquote.com");
}
