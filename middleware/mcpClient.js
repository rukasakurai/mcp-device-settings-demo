const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
const fetch = require("node-fetch");

const endpoint = process.env.OPENAI_ENDPOINT;
const apiKey = process.env.OPENAI_API_KEY;
const mcpServerUrl = process.env.MCP_SERVER_URL;

const client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));

async function getCameraSettings(context) {
  const prompt = `Given the following context, suggest the best camera settings for aperture and white balance: ${context}`;

  const response = await client.completions.create({
    model: "text-davinci-003",
    prompt: prompt,
    max_tokens: 50,
  });

  const toolDecision = response.choices[0].text.trim();

  const serverResponse = await fetch(mcpServerUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ context: toolDecision }),
  });

  const data = await serverResponse.json();
  return data;
}

module.exports = { getCameraSettings };
