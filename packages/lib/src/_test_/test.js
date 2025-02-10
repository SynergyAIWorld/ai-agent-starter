import { connect } from "amqplib";

await (async () => {
  try {
    const queue = "DEFAULT_EVENT_LOG";
    const conn = await connect(
      "amqp://mission:mission233@13.229.89.57:5672/mission_vhost",
    );

    // const ch1 = await conn.createChannel();
    // await ch1.assertQueue(queue);
    //
    // // Listener
    // await ch1.consume(queue, (msg) => {
    //   if (msg !== null) {
    //     console.log("Received:", msg.content.toString());
    //     ch1.ack(msg);
    //   } else {
    //     console.log("Consumer cancelled by server");
    //   }
    // });

    // Sender
    const ch2 = await conn.createChannel();

    setInterval(() => {
      ch2.sendToQueue(queue, Buffer.from("something to do"));
    }, 1000);
  } catch (e) {
    console.error(e);
  }
})();
