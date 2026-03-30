import { error, type RequestEvent } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";

export async function handle({
  event,
  resolve,
}: {
  event: RequestEvent;
  resolve: (event: RequestEvent) => Promise<Response>;
}) {
  if (
    event.url.pathname.startsWith("/__sushi_editor__") &&
    !(env.SUSHI_EDITOR === "true")
  ) {
    throw error(404, "To use Editor start it with 'sushi editor'");
  }
  return resolve(event);
}
