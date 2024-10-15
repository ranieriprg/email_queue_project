const amqp = require('amqplib');

async function sendToQueue(email) {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const queue = 'email_queue';

    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(email)), {
      persistent: true,
    });

    console.log("Email enviado para a fila:", email);

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.error("Erro ao enviar email para a fila:", error);
  }
}

// Testando o envio de um email
const email = {
  to: 'exemplo@dominio.com',
  subject: 'Test RabbitMQ',
  text: 'Este é um teste de envio de e-mail via fila com RabbitMQ'
};

sendToQueue(email);
