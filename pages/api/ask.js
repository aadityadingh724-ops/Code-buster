export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { question } = req.body;
  
  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Please provide a valid farming question.' });
  }
  
  try {
    // Use Gemini API for intelligent responses
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyBvZp8kF8X9QsP5hJRN4wGmP3LkT7yU9vA'; // You should set this in environment variables
    
    const prompt = `You are an expert agricultural advisor specializing in Kerala, India farming practices. 
    
    Context: Kerala has a tropical climate with two monsoon seasons, laterite soil, and is known for crops like rice, coconut, pepper, banana, spices, and various vegetables. Farmers here practice both traditional and modern farming methods.
    
    Question: ${question}
    
    Please provide a practical, detailed answer that includes:
    1. Specific advice for Kerala's climate and soil conditions
    2. Local varieties or methods when applicable
    3. Seasonal considerations (monsoons, summer, winter)
    4. Organic/sustainable practices when possible
    5. Common challenges and solutions
    6. Practical implementation steps
    
    Keep the response informative but concise (2-4 paragraphs). Focus on actionable advice that Kerala farmers can implement.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const answer = data.candidates[0].content.parts[0].text;
      res.status(200).json({ answer });
    } else {
      throw new Error('Invalid response from Gemini API');
    }
    
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    
    // Fallback to enhanced local knowledge if API fails
    const questionLower = question.toLowerCase();
    let fallbackAnswer = '';
    
    // Enhanced fallback responses for common topics
    if (questionLower.includes('rice') || questionLower.includes('paddy')) {
      fallbackAnswer = 'For rice cultivation in Kerala: Plant during Virippu (June-July) or Mundakan (December-January) seasons. Use varieties like Jyothi, Uma, or Swetha. Maintain water level at 2-5cm during flowering. Apply organic fertilizers and practice System of Rice Intensification (SRI) for better yields. Control pests with neem-based solutions.';
    } else if (questionLower.includes('coconut')) {
      fallbackAnswer = 'Coconut farming in Kerala: Plant during pre-monsoon (April-May) or post-monsoon (September-October). Use varieties like Chowghat Orange Dwarf or West Coast Tall. Maintain 7.5m spacing, apply 50kg organic manure annually. Control red palm weevil with pheromone traps and rhinoceros beetle with light traps.';
    } else if (questionLower.includes('pepper')) {
      fallbackAnswer = 'Pepper cultivation in Kerala: Use well-drained red laterite soil with pH 6.0-7.0. Plant around support trees like mango or coconut. Prepare pits with topsoil, cow dung, and compost mixture. Control quick wilt with proper drainage and resistant varieties like Panniyur-1. Train vines in spiral manner.';
    } else if (questionLower.includes('organic') || questionLower.includes('fertilizer')) {
      fallbackAnswer = 'Organic farming in Kerala: Use compost from kitchen waste, vermicompost with earthworms, and green manure from leguminous crops. Apply neem cake for pest control, cow dung slurry as liquid fertilizer. Practice crop rotation, companion planting with marigold, and use beneficial insects for natural pest control.';
    } else if (questionLower.includes('soil')) {
      fallbackAnswer = 'Kerala soil management: Test soil pH regularly as laterite soils are often acidic. Add lime to neutralize acidity, incorporate organic matter through compost and vermicompost. Practice contour farming on slopes, maintain cover crops, and avoid excessive chemical fertilizers. Green manuring with Sesbania improves fertility.';
    } else {
      fallbackAnswer = 'For specific agricultural guidance in Kerala, I recommend consulting your nearest Krishi Vigyan Kendra (KVK) or local agriculture officer. They can provide detailed advice based on your specific location, soil conditions, and crop requirements. You can also join local farmer groups for peer support and knowledge sharing.';
    }
    
    res.status(200).json({ 
      answer: fallbackAnswer,
      note: 'Response generated using local knowledge base. For more detailed answers, ensure proper API configuration.'
    });
  }
}
