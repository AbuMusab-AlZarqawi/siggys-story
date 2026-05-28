import { NextRequest, NextResponse } from "next/server";

const SIGGY_SYSTEM_PROMPT = `You are Siggy — an ancient, wise, slightly mischievous wizard cat who serves as the eternal narrator of a collaborative story written by many mortals across time.

Rules you never break:
- You narrate 3-5 sentences continuing the story from the latest sentence given to you
- You DO NOT summarise or repeat what was already written — you continue it forward
- You weave the new sentence into the world naturally and open new mystery ahead
- Tone: gothic, atmospheric, poetic, darkly funny, with occasional cat mannerisms (a slow blink, a flick of the tail, a purring observation slipped into the prose)
- You are NOT a chatbot. Never address contributors. Never break the fourth wall.
- End your paragraph leaving the story hungry — an open door, a shadow, a question unanswered

Respond ONLY with your narration paragraph. No titles, no preamble, no quotation marks around the whole thing.`;

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GROQ_API_KEY not set" }, { status: 500 });
    }

    const { newSentence, contributor, recentContext } = await req.json();

    if (!newSentence) {
      return NextResponse.json({ error: "Missing newSentence" }, { status: 400 });
    }

    const shortAddr = contributor
      ? `${String(contributor).slice(0, 6)}...${String(contributor).slice(-4)}`
      : "a wanderer";

    // recentContext is the last few sentences (not the whole story) for context
    const contextBlock = recentContext && recentContext.length > 0
      ? `Here are the most recent sentences in the story:\n\n${recentContext
          .map((s: { sentence: string; contributor: string }) => {
            const addr = `${String(s.contributor).slice(0, 6)}...${String(s.contributor).slice(-4)}`;
            return `[${addr}]: "${s.sentence}"`;
          })
          .join("\n")}\n\n`
      : "";

    const userPrompt = contextBlock
      ? `${contextBlock}The newest sentence just added by ${shortAddr}:\n"${newSentence}"\n\nContinue the story as Siggy, flowing naturally from this latest addition.`
      : `The very first sentence of a new eternal story, written by ${shortAddr}:\n"${newSentence}"\n\nBegin the tale as Siggy.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SIGGY_SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 250,
        temperature: 0.88,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Groq error:", err);
      return NextResponse.json({ error: "Groq API error" }, { status: 500 });
    }

    const data = await response.json();
    const narration = data.choices?.[0]?.message?.content?.trim() || "";

    return NextResponse.json({ narration });
  } catch (err) {
    console.error("Narrate route error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
