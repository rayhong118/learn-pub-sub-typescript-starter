import amqp from "amqplib";
import { type PlayingState } from "../internal/gamelogic/gamestate.js";
import { publishJSON } from "../internal/pubsub/publish.js";
import { ExchangePerilDirect, PauseKey } from "../internal/routing/routing.js";

async function main() {
  const rabbitConnString = "amqp://guest:guest@localhost:5672/";
  const connection = await amqp.connect(rabbitConnString);
  console.log("connection successful");

  const confirmChannel = await connection.createConfirmChannel();

  const playingState: PlayingState = { isPaused: true };

  publishJSON(confirmChannel, ExchangePerilDirect, PauseKey, playingState);

  // Handle Ctrl+C (SIGINT) and standard termination (SIGTERM)
  const handleExit = async () => {
    console.log("\nClosing RabbitMQ connection...");
    await connection.close();
    process.exit(0);
  };

  process.on("SIGINT", handleExit);
  process.on("SIGTERM", handleExit);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
