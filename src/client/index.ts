import amqp from "amqplib";
import { clientWelcome } from "../internal/gamelogic/gamelogic.js";
import {
  declareAndBind,
  SimpleQueueType,
} from "../internal/pubsub/declareAndBind.js";
import { ExchangePerilDirect, PauseKey } from "../internal/routing/routing.js";
async function main() {
  console.log("Starting Peril client...");

  const rabbitConnString = "amqp://guest:guest@localhost:5672/";
  const connection = await amqp.connect(rabbitConnString);
  console.log("connection successful");

  // Handle Ctrl+C (SIGINT) and service termination (SIGTERM)
  const handleExit = async () => {
    console.log("\nClosing RabbitMQ connection...");
    await connection.close();
    process.exit(0);
  };
  process.on("SIGINT", handleExit);
  process.on("SIGTERM", handleExit);

  // prompt user for a username
  const userName = await clientWelcome();
  declareAndBind(
    connection,
    ExchangePerilDirect,
    `pause.${userName}`,
    PauseKey,
    SimpleQueueType.Transient,
  );
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
