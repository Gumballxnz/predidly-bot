// Supabase Edge Function para Facebook Conversions API
// Deploy: supabase functions deploy facebook-capi

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createHash } from "https://deno.land/std@0.168.0/crypto/mod.ts"

const PIXEL_ID = "2005862116860795"
const ACCESS_TOKEN = "EAAMAmvHM3vQBQAV7Cb9y813ovS0XFOyu9Prc9iArlErJw7XFIXU6PWPQNDAbzSZAIjMZAyCHaynK8E8Eb0SO8vlZBIAUrAa3jpmToXgy4APMbSQ5o2G07mCHwoP3Q8sRNX77LPq9Wfeyu6fj67X2XZBGS388QtZC6VlXmq1vivstvhZCL9vfpCZBepSneutywZDZD"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Função para hash SHA256 (Facebook exige dados hasheados)
async function hashData(data: string): Promise<string> {
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data.toLowerCase().trim())
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    
    const {
      event_name,      // PageView, ViewContent, InitiateCheckout, AddToCart, Purchase
      event_source_url,
      user_data = {},  // { email, phone, client_ip_address, client_user_agent, fbc, fbp }
      custom_data = {} // { currency, value, content_name, content_ids }
    } = body

    // Preparar dados do usuário (com hash quando necessário)
    const hashedUserData: any = {}
    
    if (user_data.email) {
      hashedUserData.em = [await hashData(user_data.email)]
    }
    if (user_data.phone) {
      hashedUserData.ph = [await hashData(user_data.phone)]
    }
    if (user_data.client_ip_address) {
      hashedUserData.client_ip_address = user_data.client_ip_address
    }
    if (user_data.client_user_agent) {
      hashedUserData.client_user_agent = user_data.client_user_agent
    }
    if (user_data.fbc) {
      hashedUserData.fbc = user_data.fbc
    }
    if (user_data.fbp) {
      hashedUserData.fbp = user_data.fbp
    }

    // Construir payload para Facebook
    const payload = {
      data: [{
        event_name: event_name,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        event_source_url: event_source_url || "https://predidly-bot.vercel.app",
        user_data: hashedUserData,
        custom_data: custom_data
      }]
    }

    // Enviar para Facebook Conversions API
    const fbResponse = await fetch(
      `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      }
    )

    const fbResult = await fbResponse.json()

    console.log('Facebook CAPI Response:', fbResult)

    return new Response(
      JSON.stringify({ 
        success: true, 
        event: event_name,
        facebook_response: fbResult 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
