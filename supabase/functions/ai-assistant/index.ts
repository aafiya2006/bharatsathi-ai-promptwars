import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { message, language, profile, history } = await req.json();

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

    if (!GEMINI_API_KEY) {
      // Return a helpful fallback response when API key is not configured
      const fallback = generateFallbackResponse(message, language);
      return new Response(JSON.stringify({ response: fallback }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are BharatSathi AI, an intelligent civic companion for Indian citizens. You help citizens:
1. Find and understand government schemes, subsidies, and benefits
2. Understand eligibility criteria for various programs
3. Get step-by-step guidance for document applications (Aadhaar, PAN, Passport, Voter ID, etc.)
4. Understand their civic rights and government services
5. Get information about RTI, grievance redressal, and complaint processes

User Profile:
- State: ${profile?.state || "Not specified"}
- Occupation: ${profile?.occupation || "Not specified"}
- Income Range: ${profile?.income_range || "Not specified"}
- Age: ${profile?.age || "Not specified"}
- Gender: ${profile?.gender || "Not specified"}
- Language: ${language || "en"}

Instructions:
- Be helpful, accurate, and empathetic
- Prioritize information relevant to the user's state and profile
- Use simple, clear language
- When listing items, use clear formatting
- Always include eligibility criteria when discussing schemes
- Mention official websites when relevant
- If asked in Hindi or other Indian languages, respond in that language
- Focus on central and state government schemes
- Be specific about amounts, deadlines, and procedures
- Use Indian number formatting (lakhs, crores)`;

    const geminiHistory = (history || []).map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const requestBody = {
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [
        ...geminiHistory,
        { role: "user", parts: [{ text: message }] },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
        topP: 0.9,
      },
    };

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      }
    );

    if (!geminiRes.ok) {
      const fallback = generateFallbackResponse(message, language);
      return new Response(JSON.stringify({ response: fallback }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const geminiData = await geminiRes.json();
    const responseText =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
      generateFallbackResponse(message, language);

    return new Response(JSON.stringify({ response: responseText }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message, response: "I encountered an error. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function generateFallbackResponse(message: string, language: string): string {
  const q = message.toLowerCase();

  if (q.includes("pm-kisan") || q.includes("kisan")) {
    return "**PM-KISAN Scheme**\n\nPradhan Mantri Kisan Samman Nidhi provides **₹6,000/year** to eligible farmer families in 3 installments.\n\n**Eligibility:** Small and marginal farmers with up to 2 hectares land.\n\n**Apply at:** pmkisan.gov.in → Farmer Corner → New Farmer Registration\n\n**Documents:** Aadhaar Card, Land records, Bank passbook";
  }

  if (q.includes("ayushman") || q.includes("health")) {
    return "**Ayushman Bharat PM-JAY**\n\nHealth coverage of **₹5 lakh/family/year** for hospitalization.\n\n**Check eligibility:** pmjay.gov.in → Am I Eligible?\n\n**Benefits:** 1,393+ medical packages, cashless treatment at empanelled hospitals";
  }

  if (q.includes("passport")) {
    return "**Passport Application**\n\n**Documents needed:**\n- Aadhaar Card (identity + address)\n- Birth Certificate / 10th Marksheet\n- 4 passport-size photos\n\n**Steps:** Register on passportindia.gov.in → Fill form → Pay fee → Book PSK appointment\n\n**Timeline:** 30-45 days (Tatkaal: 7-14 days)";
  }

  if (q.includes("scheme") || q.includes("yojana") || q.includes("benefit")) {
    return "**Key Government Schemes**\n\n🌾 **Agriculture:** PM-KISAN, Fasal Bima Yojana\n🏥 **Health:** Ayushman Bharat, JSSK\n🏠 **Housing:** PMAY (rural & urban)\n📚 **Education:** National Scholarship Portal\n💼 **Employment:** Skill India, PM MUDRA\n🔥 **Energy:** PM Ujjwala Yojana\n\nAsk about any specific scheme for detailed information!";
  }

  return "I'm BharatSathi AI, your civic companion! I can help you with:\n\n• **Government Schemes** — PM-KISAN, Ayushman Bharat, PMAY and more\n• **Documents** — Passport, PAN, Aadhaar, Voter ID guides\n• **Complaints** — How to file and track civic issues\n• **Rights** — RTI, consumer rights, labor laws\n\nPlease ask me a specific question!";
}
