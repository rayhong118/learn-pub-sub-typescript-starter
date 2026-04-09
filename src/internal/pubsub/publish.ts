import type { ConfirmChannel } from "amqplib";

export function publishJSON<T>(
  ch: ConfirmChannel,
  exchange: string,
  routingKey: string,
  value: T,
): Promise<void> {
  // serialize
  const valueString = JSON.stringify(value);
  const valueBuffer = Buffer.from(valueString);

  return new Promise((resolve, reject) => {
    ch.publish(
      exchange,
      routingKey,
      valueBuffer,
      {
        contentType: "application/json",
      },
      (err, _ok) => {
        if (err) {
          return reject(err);
        }
        resolve();
      },
    );
  });
}
