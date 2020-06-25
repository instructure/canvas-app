import {setupWorker, rest} from "msw";

function parseAPIResponse(input) {
  return JSON.parse(input.replace("while(1);", ""));
}
const worker = setupWorker(
  // This will proxy any API requests, but doesn't currently support
  // authenticated requests while running outside of Canvas.
  rest.get("/api/*", async (req, res, ctx) => {
    const canvasOrigin = process.env.CANVAS_ORIGIN || "http://canvas.docker";
    // Modify the req.url to point to our running Canvas instance
    req.url = new URL(req.url.pathname, canvasOrigin);
    // Perform an original request to the intercepted request URL
    try {
      const originalResponse = await ctx.fetch(req);

      return res(ctx.json(parseAPIResponse(originalResponse)));
    } catch (err) {
      return res(
        ctx.json({
          noResults: true,
        }),
      );
    }
  }),
);

worker.start();
