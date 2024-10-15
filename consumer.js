const amqp = require('amqplib');
const nodemailer = require('nodemailer');

async function consumeQueue() {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const queue = 'email_queue';

    await channel.assertQueue(queue, { durable: true });

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const email = JSON.parse(msg.content.toString());

        try {
          await sendEmail(email);
          console.log("Email enviado:", email);
          channel.ack(msg);
        } catch (error) {
          console.error("Erro ao enviar email:", error);
        }
      }
    });
  } catch (error) {
    console.error("Erro ao consumir fila:", error);
  }
}

async function sendEmail(email) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'seu-email@gmail.com',
      pass: 'sua-senha',
    },
  });

  const mailOptions = {
    from: 'seu-email@gmail.com',
    to: email.to,
    subject: email.subject,
    text: email.text,
  };

  return transporter.sendMail(mailOptions);
}

consumeQueue();
