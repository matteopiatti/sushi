const rawBlocks = import.meta.glob("sushi:blocks/*.svelte");

export const blocks = Object.fromEntries(
  Object.entries(rawBlocks).map(([key, val]) => [
    key.split("/").pop()!.replace(".svelte", ""),
    val,
  ]),
);
