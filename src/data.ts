export interface EpisodeImage {
  src: string;
  alt: string;
  caption: string;
  rotation?: number;
}

export interface Episode {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  content: string[];
  images?: EpisodeImage[];
  recipe?: {
    title: string;
    ingredients: string[];
    instructions: string[];
  };
}

export interface AboutContent {
  title: string;
  tagline: string;
  description: string[];
  team: {
    name: string;
    role: string;
  }[];
}

export const episodes: Episode[] = [
  {
    id: 14,
    slug: "14",
    title: "Episode 14: The Empty Desk",
    subtitle: "Rituals, Reality, and Recipes",
    date: "February 2025",
    content: [
      "Felix woke up at 9:47am on a Tuesday and felt nothing. No alarm, no panic, no rush to check emails before his feet hit the floor. Just silence and the pale winter light filtering through his bedroom curtains in Finsbury Park.",
      "It had been three weeks since he'd walked out of the agency. Three weeks of mornings that belonged entirely to him. He still wasn't sure what to do with them.",
      "He made coffee slowly, grinding the beans by hand—something he'd bought the equipment for years ago but never had time to use. The ritual of it felt almost sacred. Measure, grind, pour, wait.",
      "His phone buzzed. Maya: 'Breakfast at the café on Stroud Green Road? I'm between meetings.'",
      "Twenty minutes later, he was sitting across from her at a window table, watching condensation roll down the glass. The café smelled of bacon and strong tea, and Radio 2 played softly from somewhere in the kitchen.",
      "'You look different,' Maya said, studying him over her flat white. 'Rested. It's weird.'",
      "'I slept until nearly ten.' Felix shook his head. 'I don't think I've done that since university.'",
      "'And? How does it feel? The freedom?'",
      "Felix thought about it. About the strange guilt that still crept in around 6pm when he wasn't answering emails. About the way his identity had been so tangled up in being busy, being needed, being exhausted.",
      "'Terrifying,' he admitted. 'But also—I made bread yesterday. Actual bread. From scratch. It took four hours and it was slightly burnt and it was the best thing I've eaten in months.'",
      "Maya smiled. 'The Felix I met five years ago would have ordered that bread on Deliveroo and eaten it while responding to Slack messages.'",
      "'The Felix you met five years ago was an idiot.'",
      "They ordered—scrambled eggs for him, avocado toast for her—and talked about nothing and everything. About Tom's new song, about Liv's freelance projects, about whether Felix should learn pottery or finally read all those books on his shelf.",
      "'You don't have to figure it all out immediately,' Maya said as they split the bill. 'That's sort of the whole point.'",
      "Walking home through the park, Felix noticed things he'd missed for years. The way the light hit the Victorian terraces. A dog chasing pigeons. An old man feeding squirrels from a paper bag.",
      "He had nowhere to be. And for the first time, that felt like a gift."
    ],
    images: [
      {
        src: "/content/london_girlys/tube-girls.png",
        alt: "Three friends on the tube",
        caption: "Maya, Liv & the gang",
        rotation: -2
      },
      {
        src: "/content/london_girlys/abbey-road.png",
        alt: "Friends crossing Abbey Road",
        caption: "Beatles who?",
        rotation: 1.5
      },
      {
        src: "/content/london_girlys/trench-coat.png",
        alt: "Girl in trench coat at tube station",
        caption: "Liv being mysterious",
        rotation: -1
      },
      {
        src: "/content/london_girlys/escalator.png",
        alt: "Girl descending tube escalator",
        caption: "Maya's morning commute",
        rotation: 2
      }
    ],
    recipe: {
      title: "Felix's First Bread",
      ingredients: [
        "500g strong white bread flour",
        "7g instant yeast",
        "10g salt",
        "350ml lukewarm water",
        "Olive oil for the bowl",
        "Patience (essential)"
      ],
      instructions: [
        "Mix flour, yeast, and salt in a large bowl.",
        "Add water gradually, mixing until a shaggy dough forms.",
        "Knead for 10 minutes until smooth and elastic. This is meditative. Embrace it.",
        "Oil a bowl, place dough inside, cover with a damp tea towel.",
        "Leave to rise for 1-2 hours until doubled in size.",
        "Knock back, shape into a round, place on a floured baking tray.",
        "Let rise another 30 minutes. Preheat oven to 220°C.",
        "Slash the top with a sharp knife, bake for 30-35 minutes until golden.",
        "Let cool before slicing (the hardest part).",
        "Eat with good butter and no agenda."
      ]
    }
  },
  {
    id: 13,
    slug: "13",
    title: "Episode 13: The Morning After",
    subtitle: "Rituals, Reality, and Recipes",
    date: "January 2025",
    content: [
      "The flat was quiet except for the hum of the fridge and the distant rumble of the Northern Line. Maya stood at the kitchen counter, watching steam curl from her mug of tea, thinking about last night.",
      "She had met them all at The Pineapple—Liv, Felix, and Tom—their usual Thursday haunt in Kentish Town. What started as casual drinks had turned into one of those nights where conversations spiral deeper with each round.",
      "Felix had finally admitted he was thinking of leaving his job at the agency. 'I'm thirty-two,' he'd said, swirling the ice in his glass. 'When did thirty-two start feeling so heavy?'",
      "Liv had reached across the table and squeezed his hand. 'Heavy isn't bad. Heavy means it matters.'",
      "Tom had stayed uncharacteristically quiet, nursing his pint. Maya knew that look—he was composing something in his head, probably lyrics he'd never share.",
      "Now, in the grey morning light of her Hackney kitchen, Maya pulled out eggs and butter. There was something grounding about cooking after a night of big feelings. The ritual of it. Crack, whisk, pour.",
      "Her phone buzzed. A message in their group chat: 'Brunch at mine? I'm making that sandwich.' It was from Liv.",
      "That sandwich. The one they'd perfected over countless lazy Sundays. Sourdough, scrambled eggs, hot sauce, and—the secret ingredient—a thin layer of cream cheese that nobody expected but everyone loved.",
      "Maya smiled and typed back: 'On my way.'",
      "Because that's what they did, the Silver Spooners. They showed up. Through career crises and heartbreaks, through hangovers and breakthroughs. They showed up with sandwiches and stayed for the conversation.",
      "And somehow, that was enough."
    ],
    recipe: {
      title: "The Silver Spooner Sandwich",
      ingredients: [
        "2 slices sourdough bread",
        "2 eggs, scrambled softly",
        "1 tbsp butter",
        "1 tbsp cream cheese",
        "Hot sauce to taste",
        "Handful of rocket",
        "Salt and pepper"
      ],
      instructions: [
        "Toast the sourdough until golden but still soft inside.",
        "Scramble the eggs in butter over low heat—remove while still slightly wet.",
        "Spread cream cheese on one slice of toast.",
        "Layer the scrambled eggs on top.",
        "Add rocket, a generous shake of hot sauce, salt and pepper.",
        "Close the sandwich and press gently.",
        "Share with someone you love."
      ]
    }
  },
  {
    id: 12,
    slug: "12",
    title: "Episode 12: South of the River",
    subtitle: "Rituals, Reality, and Recipes",
    date: "December 2024",
    content: [
      "Tom hadn't crossed the Thames in three weeks. It wasn't intentional—life just kept him north. But today, Liv had insisted.",
      "'Peckham,' she'd texted. 'New place. Trust me.'",
      "So here he was, emerging from Peckham Rye station into the chaos of Rye Lane. The market stalls spilled onto the pavement, selling everything from plantains to vintage leather jackets. A man played steel drums outside the station, and for a moment, Tom just stood there, letting the sound wash over him.",
      "He found Liv at a tiny café wedged between a nail salon and a West African grocery. She was already seated by the window, watching the street with that particular intensity she brought to everything.",
      "'You made it,' she said, not looking up. 'I was starting to think you'd dissolved into that Hackney bubble of yours.'",
      "'Traffic,' Tom lied. They both knew he'd walked.",
      "Liv pushed a menu across the table. 'They do this thing with jollof rice and fried plantain that's going to change your life. Also, I have news.'",
      "Tom raised an eyebrow. Liv's 'news' could mean anything from a new houseplant to a complete career pivot.",
      "'I quit,' she said simply. 'Handed in my notice this morning.'",
      "Tom set down the menu. The café buzzed around them—the hiss of the coffee machine, the clatter of plates, someone laughing at the counter. But in their corner, everything felt still.",
      "'What are you going to do?'",
      "Liv smiled, and it was the realest smile he'd seen from her in months. 'I have no idea. Isn't that terrifying? Isn't that wonderful?'",
      "Tom thought about his own job, the songs he wrote in margins, the life he kept postponing. He thought about how easy it was to stay north of the river, in familiar streets, doing familiar things.",
      "'Yeah,' he said finally. 'Yeah, it really is.'",
      "The food arrived—rice the colour of sunset, plantain glistening with oil, a side of spicy pepper sauce. They ate in comfortable silence, watching Peckham pulse past the window.",
      "Sometimes the bravest thing you can do is cross a river."
    ],
    recipe: {
      title: "Liv's Peckham Plantain",
      ingredients: [
        "2 ripe plantains (yellow with black spots)",
        "Vegetable oil for frying",
        "Pinch of salt",
        "Optional: chili flakes"
      ],
      instructions: [
        "Peel the plantains and slice diagonally, about 1cm thick.",
        "Heat oil in a frying pan over medium heat.",
        "Fry plantain slices until golden brown on each side, about 2-3 minutes per side.",
        "Remove and drain on kitchen paper.",
        "Sprinkle with salt and chili flakes if desired.",
        "Serve immediately while hot and crispy.",
        "Best enjoyed while making big life decisions."
      ]
    }
  },
  {
    id: 11,
    slug: "11",
    title: "Episode 11: The Long Walk Home",
    subtitle: "Rituals, Reality, and Recipes",
    date: "November 2024",
    content: [
      "It was Tom's idea to walk. 'The night bus will take forever anyway,' he said, breath visible in the cold November air. 'And I need to think.'",
      "So they walked—Tom and Felix—from a gig in Brixton all the way back to Holloway. Five miles of London at 1am, through Stockwell and Vauxhall, across the river at Lambeth Bridge, up through Westminster and into the quiet streets of King's Cross.",
      "For the first hour, they didn't talk much. Just walked, hands shoved in pockets, passing shuttered shops and late-night kebab places glowing like lanterns in the dark.",
      "'The gig was good,' Felix offered eventually. They'd been to see an old university friend play at some basement venue, all exposed brick and expensive craft beer.",
      "'Yeah.' Tom kicked a pebble along the pavement. 'Made me think, though. About all the things I said I'd do by thirty.'",
      "'You're not thirty yet.'",
      "'Eleven months.'",
      "They crossed the river in silence, the Thames black and glittering beneath them. A night jogger passed. A taxi honked somewhere in the distance.",
      "'I wrote a song last week,' Tom said suddenly. 'First one in months. It's probably terrible.'",
      "'Play it for us sometime.'",
      "'Maybe.' He paused. 'What if I'm not good enough? What if I've been kidding myself this whole time, and I'm just... average?'",
      "Felix thought about his own doubts—the pitch he'd fumbled last Tuesday, the promotion he'd stopped wanting, the growing feeling that his life was a well-decorated waiting room.",
      "'I think everyone feels that way,' he said finally. 'I think the trick is to do it anyway.'",
      "They stopped at an all-night café near King's Cross, the kind with fluorescent lights and laminated menus and chips that came in styrofoam containers. They ordered tea and toast and sat by the window watching the occasional taxi drift past.",
      "'Thanks for walking with me,' Tom said.",
      "'Thanks for asking.'",
      "By the time they parted ways at Holloway Road, the sky was starting to lighten at the edges. Felix's feet ached. He felt strangely peaceful.",
      "Sometimes the longest way home is exactly what you need."
    ],
    recipe: {
      title: "Late Night Toast",
      ingredients: [
        "2 slices thick white bread",
        "Generous amount of salted butter",
        "Marmite (optional but encouraged)",
        "Strong builder's tea"
      ],
      instructions: [
        "Toast bread until golden and slightly crispy at the edges.",
        "Butter immediately and generously while still hot.",
        "Add a thin scrape of Marmite if you're brave.",
        "Cut diagonally (this matters).",
        "Serve with tea, brewed strong with a splash of milk.",
        "Eat slowly. You've got nowhere to be."
      ]
    }
  },
  {
    id: 10,
    slug: "10",
    title: "Episode 10: Sunday Markets",
    subtitle: "Rituals, Reality, and Recipes",
    date: "October 2024",
    content: [
      "Broadway Market on a Sunday morning was Maya's church. The smell of fresh bread and coffee, the crush of people with canvas bags, the vendors calling out prices for tomatoes and flowers and sourdough loaves the size of your head.",
      "She'd dragged Liv along today, promising pastries and people-watching. They walked slowly down the middle of the street, dodging cyclists and dogs and children eating crêpes.",
      "'I don't understand how you do this every week,' Liv said, clutching her coffee like a lifeline. 'There are so many people.'",
      "'That's the point.' Maya stopped at a vegetable stall, picking up a butternut squash and turning it over in her hands. 'It reminds you that you're part of something. That the city is alive.'",
      "Liv raised an eyebrow. 'That's very philosophical for 10am.'",
      "They bought apples from an orchard in Kent, cheese from a woman who knew every customer by name, and a jar of honey with honeycomb still floating inside. Maya's bag grew heavy. She didn't mind.",
      "At the end of the market, they found a bench by the canal and sat watching the narrowboats drift past. Someone was playing guitar on one of them, the sound carrying across the water.",
      "'I've been thinking about freelancing,' Liv said suddenly. 'Going out on my own. Leaving the agency.'",
      "Maya looked at her—really looked. Liv was always the steady one, the one with the five-year plan and the sensible savings account. This felt significant.",
      "'What would you do?'",
      "'Branding. Packaging design. The stuff I actually love, not the client work that makes me want to scream into a pillow.' Liv laughed, but there was something fragile underneath it. 'Is that crazy?'",
      "Maya thought about all the times she'd played it safe. The job she'd stayed in too long. The flat she'd been meaning to leave for two years. The life that looked perfect on paper but felt slightly too small.",
      "'I think crazy is staying somewhere that makes you want to scream into a pillow.'",
      "They sat there until the sun started to warm the bench, watching ducks fight over bread someone had thrown. The guitar on the narrowboat switched to a song they both knew.",
      "'Same time next week?' Liv asked as they gathered their bags.",
      "'Always.'",
      "Maya walked home through London Fields, the weight of her market haul grounding her. Tonight she'd roast that squash. Tomorrow she'd start looking for a new flat. Small steps. Sunday steps."
    ],
    recipe: {
      title: "Market Day Squash Soup",
      ingredients: [
        "1 butternut squash, halved and deseeded",
        "1 onion, roughly chopped",
        "2 cloves garlic",
        "500ml vegetable stock",
        "1 tsp cumin",
        "Olive oil",
        "Salt and pepper",
        "Crusty bread, for serving"
      ],
      instructions: [
        "Preheat oven to 200°C. Place squash cut-side up on a baking tray.",
        "Drizzle with olive oil, season generously, roast for 45 minutes until soft.",
        "Meanwhile, soften onion and garlic in a large pot with olive oil.",
        "Scoop roasted squash flesh into the pot. Add stock and cumin.",
        "Simmer for 10 minutes, then blend until smooth.",
        "Season to taste. Serve with crusty bread and good butter.",
        "Share with someone who's thinking about making a change."
      ]
    }
  }
];

export const aboutContent: AboutContent = {
  title: "How To Make A Sandwich Smoky",
  tagline: "Rituals, Reality, and Recipes",
  description: [
    "Smoky is a newsletter that follows The Silver Spooners—a group of friends navigating love, life, and London.",
    "Each episode weaves together stories of friendship, quarter-life uncertainty, and the small rituals that keep us grounded. Think: heartfelt conversations over drinks in Kentish Town, Sunday morning scrambled eggs, crossing the river for the first time in weeks.",
    "It's about the in-between moments. The texts that turn into two-hour phone calls. The recipes shared between friends. The courage it takes to change—and the comfort of people who stay the same.",
    "New episodes drop when they're ready. Subscribe via WhatsApp to get Smoky delivered straight to your phone."
  ],
  team: [
    { name: "The Bixt", role: "Creator" }
  ]
};

export const siteConfig = {
  name: "Smoky",
  fullName: "How To Make A Sandwich Smoky",
  tagline: "Rituals, Reality, and Recipes",
  whatsappLink: "https://api.whatsapp.com/send?phone=447822032838&text=I+consent+to+being+sent+messages+by+The+Bixt%27s+_Smoky_+and+will+reply+UNSUBSCRIBE+should+this+change.+%F0%9F%91%91",
  colors: {
    cream: "#E6E2C5",
    burgundy: "#2B4593"
  }
};
