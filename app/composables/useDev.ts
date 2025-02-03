export default function () {
  const config = useRuntimeConfig();
  console.log(config.public);
  return config.public.branch !== "main";
}
