// api/log_data.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Kun POST er tillatt' });
  }

  try {
    const { page, event_description, klartekst_input } = req.body;

    // Her bytter vi til den nye 'data'-tabellen
    const { data, error } = await supabase
      .from('data') // <-- ENDRET TIL NY TABELL
      .insert({
        kildeside: page,                 // <-- Maps til den nye kolonnen
        input_type: event_description,   // <-- Maps til den nye kolonnen
        input_verdi: klartekst_input,    // <-- Maps til den nye kolonnen
      });

    if (error) { throw error; }

    res.status(200).json({ message: 'Data logget i den nye tabellen!' });
  } catch (error) {
    console.error('Supabase error:', error);
    res.status(500).json({ message: `Serverfeil: ${error.message}` });
  }
}