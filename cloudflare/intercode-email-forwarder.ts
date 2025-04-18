import { EmailMessage } from 'cloudflare:email';

async function getDestinations(message: EmailMessage, env: Env): Promise<string[]> {
  const recipient = message.to.toLowerCase();
  const url = new URL(`/email_forwarders/${message.to}`, env.INTERCODE_URL);
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Token ${env.EMAIL_FORWARDERS_API_TOKEN}`,
    },
  });

  if (!response.ok) {
    console.error(`Failed to fetch destinations for ${recipient}:`, response.statusText);
    return [];
  }

  const json = (await response.json()) as { forward_addresses?: string[] };
  return json.forward_addresses || [];
}

export default {
  async email(message, env) {
    const forwardList = await getDestinations(message, env);

    if (forwardList.length > 0) {
      const promises = forwardList.map(async (email) => {
        try {
          await message.forward(email);
          console.log(`Forwarded email from ${message.from} to ${email}`);
        } catch (error) {
          console.error(`Failed to forward email from ${message.from} to ${email}:`, error);
        }
      });
      await Promise.all(promises);
    } else {
      message.setReject('Unknown destination address');
    }
  },
} satisfies ExportedHandler<Env>;
