import amqp from "amqplib";

async function main() {
  const rabbitConnString = "amqp://guest:guest@localhost:5672/";
  const connection = await amqp.connect(rabbitConnString);
  console.log("connection successful");

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
