-- Insert sample categories
INSERT INTO categories (name, slug, description) VALUES
('Politics', 'politics', 'Political news and analysis'),
('Technology', 'technology', 'Latest tech news and innovations'),
('Business', 'business', 'Business and financial news'),
('Health', 'health', 'Health and medical news'),
('Sports', 'sports', 'Sports news and updates'),
('Entertainment', 'entertainment', 'Entertainment and celebrity news'),
('Science', 'science', 'Scientific discoveries and research')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample articles
INSERT INTO articles (title, slug, excerpt, content, author, category_id, published, featured, published_at) VALUES
(
  'Global Summit Addresses Climate Change Initiatives',
  'global-summit-addresses-climate-change-initiatives',
  'World leaders gather to discuss new policies aimed at reducing carbon emissions and promoting sustainable energy solutions.',
  'World leaders from across the globe have convened at the International Climate Summit to address pressing environmental concerns and establish new frameworks for combating climate change. The summit, held in Geneva, brings together representatives from over 150 countries to discuss innovative policies aimed at reducing carbon emissions and promoting sustainable energy solutions.

Key topics on the agenda include renewable energy investments, carbon pricing mechanisms, and international cooperation on environmental protection. The summit aims to build upon previous climate agreements and establish more ambitious targets for the coming decade.

"This is a critical moment for our planet," said Dr. Maria Rodriguez, the summit''s lead coordinator. "We must act decisively to ensure a sustainable future for generations to come."

The discussions are expected to result in new binding commitments from participating nations, with implementation timelines to be announced by the end of the week.',
  'Jane Smith',
  (SELECT id FROM categories WHERE slug = 'politics'),
  true,
  true,
  NOW() - INTERVAL '2 days'
),
(
  'Tech Giants Announce New AI Collaboration',
  'tech-giants-announce-new-ai-collaboration',
  'Major technology companies join forces to develop ethical AI standards and promote responsible innovation.',
  'Leading technology companies have announced a groundbreaking collaboration to establish industry-wide standards for artificial intelligence development and deployment. The initiative, dubbed the "AI Ethics Alliance," brings together major players in the tech industry to address growing concerns about AI safety and responsible innovation.

The collaboration will focus on developing comprehensive guidelines for AI development, ensuring transparency in algorithmic decision-making, and promoting diversity in AI research teams. Companies involved in the initiative have committed to sharing research findings and best practices to accelerate progress in ethical AI development.

"We believe that collaboration is key to ensuring AI benefits everyone," said Dr. Sarah Chen, Chief Technology Officer at one of the participating companies. "By working together, we can address the challenges and opportunities that AI presents to society."

The alliance plans to publish its first set of guidelines within six months, with regular updates to reflect the rapidly evolving nature of AI technology.',
  'Michael Johnson',
  (SELECT id FROM categories WHERE slug = 'technology'),
  true,
  false,
  NOW() - INTERVAL '1 day'
),
(
  'Economic Markets Show Strong Recovery Signs',
  'economic-markets-show-strong-recovery-signs',
  'Financial analysts report positive trends across major stock exchanges as economic indicators point to sustained growth.',
  'Global financial markets are showing robust signs of recovery as key economic indicators point to sustained growth across major economies. Stock exchanges in New York, London, and Tokyo have all reported significant gains over the past quarter, with technology and healthcare sectors leading the charge.

Economic analysts attribute the positive trends to a combination of factors, including increased consumer confidence, strong corporate earnings, and supportive monetary policies from central banks worldwide. The recovery appears to be broad-based, with both developed and emerging markets participating in the upward trend.

"We''re seeing a fundamental shift in market sentiment," explained Dr. Robert Williams, Chief Economist at Global Financial Research. "The data suggests that the recovery is not just a temporary bounce, but rather the beginning of a sustained period of growth."

However, experts caution that challenges remain, including ongoing geopolitical tensions and potential supply chain disruptions. Investors are advised to maintain a diversified portfolio approach while capitalizing on emerging opportunities.',
  'Emily Davis',
  (SELECT id FROM categories WHERE slug = 'business'),
  true,
  false,
  NOW() - INTERVAL '3 hours'
);
