// ============================================================
// NextFashion — Seed Data (Models, Clothing, Locations, Lighting, Library)
// ============================================================

import { v4 as uuidv4 } from 'uuid';
import type {
  ModelProfile, ClothingItem, Location, LightingSetup,
  PoseVocab, CameraSpec, AIProvider
} from '../types';

// ─── 50 Predefined Model Profiles ─────────────────────────────────────────
export const SEED_MODELS: ModelProfile[] = [
  { id: uuidv4(), name: 'Aria Voss', age: 24, ethnicity: 'Northern European', facialFeatures: 'High cheekbones, almond-shaped blue eyes, straight nose, full lips, defined jawline', traits: 'Confident, enigmatic, effortlessly elegant', hairDetails: 'Platinum blonde, waist-length, silky straight with subtle waves', bodyType: 'Tall slender 5\'9", long legs, narrow hips, petite bust', specialMarks: 'Small constellation of freckles across nose bridge', skinDetails: 'Porcelain white, translucent, faint blue veins visible at temples, luminous glow', favoriteClothing: 'Minimalist luxury — silk slips, tailored trousers', favoriteAccessories: 'Delicate gold chains, stud earrings', favoriteLocation: 'Modern Scandinavian interiors, forest clearings', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['blonde', 'european', 'tall'] },
  { id: uuidv4(), name: 'Mila Reyes', age: 22, ethnicity: 'Latina — Colombian', facialFeatures: 'Warm brown eyes with thick lashes, button nose, pouty lips, heart-shaped face', traits: 'Vivacious, playful, intensely expressive', hairDetails: 'Dark chocolate brown, shoulder-length loose curls, natural bounce', bodyType: 'Petite 5\'4", curvy hourglass, full bust, defined waist', specialMarks: 'Dimples on both cheeks, small mole above upper lip', skinDetails: 'Warm golden-olive, sun-kissed, even tone with natural blush', favoriteClothing: 'Colorful sundresses, crop tops, denim shorts', favoriteAccessories: 'Hoop earrings, layered bracelets', favoriteLocation: 'Tropical beaches, vibrant cafes', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['brunette', 'curvy', 'latina'] },
  { id: uuidv4(), name: 'Zara Nakamura', age: 26, ethnicity: 'Japanese', facialFeatures: 'Double eyelid eyes, defined single fold left, porcelain symmetry, refined nose, cherry lips', traits: 'Serene, artistically inclined, quietly powerful', hairDetails: 'Jet black, bone-straight, hip-length, mirror shine', bodyType: 'Lean athletic 5\'6", long torso, subtle curves, toned limbs', specialMarks: 'Tiny mole at right collarbone', skinDetails: 'Fair to medium, perfectly even, porcelain texture, subtle natural glow', favoriteClothing: 'Japanese fashion fusion — kimono elements, structured blazers', favoriteAccessories: 'Pearl drops, hair sticks, minimalist rings', favoriteLocation: 'Cherry blossom gardens, zen interiors, rooftops', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['asian', 'black hair', 'athletic'] },
  { id: uuidv4(), name: 'Nadia Okonkwo', age: 28, ethnicity: 'West African — Nigerian', facialFeatures: 'Sculpted cheekbones, wide almond eyes, broad elegant nose, full lips, oval face', traits: 'Regal, powerful, deeply sensual presence', hairDetails: 'Natural 4C coils, crown out in full afro or braided crown', bodyType: 'Statuesque 5\'10", athletic curves, broad shoulders, commanding proportions', specialMarks: 'Traditional decorative scar pattern near left temple', skinDetails: 'Deep ebony, blue-black undertones, luminous with inner glow, soft texture', favoriteClothing: 'Afrocentric prints, editorial fashion, structured silhouettes', favoriteAccessories: 'Gold cuffs, statement tribal jewelry', favoriteLocation: 'Savanna landscapes, modern art galleries', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['african', 'dark skin', 'statuesque'] },
  { id: uuidv4(), name: 'Priya Sharma', age: 25, ethnicity: 'North Indian', facialFeatures: 'Kohl-lined almond eyes, sharp nose with subtle upturn, rich full lips, oval face', traits: 'Traditional meets modern, graceful, charismatic', hairDetails: 'Lustrous black, thick waist-length waves with natural highlights', bodyType: 'Medium height 5\'5", feminine curves, gentle hourglass', specialMarks: 'Small bindi mark, thin gold nose ring', skinDetails: 'Warm wheatish-golden, clear complexion, natural rosiness in cheeks', favoriteClothing: 'Sarees, anarkali suits, indo-western fusion', favoriteAccessories: 'Jhumka earrings, bangles, maang tikka', favoriteLocation: 'Indian palaces, flower markets, rooftop gardens', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['indian', 'traditional', 'graceful'] },
  { id: uuidv4(), name: 'Camille Dubois', age: 30, ethnicity: 'French', facialFeatures: 'Green almond eyes, soft Gallic nose, naturally rose-tinted lips, oval to square face', traits: 'Effortlessly chic, intellectual, quietly seductive', hairDetails: 'Chestnut brown, textured wavy bob, Parisian undone look', bodyType: 'Slim straight 5\'7", minimal curves, elegant posture', specialMarks: 'Three small freckles near left cheekbone', skinDetails: 'Light warm ivory, fine texture, barely-there flush on cheeks', favoriteClothing: 'Tailored blazers, Breton stripes, silk blouses', favoriteAccessories: 'Silk scarves, simple gold studs', favoriteLocation: 'Parisian apartments, bookshops, riverbanks', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['french', 'brunette', 'chic'] },
  { id: uuidv4(), name: 'Sofia Marchetti', age: 23, ethnicity: 'Italian', facialFeatures: 'Deep hazel eyes, strong Roman nose, defined jaw, full lips, oval Mediterranean face', traits: 'Passionate, expressive, fiercely beautiful', hairDetails: 'Rich espresso brown, voluminous long waves, lush thickness', bodyType: 'Full 5\'6", Mediterranean curves, generous bust, defined waist', specialMarks: 'Small mole above right eyebrow, single ear piercing cluster', skinDetails: 'Golden olive, Mediterranean glow, warm undertones', favoriteClothing: 'Italian fashion — fitted, dramatic, quality fabrics', favoriteAccessories: 'Chunky gold earrings, statement belts', favoriteLocation: 'Mediterranean villa, vineyard, coastal cliffs', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['italian', 'brunette', 'mediterranean'] },
  { id: uuidv4(), name: 'Leila Amir', age: 27, ethnicity: 'Persian Iranian', facialFeatures: 'Expressive dark eyes, prominent aquiline nose, lush full lips, strong cheekbones', traits: 'Mysterious, poetic, deeply elegant', hairDetails: 'Blue-black, hip-length, thick and wavy, midnight sheen', bodyType: 'Tall lean 5\'8", balanced feminine curves, graceful bearing', specialMarks: 'Small tattoo of a crescent moon on inner wrist', skinDetails: 'Warm honey-caramel, flawless, soft texture with rose undertones', favoriteClothing: 'Flowing fabrics, rich jewel tones, dramatic draping', favoriteAccessories: 'Evil eye jewelry, ornate rings, cuff bracelets', favoriteLocation: 'Mosaic-tiled interiors, desert landscapes, lush gardens', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['persian', 'dark hair', 'elegant'] },
  { id: uuidv4(), name: 'Emma Lindqvist', age: 21, ethnicity: 'Swedish', facialFeatures: 'Ice-blue eyes, button nose, cupids-bow lips, soft round face with defined cheekbones', traits: 'Playfully innocent, fresh, naturally luminous', hairDetails: 'Golden blonde, thick braids or loose natural waves', bodyType: 'Petite athletic 5\'5", sculpted limbs, toned, slim', specialMarks: 'Light scatter of freckles across nose and shoulders', skinDetails: 'Pale porcelain with warm pink flush, silky smooth', favoriteClothing: 'Athleisure, Scandinavian minimal, cozy knits', favoriteAccessories: 'Simple stud earrings, thin bracelets', favoriteLocation: 'Nordic forests, lakesides, minimalist interiors', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['swedish', 'blonde', 'athletic'] },
  { id: uuidv4(), name: 'Keiko Yamamoto', age: 29, ethnicity: 'Japanese', facialFeatures: 'Single-lid eyes with subtle liner, petite nose, heart-shaped face, nude lips', traits: 'Refined, deeply artistic, culturally rooted yet modern', hairDetails: 'Dark chestnut, styled in elegant updo or loose bun', bodyType: 'Petite 5\'3", slender, minimal curves, porcelain figurine quality', specialMarks: 'Cherry blossom tattoo behind right ear', skinDetails: 'Ivory fair, flawless porcelain, no visible pores, natural dewy finish', favoriteClothing: 'Yukata, modern minimalist, structured cuts', favoriteAccessories: 'Kanzashi hair pins, jade ring, thin anklets', favoriteLocation: 'Traditional ryokan, zen gardens, bamboo groves', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['japanese', 'petite', 'traditional'] },
  { id: uuidv4(), name: 'Amara Diallo', age: 24, ethnicity: 'Senegalese', facialFeatures: 'Wide bright eyes, broad symmetrical nose, abundant lips, high pronounced cheekbones', traits: 'Radiant, joyful, magnetic energy', hairDetails: 'Natural coils styled in elaborate cornrow or twist patterns', bodyType: '5\'7" lean with gentle curves, long neck, strong limbs', specialMarks: 'Tribal bead scar near temple, gold tooth accent', skinDetails: 'Deep warm mahogany, even satin finish, lit from within', favoriteClothing: 'Vibrant Wax prints, dashiki, modern African couture', favoriteAccessories: 'Beaded jewelry, wrapped headpiece', favoriteLocation: 'West African courtyards, colorful markets', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['african', 'natural hair', 'vibrant'] },
  { id: uuidv4(), name: 'Isabella Romano', age: 31, ethnicity: 'Argentine-Italian', facialFeatures: 'Deep brown eyes, strong nose, generous lips, angular jaw', traits: 'Bold, artistic, passionate, effortlessly sensual', hairDetails: 'Dark auburn, voluminous, wild natural curls', bodyType: '5\'7" full hourglass, generous bust and hips, sculpted waist', specialMarks: 'Small rose tattoo on left shoulder blade', skinDetails: 'Warm olive-bronze, sun-golden, slight freckle dusting on shoulders', favoriteClothing: 'Latin couture, flamenco-inspired, bold prints', favoriteAccessories: 'Statement necklaces, large hoop earrings', favoriteLocation: 'Buenos Aires lofts, tango clubs, rooftop gardens', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['latin', 'redhead', 'curvy'] },
  { id: uuidv4(), name: 'Yuki Tanaka', age: 20, ethnicity: 'Japanese-Brazilian', facialFeatures: 'Mixed double-lid eyes, gentle nose, rosy full lips, heart face', traits: 'Energetic, fresh, charming, cross-cultural beauty', hairDetails: 'Raven black, mid-length, styled in playful half-up', bodyType: 'Petite 5\'4", compact athletic, naturally toned', specialMarks: 'Tiny star tattoo on ankle', skinDetails: 'Warm ivory, natural blush, smooth silk texture', favoriteClothing: 'Harajuku inspired, casual Brazilian beach wear', favoriteAccessories: 'Pastel clips, playful layered rings', favoriteLocation: 'Beach towns, urban street art scenes', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['mixed', 'asian', 'petite'] },
  { id: uuidv4(), name: 'Elena Vasquez', age: 26, ethnicity: 'Spanish', facialFeatures: 'Smoldering dark eyes, prominent cheekbones, full lips, classic Iberian features', traits: 'Fiery, deeply sensual, dramatically beautiful', hairDetails: 'Black as coal, very long, thick natural waves', bodyType: '5\'6" classic hourglass, dancer-toned curves', specialMarks: 'Floral tattoo sleeve on right arm', skinDetails: 'Deep olive, warm bronze, luminous with natural glow', favoriteClothing: 'Spanish fashion — structured, dramatic, deep hues', favoriteAccessories: 'Bold earrings, layered leather bracelets', favoriteLocation: 'Andalusian courtyards, flamenco studios, ocean cliffs', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['spanish', 'dark', 'dancer'] },
  { id: uuidv4(), name: 'Aiko Chen', age: 23, ethnicity: 'Chinese', facialFeatures: 'Almond eyes with dramatic wing liner, delicate nose, small lips, oval face', traits: 'Meticulous, graceful, quietly intense', hairDetails: 'Jet black, ultra-straight, waist-length, mirror finish', bodyType: '5\'5" slender lean, long legs, graceful proportions', specialMarks: 'Delicate lotus tattoo on right wrist', skinDetails: 'Porcelain fair, even complexion, almost luminescent', favoriteClothing: 'Qipao-modern fusion, editorial fashion, silk pieces', favoriteAccessories: 'Jade pendants, delicate chains', favoriteLocation: 'Modern Asian art spaces, misty mountains', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['chinese', 'elegant', 'modern'] },
  { id: uuidv4(), name: 'Fatima El-Rashid', age: 28, ethnicity: 'Moroccan', facialFeatures: 'Kohl-darkened almond eyes, proud aquiline nose, full curved lips, olive oval face', traits: 'Mysterious, deeply feminine, old-world elegance', hairDetails: 'Rich black, long with natural wave, often adorned', bodyType: '5\'6" soft feminine curves, gentle proportions', specialMarks: 'Traditional henna-inspired tattoo on right hand', skinDetails: 'Warm honey-amber, smooth, sun-kissed undertones', favoriteClothing: 'Moroccan kaftans, djellaba, contemporary fusion', favoriteAccessories: 'Berber silver jewelry, layered necklaces', favoriteLocation: 'Marrakech riads, desert sunsets, coastal medinas', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['moroccan', 'middle-eastern', 'exotic'] },
  { id: uuidv4(), name: 'Maya Krishnan', age: 22, ethnicity: 'South Indian — Tamil', facialFeatures: 'Large expressive dark eyes, defined brow, wide nose, generous lips, round face', traits: 'Spirited, deeply rooted in culture, naturally beautiful', hairDetails: 'Blue-black, very thick, waist-length, natural wave', bodyType: 'Medium 5\'4" with soft feminine curves, warm proportions', specialMarks: 'Floral mehndi regularly applied, small ear stud cluster', skinDetails: 'Deep warm brown, rich caramel, even tone, naturally glowing', favoriteClothing: 'Silk sarees, salwar kameez, churidar', favoriteAccessories: 'Temple jewelry, silk flowers in hair, anklets', favoriteLocation: 'Kerala backwaters, temple corridors, lush gardens', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['south-indian', 'traditional', 'dark-brown-skin'] },
  { id: uuidv4(), name: 'Vera Sokolova', age: 25, ethnicity: 'Russian', facialFeatures: 'Striking grey eyes, sharp Slavic cheekbones, defined nose, pale lips, angular face', traits: 'Ice-cool exterior with hidden warmth, commanding', hairDetails: 'Strawberry blonde, mid-length sleek blow-out', bodyType: '5\'8" statuesque, long limbs, lean model proportions', specialMarks: 'Small scar above left eyebrow', skinDetails: 'Translucent porcelain, light rose undertones, very fine pored', favoriteClothing: 'Russian couture, fur-trimmed coats, tailored leather', favoriteAccessories: 'Amber pendants, structured clutches', favoriteLocation: 'Winter palaces, snowy forests, grand interiors', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['russian', 'blonde', 'statuesque'] },
  { id: uuidv4(), name: 'Jasmine Park', age: 27, ethnicity: 'Korean', facialFeatures: 'K-beauty aesthetic — glass skin, monolid eyes, petite nose, gradient lips, V-shaped face', traits: 'Trendsetting, adorably intense, fashion-forward', hairDetails: 'Dyed deep burgundy, layered bob, always perfect sheen', bodyType: 'Petite 5\'3", K-pop idol proportions, lean, toned', specialMarks: 'Tiny gem stud piercing below right eye', skinDetails: 'Glass skin — flawless, dewy, seemingly lit from within, pore-less', favoriteClothing: 'Korean street fashion, OOTD-worthy, pastel moments', favoriteAccessories: 'Chunky platform shoes, layered ear piercings', favoriteLocation: 'Seoul rooftops, neon-lit streets, stylish cafes', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['korean', 'k-beauty', 'fashion'] },
  { id: uuidv4(), name: 'Naomi Adeyemi', age: 29, ethnicity: 'Nigerian-British', facialFeatures: 'Large warm brown eyes, strong cheekbones, broad nose, abundant lips, broad oval face', traits: 'Bold, creative, authentically powerful', hairDetails: 'Natural 4B hair, styled in locs or large twist-out', bodyType: '5\'8" full figure, powerful and confident proportions', specialMarks: 'Lotus mandala tattoo on right shoulder', skinDetails: 'Deep chocolate brown, rich even tone, remarkable skin clarity', favoriteClothing: 'Afrofusion designer, bold color blocking, editorial', favoriteAccessories: 'Statement African beadwork, bold rings', favoriteLocation: 'London art scenes, Lagos beaches, open-air markets', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['afro-british', 'natural', 'bold'] },
  { id: uuidv4(), name: 'Ava Sterling', age: 22, ethnicity: 'American — Mixed Irish-Puerto Rican', facialFeatures: 'Freckled nose, green-hazel eyes, wide smile, symmetrical features, girl-next-door glow', traits: 'Sunny, charismatic, genuinely warm', hairDetails: 'Auburn with caramel highlights, shoulder-length with natural wave', bodyType: 'Average 5\'6", natural proportions, athletic', specialMarks: 'Band of small freckles across both shoulders', skinDetails: 'Light medium, warm peachy undertone, natural rosy blush', favoriteClothing: 'American casual — jeans, tees, summer dresses', favoriteAccessories: 'Gold charm necklace, small hoop earrings', favoriteLocation: 'American suburbia, college campus, beach boardwalk', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['american', 'mixed', 'natural'] },
  { id: uuidv4(), name: 'Nour Khalil', age: 24, ethnicity: 'Lebanese', facialFeatures: 'Amber eyes, Levantine nose, abundant lips, high forehead, oval face', traits: 'Refined, cosmopolitan, classically beautiful', hairDetails: 'Chestnut brown, long beach waves, lustrous', bodyType: '5\'6" slim with gentle curves, Mediterranean grace', specialMarks: 'Thin gold nose ring, single diamond ear cluster', skinDetails: 'Light olive, warm caramel, even tone, Mediterranean glow', favoriteClothing: 'Lebanese couture, contemporary Middle Eastern chic', favoriteAccessories: 'Gold filigree jewelry, designer handbags', favoriteLocation: 'Beirut rooftops, Mediterranean coast, historic quarters', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['lebanese', 'brunette', 'refined'] },
  { id: uuidv4(), name: 'Sakura Ito', age: 20, ethnicity: 'Japanese', facialFeatures: 'Soft monolid eyes, doll-like features, small upturned nose, pink bow lips', traits: 'Kawaii aesthetic, gentle, dreamily feminine', hairDetails: 'Pastel pink dyed, medium wavy, always decorated', bodyType: 'Petite 5\'2", ultra-slender, delicate proportions', specialMarks: 'Small butterfly tattoo on left collarbone', skinDetails: 'Pale cherry-blossom skin, ultra-smooth, rosy glow', favoriteClothing: 'Lolita fashion, pastel coordinates, feminine layers', favoriteAccessories: 'Hair bows, lace gloves, beaded bags', favoriteLocation: 'Pastel rooms, cherry blossom parks, Harajuku', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['japanese', 'kawaii', 'petite'] },
  { id: uuidv4(), name: 'Ingrid Haugen', age: 33, ethnicity: 'Norwegian', facialFeatures: 'Deep-set blue eyes, aquiline nose, defined Nordic features, angular jaw', traits: 'Stoic strength meets hidden warmth, naturally commanding', hairDetails: 'Ash blonde, long straight, natural texture', bodyType: '5\'9" tall athletic, lean muscle, Viking grace', specialMarks: 'Traditional Norse-inspired tattoo on upper arm', skinDetails: 'Fair with warm undertone, visible pores, healthy natural blush', favoriteClothing: 'Scandinavian outdoor, elegant minimalism', favoriteAccessories: 'Silver pendants, functional yet stylish', favoriteLocation: 'Norwegian fjords, snow-covered forests, mountain lodges', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['norwegian', 'athletic', 'nordic'] },
  { id: uuidv4(), name: 'Riya Patel', age: 26, ethnicity: 'Gujarati Indian', facialFeatures: 'Wide doe eyes, subtle Gujarati features, rosebud lips, round warm face', traits: 'Bubbly, modern yet culturally connected, warm hearted', hairDetails: 'Dark brown, mid-back length, typically braided or half-up', bodyType: '5\'4" petite curves, soft feminine proportions', specialMarks: 'Decorative nose stud, toe rings', skinDetails: 'Medium wheatish-golden, warm undertones, healthy glow', favoriteClothing: 'Modern Indian — chaniya choli, fusion kurta', favoriteAccessories: 'Oxidized silver, colorful bangles', favoriteLocation: 'Gujarat heritage sites, colorful textile markets', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['gujarati', 'indian', 'traditional'] },
  { id: uuidv4(), name: 'Chiara Ferretti', age: 28, ethnicity: 'Italian', facialFeatures: 'Intelligent brown eyes, Roman nose, expressive mouth, strong Mediterranean bone structure', traits: 'Intellectually beautiful, understated glamour', hairDetails: 'Dark chestnut, cut in a chic Italian lob', bodyType: '5\'7" slim with confident posture, elegant', specialMarks: 'Tiny mole on right cheek', skinDetails: 'Warm olive, Italian sun-kissed, natural glossy finish', favoriteClothing: 'Italian designer, clean lines, quality fabrics', favoriteAccessories: 'Small leather goods, understated gold', favoriteLocation: 'Florence galleries, countryside villas, cobblestone streets', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['italian', 'sophisticated', 'elegant'] },
  { id: uuidv4(), name: 'Aisha Mohammed', age: 25, ethnicity: 'Sudanese', facialFeatures: 'Striking wide eyes, broad noble nose, full lips, elongated oval face', traits: 'Quietly powerful, deeply spiritual beauty', hairDetails: 'Natural 4C afro or wrapped in colorful gele/turban', bodyType: '5\'8" tall slender, model-like long proportions', specialMarks: 'Facial scarification marks (traditional)', skinDetails: 'Blue-black deep ebony, satin smooth, extraordinary luminosity', favoriteClothing: 'Sudanese thobe, African couture, editorial', favoriteAccessories: 'Gold nose ring, amber beads, cuff bracelets', favoriteLocation: 'Nubian landscapes, geometric architecture', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['sudanese', 'afro', 'regal'] },
  { id: uuidv4(), name: 'Clara Beaumont', age: 30, ethnicity: 'French-Algerian', facialFeatures: 'Tawny eyes, mixed Mediterranean features, full lips, high cheekbones, oval face', traits: 'Sophisticated fusion beauty, bicultural charm', hairDetails: 'Dark wavy, shoulder-length, natural texture', bodyType: '5\'6" medium build, feminine curves', specialMarks: 'Small crescent tattoo on neck', skinDetails: 'Warm medium olive-brown, even tone, natural finish', favoriteClothing: 'Parisian chic meets North African details', favoriteAccessories: 'Berber-inspired with modern pieces', favoriteLocation: 'Paris courtyards, Algiers markets, Mediterranean beaches', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['mixed', 'french', 'mediterranean'] },
  { id: uuidv4(), name: 'Mei Lin', age: 24, ethnicity: 'Chinese', facialFeatures: 'Double-eyelid almond eyes, refined nose, small pink lips, high cheekbones, oval face', traits: 'Modern sophisticate, classic Chinese beauty', hairDetails: 'Glossy black, long bob or waist-length straight', bodyType: '5\'5" slender lean, long-limbed, graceful', specialMarks: 'Tiny yin-yang tattoo on wrist', skinDetails: 'Ivory fair, translucent, smooth, gentle natural blush', favoriteClothing: 'Contemporary Chinese fashion, qipao-modern hybrid', favoriteAccessories: 'Jade pieces, pearl earrings', favoriteLocation: 'Shanghai skyline, traditional tea houses', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['chinese', 'modern', 'graceful'] },
  { id: uuidv4(), name: 'Valentina Cruz', age: 23, ethnicity: 'Mexican', facialFeatures: 'Dark expressive eyes, strong Aztec-influenced features, full lips, square jaw', traits: 'Bold, proud, vibrant energy', hairDetails: 'Jet black, very thick, past shoulder, decorated with flowers', bodyType: '5\'5" full curves, generous proportions', specialMarks: 'Catrina-inspired tattoo on thigh, ear gauges', skinDetails: 'Warm copper-brown, rich tone, natural glow', favoriteClothing: 'Mexican traditional meets street fashion, colorful', favoriteAccessories: 'Oaxacan embroidery accessories, silver', favoriteLocation: 'Mexico City murals, Day of the Dead settings, markets', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['mexican', 'bold', 'colorful'] },
  { id: uuidv4(), name: 'Hana Sato', age: 22, ethnicity: 'Japanese', facialFeatures: 'Soft round face, natural eyes with minimal makeup, snub nose, gentle smile', traits: 'Wholesome, naturally charming, girl-next-door', hairDetails: 'Dark brown bob, clean cut, healthy shine', bodyType: 'Petite 5\'3", average natural proportions', specialMarks: 'Small ear piercings only', skinDetails: 'Medium fair, clear smooth complexion, natural without makeup', favoriteClothing: 'Japanese daily casual, school girl aesthetic, soft femme', favoriteAccessories: 'Simple stud earrings, plain accessories', favoriteLocation: 'Suburban Japan, train stations, convenience stores', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['japanese', 'natural', 'wholesome'] },
  { id: uuidv4(), name: 'Anastasia Petrov', age: 27, ethnicity: 'Ukrainian', facialFeatures: 'Striking blue-green eyes, high Slavic cheekbones, defined nose, lush lips', traits: 'Dramatic beauty, resilient spirit, classic Slavic charm', hairDetails: 'Platinum blonde with silver highlights, very long, braided', bodyType: '5\'8" tall model figure, lean but feminine curves', specialMarks: 'Sunflower tattoo on upper back', skinDetails: 'Pale rose-white, almost ethereal, bright clear', favoriteClothing: 'Ukrainian embroidery vyshyvanka, couture gowns', favoriteAccessories: 'Floral wreaths, folk-inspired jewelry', favoriteLocation: 'Ukrainian wheat fields, historic cathedrals', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['ukrainian', 'blonde', 'folk'] },
  { id: uuidv4(), name: 'Suki Watanabe', age: 21, ethnicity: 'Japanese', facialFeatures: 'Striking anime-aesthetic eyes, button nose, tiny lips, porcelain face', traits: 'Otherworldly, ethereal, dreamlike presence', hairDetails: 'Silver-lavender dyed, straight to shoulder', bodyType: 'Ultra-petite 5\'1", willowy, delicate', specialMarks: 'Crystal gem adhesives near eye', skinDetails: 'Near translucent pale, luminous, perfect', favoriteClothing: 'Futuristic J-fashion, iridescent fabrics, avant-garde', favoriteAccessories: 'Crystal accessories, holographic bags', favoriteLocation: 'Neon Tokyo night scenes, virtual reality spaces', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['japanese', 'ethereal', 'futuristic'] },
  { id: uuidv4(), name: 'Lucia Hernandez', age: 29, ethnicity: 'Cuban', facialFeatures: 'Sultry brown eyes, prominent Afro-Cuban features, wide nose, abundant lips', traits: 'Sizzling, rhythmic, magnetic sensuality', hairDetails: 'Dark mixed-curl 3C-4A, voluminous afro or loose', bodyType: '5\'6" full hourglass, lush curves', specialMarks: 'Musical note tattoo behind ear', skinDetails: 'Warm caramel-brown, mixed undertones, radiant', favoriteClothing: 'Cuban fashion, bold prints, fitted rumba dresses', favoriteAccessories: 'Large gold hoops, beaded bracelets', favoriteLocation: 'Havana streets, salsa clubs, tropical gardens', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['cuban', 'afro-latina', 'sensual'] },
  { id: uuidv4(), name: 'Bianca Moreira', age: 25, ethnicity: 'Brazilian', facialFeatures: 'Warmly expressive brown eyes, mixed features, broad smile, round face', traits: 'Joyful, carefree, beach beauty', hairDetails: 'Brown with natural sun highlights, long beach waves', bodyType: '5\'6" Brazilian curves, toned beach body', specialMarks: 'Small crescent moons along one ankle', skinDetails: 'Warm bronze, sun-kissed, naturally glowing', favoriteClothing: 'Brazilian beach fashion, bikinis, breezy dresses', favoriteAccessories: 'Shell jewelry, anklets', favoriteLocation: 'Copacabana beaches, Rio rooftops, jungle waterfalls', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['brazilian', 'beach', 'sunny'] },
  { id: uuidv4(), name: 'Freya Hansen', age: 26, ethnicity: 'Danish', facialFeatures: 'Nordic grey eyes, strong-yet-soft face, patrician nose, natural lips', traits: 'Earthy, environmentally conscious, wholesome Nordic beauty', hairDetails: 'Honey blonde, natural loose braid or messy bun', bodyType: '5\'7" tall lean athletic, strong', specialMarks: 'Viking rune tattoo on forearm', skinDetails: 'Fair with warm golden undertone, healthy flush, textured', favoriteClothing: 'Sustainable Scandinavian, outdoor lifestyle brands', favoriteAccessories: 'Wooden jewelry, minimal', favoriteLocation: 'Danish countryside, coastal cliffs, organic farms', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['danish', 'blonde', 'earthy'] },
  { id: uuidv4(), name: 'Layla Hassan', age: 28, ethnicity: 'Egyptian', facialFeatures: 'Kohl-defined almond eyes, classic Egyptian features, defined jaw, full lips', traits: 'Timeless, regal like ancient royalty, powerful feminine', hairDetails: 'Blue-black bob or Cleopatra-style blunt cut', bodyType: '5\'6" slender with feminine curves', specialMarks: 'Eye of Horus tattoo on wrist, gold ear cuffs permanent', skinDetails: 'Warm medium copper, Nile-valley complexion, glowing', favoriteClothing: 'Egyptian couture, modern Arabic fashion', favoriteAccessories: 'Gold Egyptian-style jewelry, lapis lazuli', favoriteLocation: 'Egyptian ruins, Nile river, modern Cairo rooftops', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['egyptian', 'dark', 'regal'] },
  { id: uuidv4(), name: 'Tamiko Suzuki', age: 35, ethnicity: 'Japanese', facialFeatures: 'Mature almond eyes, refined Japanese features, defined jaw, elegant', traits: 'Sophisticated maturity, quiet confidence, timeless beauty', hairDetails: 'Black with hints of deep brown, sleek short cut or elegant updo', bodyType: '5\'5" slim toned mature figure', specialMarks: 'Small scar near left temple', skinDetails: 'Flawless medium fair, exceptional skin care, natural finish', favoriteClothing: 'Japanese designer — Yohji, Comme des Garcons aesthetic', favoriteAccessories: 'Single statement piece jewelry, quality leather', favoriteLocation: 'Kyoto traditional settings, modern art museums', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['japanese', 'mature', 'designer'] },
  { id: uuidv4(), name: 'Nina Kowalski', age: 23, ethnicity: 'Polish', facialFeatures: 'Clear blue eyes, snub nose, innocent smile, soft Slavic features', traits: 'Fresh-faced charm, approachable, naturally beautiful', hairDetails: 'Golden blonde, wavy shoulder-length, often in ponytail', bodyType: '5\'6" slim feminine, natural proportions', specialMarks: 'Small heart tattoo on right wrist', skinDetails: 'Light fair, pink flush, clear smooth complexion', favoriteClothing: 'Cottagecore, Eastern European folk-inspired, romantic', favoriteAccessories: 'Floral hair pins, charm bracelets', favoriteLocation: 'Polish countryside, flower fields, cobblestone villages', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['polish', 'blonde', 'cottagecore'] },
  { id: uuidv4(), name: 'Divya Menon', age: 27, ethnicity: 'Malayali Indian', facialFeatures: 'Large dark luminous eyes, defined nose, perfect lips, classical Kerala features', traits: 'Traditional grace, deep eyes full of stories', hairDetails: 'Glossy jet black, very thick, hip-length, often with jasmine', bodyType: '5\'3" petite soft curves, traditional feminine', specialMarks: 'Waist chain, toe rings, bindi', skinDetails: 'Warm medium brown, clear glowing skin, South Indian glow', favoriteClothing: 'Kerala kasavu sarees, Keralan blouses', favoriteAccessories: 'Temple jewelry set, gold waist chain', favoriteLocation: 'Kerala temples, backwaters, coconut groves', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['kerala', 'traditional', 'dark'] },
  { id: uuidv4(), name: 'Chloe Martin', age: 24, ethnicity: 'French-Caribbean', facialFeatures: 'Mixed warm features, deep brown eyes, broad nose, lush lips, oval face', traits: 'Island warmth meets Parisian sophistication', hairDetails: 'Dark curly natural 3B, mid-length, natural or blowout', bodyType: '5\'5" toned athletic curves, mixed proportions', specialMarks: 'Small fleur-de-lis tattoo on ankle', skinDetails: 'Warm medium caramel-brown, Caribbean glow', favoriteClothing: 'Martinique-inspired, tropical French chic', favoriteAccessories: 'Creole gold earrings, natural shell accents', favoriteLocation: 'Caribbean beaches, Paris streets, fusion settings', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['mixed', 'caribbean', 'french'] },
  { id: uuidv4(), name: 'Simone Laurent', age: 31, ethnicity: 'Belgian-Congolese', facialFeatures: 'Wide bright eyes, mixed prominent features, generous lips, oval face', traits: 'Intellectually radiant, quietly magnetic', hairDetails: 'Natural 4A coils in protective styles or crown twist-out', bodyType: '5\'7" statuesque hourglass', specialMarks: 'Moon and stars tattoo on upper back', skinDetails: 'Deep warm mahogany, rich even tone, remarkable clarity', favoriteClothing: 'Belgian designer meets African print', favoriteAccessories: 'Sculptural modern jewelry', favoriteLocation: 'Brussels art spaces, Kinshasa markets', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['mixed', 'belgian', 'african'] },
  { id: uuidv4(), name: 'Alinta Watson', age: 22, ethnicity: 'Aboriginal Australian', facialFeatures: 'Deep brown eyes, broad nose, full lips, strong features, sun-touched', traits: 'Deeply connected to nature, authentic, powerful', hairDetails: 'Dark wavy natural, medium length, wild and free', bodyType: '5\'5" strong natural proportions, athletic', specialMarks: 'Traditional dot art temporary tattoo', skinDetails: 'Deep warm brown, rich earthy undertone, outdoor glow', favoriteClothing: 'Contemporary Aboriginal fashion, natural textiles', favoriteAccessories: 'Native shell and seed jewelry', favoriteLocation: 'Australian outback, red rock landscapes, coastal wilderness', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['aboriginal', 'australian', 'natural'] },
  { id: uuidv4(), name: 'Hira Khan', age: 26, ethnicity: 'Pakistani', facialFeatures: 'Hazel kohl-lined eyes, sharp Pashtun features, full lips, defined jaw', traits: 'Bold, fashionable, modern Pakistani beauty', hairDetails: 'Dark brown, silky blow-out waves, mid-back', bodyType: '5\'6" slim feminine with gentle curves', specialMarks: 'Intricate mehndi designs on hands', skinDetails: 'Warm golden-wheatish, clear Pakistani complexion', favoriteClothing: 'Pakistani fashion — chiffon dupattas, sharara sets', favoriteAccessories: 'Kundan jewelry, chandbali earrings', favoriteLocation: 'Lahore gardens, Mughal architecture, modern studios', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['pakistani', 'fashion', 'traditional'] },
  { id: uuidv4(), name: 'Emre Demir', age: 24, ethnicity: 'Turkish', facialFeatures: 'Hazel eyes with green flecks, defined Anatolian features, full lips, strong jaw', traits: 'Mediterranean allure, deeply warm, traditional yet modern', hairDetails: 'Dark chestnut, long waves, natural volume', bodyType: '5\'6" curvy feminine, Mediterranean proportions', specialMarks: 'Evil eye tattoo on shoulder blade', skinDetails: 'Warm medium olive, Turkish Mediterranean tone, natural glow', favoriteClothing: 'Turkish couture, Ottoman-inspired, modern ankara', favoriteAccessories: 'Evil eye jewelry, hammered silver', favoriteLocation: 'Istanbul Bosphorus, Turkish baths, cappadocia', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['turkish', 'mediterranean', 'traditional'] },
  { id: uuidv4(), name: 'Grace Oduya', age: 23, ethnicity: 'Yoruba Nigerian', facialFeatures: 'Bright eyes, pronounced Yoruba features, full lips, round face, scarification tradition', traits: 'Culturally proud, energetically beautiful, authentically herself', hairDetails: 'Natural 4C afro styled in Bantu knots or blown out', bodyType: '5\'5" medium curves, natural proportions', specialMarks: 'Tribal facial markings', skinDetails: 'Warm medium-dark brown, clear complexion, natural glow', favoriteClothing: 'Aso-oke, Ankara prints, modern Nigerian fashion', favoriteAccessories: 'Iyun coral beads, Bogo necklaces', favoriteLocation: 'Lagos Island, traditional compound', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['yoruba', 'traditional', 'african'] },
  { id: uuidv4(), name: 'Serena Bloom', age: 28, ethnicity: 'American — Jewish Italian mix', facialFeatures: 'Rich dark eyes, prominent nose, lush lips, curly-haired Mediterranean features', traits: 'Passionate intellectual beauty, New York energy', hairDetails: 'Dark brown 2C-3A curls, voluminous, mid-back', bodyType: '5\'7" curvy, full hourglass', specialMarks: 'Hamsa tattoo on hip, double helix piercing', skinDetails: 'Warm olive-medium, natural blush, alive complexion', favoriteClothing: 'New York fashion — bohemian luxury, artsy layers', favoriteAccessories: 'Layered gold chains, large rings', favoriteLocation: 'NYC lofts, bookshop corners, rooftop gardens', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['american', 'mixed', 'curly'] },
  { id: uuidv4(), name: 'Akemi Hayashi', age: 25, ethnicity: 'Japanese', facialFeatures: 'Strong monolid eyes, defined cheekbones, confident features, natural lips', traits: 'Cool athletic energy, understated power', hairDetails: 'Black cut in athletic bob or short pixie', bodyType: '5\'6" lean athletic, gymnast build', specialMarks: 'Minimal — only small ear studs', skinDetails: 'Medium fair, healthy glow, natural texture', favoriteClothing: 'Japanese athletic brands, minimal sportswear', favoriteAccessories: 'Sport watches, minimal jewelry', favoriteLocation: 'Japanese gymnasiums, mountain peaks, outdoor spaces', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['japanese', 'athletic', 'sporty'] },
  { id: uuidv4(), name: 'Roxana Ionescu', age: 27, ethnicity: 'Romanian', facialFeatures: 'Intense dark eyes, sharp defined Eastern European features, carved cheekbones', traits: 'Mysterious, artistic, Eastern European drama', hairDetails: 'Raven black, very long, sleek or dramatic waves', bodyType: '5\'7" model-slim, long limbs, angular', specialMarks: 'Wolf tattoo on forearm', skinDetails: 'Pale cool-toned, with dramatic contrast features', favoriteClothing: 'Romanian folk-contemporary, dark editorial', favoriteAccessories: 'Silver and garnet, folk embroidery accents', favoriteLocation: 'Transylvanian castles, Romanian folk settings', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['romanian', 'dark', 'dramatic'] },
  { id: uuidv4(), name: 'Aiyana Redcloud', age: 26, ethnicity: 'Native American — Lakota Sioux', facialFeatures: 'Dark almond eyes, strong cheekbones, broad nose, defined jaw, oval face', traits: 'Deeply proud, spiritual, grounded natural beauty', hairDetails: 'Jet black, very thick, waist-length, often braided', bodyType: '5\'5" strong medium build, earth-connected proportions', specialMarks: 'Traditional geometric tattoos on forearm', skinDetails: 'Warm copper-red undertone, rich medium brown, outdoors glow', favoriteClothing: 'Contemporary Native fashion, natural textiles, turquoise accents', favoriteAccessories: 'Turquoise and silver jewelry, dream catcher pieces', favoriteLocation: 'Great Plains landscapes, sacred site environments', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['native-american', 'tribal', 'spiritual'] },
  { id: uuidv4(), name: 'Lin Wei', age: 29, ethnicity: 'Taiwanese', facialFeatures: 'Warm almond eyes, soft features, natural Taiwanese beauty', traits: 'Gentle sophistication, modern Taiwanese chic', hairDetails: 'Dark brown with subtle highlights, long textured waves', bodyType: '5\'5" slim balanced proportions', specialMarks: 'Watercolor flower tattoo on shoulder', skinDetails: 'Warm beige-ivory, clear glowing skin, healthy', favoriteClothing: 'Taipei street style, contemporary Asian fashion', favoriteAccessories: 'Delicate layered necklaces, small earrings', favoriteLocation: 'Taipei night markets, mountain hot springs', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['taiwanese', 'modern', 'asian'] }
];

// ─── Seed Clothing Items ──────────────────────────────────────────────────
export const SEED_CLOTHING: ClothingItem[] = [
  {
    id: uuidv4(), name: 'Black Satin Lingerie Set', category: 'lingerie',
    style: 'Luxury boudoir', color: 'Jet black', material: 'Satin and delicate lace trim',
    fit: 'Perfectly fitted, underwire bra with full cup coverage, matching high-cut briefs',
    details: 'Intricate floral lace overlay, thin satin straps, scalloped edges, silk ribbon accent at center front',
    accessories: ['Sheer black robe', 'Diamond stud earrings', 'Silk stockings'],
    layers: ['Bra', 'Panties', 'Optional sheer robe'],
    states: [
      { id: uuidv4(), label: 'Fully dressed', description: 'Complete set with robe loosely worn', phase: 'arrival' },
      { id: uuidv4(), label: 'Robe open', description: 'Robe parted, lingerie fully visible', phase: 'build' },
      { id: uuidv4(), label: 'Robe removed', description: 'Only lingerie set, robe on floor or chair', phase: 'peak' },
    ],
    progressionNotes: 'Begin with robe, gradually reveal lingerie set for natural progression',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    tags: ['black', 'satin', 'lingerie', 'boudoir']
  },
  {
    id: uuidv4(), name: 'Ivory Silk Slip Dress', category: 'casual',
    style: 'Minimalist luxury', color: 'Cream ivory', material: 'Pure silk, bias cut',
    fit: 'Loose flowing mid-thigh length, adjustable thin straps',
    details: 'Simple V-neck, lace hem trim, barely visible lining, natural drape',
    accessories: ['Strappy sandals', 'Simple gold necklace', 'Small clutch'],
    layers: ['Slip dress', 'Optional light cardigan'],
    states: [
      { id: uuidv4(), label: 'Styled', description: 'Dress with cardigan or jacket', phase: 'arrival' },
      { id: uuidv4(), label: 'Relaxed', description: 'Just the slip dress', phase: 'build' },
      { id: uuidv4(), label: 'Strap off shoulder', description: 'One strap slipped down casually', phase: 'intimate' },
    ],
    progressionNotes: 'Silk drapes naturally for movement shots. Strap progression adds intimacy',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    tags: ['silk', 'slip', 'minimalist', 'ivory']
  },
  {
    id: uuidv4(), name: 'Beige Cotton Oversized Shirt', category: 'casual',
    style: 'Casual morning', color: 'Warm beige', material: 'Soft cotton poplin',
    fit: 'Oversized boyfriend fit, long length',
    details: 'Collar with few buttons, rolled sleeves, natural wrinkle texture',
    accessories: ['Nothing or simple underwear visible'],
    layers: ['Shirt only'],
    states: [
      { id: uuidv4(), label: 'Fully buttoned', description: 'Shirt buttoned up, casual', phase: 'arrival' },
      { id: uuidv4(), label: 'Half buttoned', description: 'Top few buttons open', phase: 'build' },
      { id: uuidv4(), label: 'Sliding off shoulders', description: 'Shirt loosely falling off one shoulder', phase: 'intimate' },
      { id: uuidv4(), label: 'Removed, on floor', description: 'Shirt removed, pooled on floor nearby', phase: 'peak' },
    ],
    progressionNotes: 'Classic morning-after aesthetic. Natural progression through button states',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    tags: ['shirt', 'cotton', 'casual', 'morning']
  },
  {
    id: uuidv4(), name: 'Red Kanjivaram Silk Saree', category: 'traditional-indian',
    style: 'Bridal Indian', color: 'Deep crimson with gold zari border', material: 'Pure silk Kanjivaram',
    fit: 'Traditional drape, fitted pleats, pallu over left shoulder',
    details: 'Intricate gold temple motif border, contrast blouse with cap sleeves, petticoat base',
    accessories: ['Temple jewelry set', 'Nose ring', 'Bangles', 'Maang tikka', 'Anklets'],
    layers: ['Petticoat', 'Blouse', 'Saree drape'],
    states: [
      { id: uuidv4(), label: 'Fully draped', description: 'Complete traditional saree drape', phase: 'arrival' },
      { id: uuidv4(), label: 'Pallu adjusted', description: 'Pallu loosely draped, partially off', phase: 'build' },
      { id: uuidv4(), label: 'Pallu removed', description: 'Just blouse and petticoat visible', phase: 'peak' },
    ],
    progressionNotes: 'Progression from formal bridal look to more relaxed traditional',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    tags: ['saree', 'indian', 'silk', 'traditional', 'bridal']
  },
  {
    id: uuidv4(), name: 'White Linen Co-ord Set', category: 'casual',
    style: 'Mediterranean casual', color: 'Crisp white', material: 'Premium linen',
    fit: 'Wide-leg palazzo trousers with matching crop top, relaxed',
    details: 'Natural linen texture, minimal embroidery at hem, easy tie waist',
    accessories: ['Woven sandals', 'Gold layered necklaces', 'Wicker bag'],
    layers: ['Crop top', 'Palazzo trousers'],
    states: [
      { id: uuidv4(), label: 'Complete set', description: 'Full co-ord styled', phase: 'arrival' },
      { id: uuidv4(), label: 'Top removed', description: 'Only trousers, top dropped on bench back', phase: 'intimate' },
    ],
    progressionNotes: 'Clean Mediterranean look. Natural linen wrinkles with movement',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    tags: ['linen', 'white', 'casual', 'mediterranean']
  },
  {
    id: uuidv4(), name: 'Dark Denim Jacket + White Bralette', category: 'layered',
    style: 'Street casual', color: 'Indigo denim, white top', material: 'Denim + cotton',
    fit: 'Oversized denim jacket, fitted white bralette underneath',
    details: 'Vintage-wash denim, raw hem, patch pockets, simple white bralette',
    accessories: ['High-waist jeans', 'White sneakers', 'Gold hoops'],
    layers: ['Bralette', 'Jeans', 'Denim jacket'],
    states: [
      { id: uuidv4(), label: 'Jacket on', description: 'Full look', phase: 'arrival' },
      { id: uuidv4(), label: 'Jacket open', description: 'Denim jacket open revealing bralette', phase: 'build' },
      { id: uuidv4(), label: 'Jacket off shoulder', description: 'Jacket half off', phase: 'playful' },
      { id: uuidv4(), label: 'Jacket removed', description: 'Jacket tossed on floor, just bralette', phase: 'intimate' },
    ],
    progressionNotes: 'Great for street setting with natural casual energy',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    tags: ['denim', 'street', 'layered', 'casual']
  },
  {
    id: uuidv4(), name: 'Dusty Rose Satin Bodysuit', category: 'lingerie',
    style: 'Elegant intimate', color: 'Dusty rose blush', material: 'Satin with snap closure',
    fit: 'Form-fitting, deep V-neck, high-cut leg, snap at crotch',
    details: 'Subtle ruching at neckline, thin adjustable straps, smooth finish',
    accessories: ['Silk kimono robe', 'Pearl earrings'],
    layers: ['Bodysuit', 'Optional kimono'],
    states: [
      { id: uuidv4(), label: 'With kimono', description: 'Kimono open over bodysuit', phase: 'arrival' },
      { id: uuidv4(), label: 'Kimono falling', description: 'Kimono slipping off shoulders', phase: 'build' },
      { id: uuidv4(), label: 'Just bodysuit', description: 'Clean bodysuit only', phase: 'peak' },
    ],
    progressionNotes: 'Elegant boudoir-style with soft feminine energy',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    tags: ['bodysuit', 'satin', 'boudoir', 'pink']
  },
  {
    id: uuidv4(), name: 'Classic Black Blazer + Nothing', category: 'formal',
    style: 'Power editorial', color: 'Classic black', material: 'Wool-blend tailored',
    fit: 'Oversized tailored blazer worn with nothing underneath',
    details: 'Peak lapels, single button, structured shoulders, clean back vent',
    accessories: ['High heels', 'Statement earrings'],
    layers: ['Blazer only'],
    states: [
      { id: uuidv4(), label: 'Blazer buttoned', description: 'Single button fastened, confident stance', phase: 'arrival' },
      { id: uuidv4(), label: 'Blazer open', description: 'Button undone, lapels parted', phase: 'build' },
      { id: uuidv4(), label: 'Blazer sliding', description: 'Off one shoulder dramatically', phase: 'peak' },
    ],
    progressionNotes: 'Classic editorial look. Best with bare skin underneath for contrast',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    tags: ['blazer', 'editorial', 'power', 'formal']
  },
];

// ─── Seed Locations ────────────────────────────────────────────────────────
export const SEED_LOCATIONS: Location[] = [
  {
    id: uuidv4(), name: 'Luxury Bedroom Suite', type: 'interior', category: 'bedroom',
    description: 'High-end hotel or penthouse bedroom with king bed, floor-to-ceiling windows, city or landscape views',
    ambiance: 'Warm intimate atmosphere with soft textures and luxury finishes',
    lightingNotes: 'Soft warm bedside lamps, dawn light through sheer curtains, candles optional',
    objects: [
      { id: uuidv4(), name: 'King bed', poseOptions: ['lying on', 'sitting on edge', 'kneeling on', 'leaning against headboard'] },
      { id: uuidv4(), name: 'Window', poseOptions: ['standing at', 'leaning against frame', 'looking out'] },
      { id: uuidv4(), name: 'Vanity mirror', poseOptions: ['sitting at', 'standing before', 'reflection shot'] },
      { id: uuidv4(), name: 'Armchair', poseOptions: ['sitting in', 'draping over arm', 'curled in'] },
      { id: uuidv4(), name: 'Floor', poseOptions: ['lying on rug', 'sitting cross-legged', 'sprawled elegantly'] },
    ],
    subAreas: ['Bed area', 'Window bay', 'Vanity corner', 'Sitting area', 'Balcony access'],
    mood: 'Intimate, luxurious, morning-after elegance',
    timeOfDay: ['Dawn', 'Morning', 'Evening', 'Night'],
    season: ['All seasons'],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    tags: ['bedroom', 'luxury', 'interior', 'intimate']
  },
  {
    id: uuidv4(), name: 'Japanese Zen Garden', type: 'exterior', category: 'garden',
    description: 'Traditional Japanese garden with koi pond, stone lanterns, bamboo grove, moss-covered pathways',
    ambiance: 'Serene, meditative, deeply tranquil natural beauty',
    lightingNotes: 'Soft filtered daylight through bamboo canopy, golden hour glow on water',
    objects: [
      { id: uuidv4(), name: 'Stone bench', poseOptions: ['sitting on', 'standing beside', 'leaning against'] },
      { id: uuidv4(), name: 'Koi pond', poseOptions: ['kneeling beside', 'standing at edge', 'sitting at bank'] },
      { id: uuidv4(), name: 'Bamboo grove', poseOptions: ['standing between stalks', 'leaning on bamboo', 'walking through'] },
      { id: uuidv4(), name: 'Stone lantern', poseOptions: ['standing beside', 'touching', 'framed by'] },
      { id: uuidv4(), name: 'Stepping stones', poseOptions: ['walking on', 'balancing on', 'standing on single stone'] },
    ],
    subAreas: ['Koi pond area', 'Bamboo grove', 'Meditation pavilion', 'Stone path', 'Cherry blossom corner'],
    mood: 'Peaceful, spiritual, timeless natural elegance',
    timeOfDay: ['Morning', 'Afternoon', 'Golden hour'],
    season: ['Spring (cherry blossoms)', 'Autumn (maple leaves)', 'Summer'],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    tags: ['zen', 'japanese', 'garden', 'exterior']
  },
  {
    id: uuidv4(), name: 'Modern Urban Loft', type: 'interior', category: 'living-room',
    description: 'Converted warehouse or industrial loft with exposed brick, high ceilings, large industrial windows',
    ambiance: 'Raw urban energy meets comfortable creative space',
    lightingNotes: 'Large north-facing industrial windows, afternoon light, urban ambient glow',
    objects: [
      { id: uuidv4(), name: 'Industrial sofa', poseOptions: ['sitting on', 'lying on', 'kneeling on back of'] },
      { id: uuidv4(), name: 'Exposed brick wall', poseOptions: ['leaning against', 'standing in front', 'hands on wall'] },
      { id: uuidv4(), name: 'Large window', poseOptions: ['silhouette at', 'sitting on sill', 'standing looking out'] },
      { id: uuidv4(), name: 'Dining table', poseOptions: ['sitting on', 'leaning on', 'sitting at chair'] },
      { id: uuidv4(), name: 'Kitchen counter', poseOptions: ['sitting on', 'leaning against', 'standing at'] },
    ],
    subAreas: ['Living area', 'Kitchen island', 'Window wall', 'Mezzanine level', 'Entry area'],
    mood: 'Creative, urban, edgy yet comfortable',
    timeOfDay: ['Morning', 'Afternoon', 'Blue hour', 'Night with city lights'],
    season: ['All seasons'],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    tags: ['loft', 'urban', 'industrial', 'modern']
  },
  {
    id: uuidv4(), name: 'Mediterranean Beach', type: 'exterior', category: 'beach',
    description: 'Pristine Mediterranean coastline with crystal clear turquoise water, white pebble or sand shore',
    ambiance: 'Vibrant natural beauty, salt air, gentle waves',
    lightingNotes: 'Bright Mediterranean midday sun, golden hour magic, blue-sky overcast',
    objects: [
      { id: uuidv4(), name: 'Beach towel', poseOptions: ['lying on', 'sitting on', 'kneeling on'] },
      { id: uuidv4(), name: 'Rocky outcrop', poseOptions: ['sitting on', 'standing on edge', 'leaning against'] },
      { id: uuidv4(), name: 'Water edge', poseOptions: ['standing in shallow water', 'walking in surf', 'wading'] },
      { id: uuidv4(), name: 'Beach umbrella', poseOptions: ['sitting under shade', 'beside pole', 'looking up at'] },
      { id: uuidv4(), name: 'Boat', poseOptions: ['sitting on bow', 'leaning on side', 'looking over edge'] },
    ],
    subAreas: ['Shoreline', 'Rocky area', 'Shallow water', 'Beach cove', 'Clifftop view'],
    mood: 'Free, sun-drenched, natural vitality',
    timeOfDay: ['Golden hour morning', 'Midday', 'Sunset'],
    season: ['Summer', 'Late spring', 'Early autumn'],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    tags: ['beach', 'mediterranean', 'exterior', 'summer']
  },
  {
    id: uuidv4(), name: 'Parisian Apartment', type: 'interior', category: 'living-room',
    description: 'Classic Haussmann-era Parisian apartment with herringbone floors, marble fireplace, tall windows',
    ambiance: 'Timeless Parisian elegance, effortless chic',
    lightingNotes: 'Grey Parisian morning light, warm lamp glow, candle light',
    objects: [
      { id: uuidv4(), name: 'Velvet chaise longue', poseOptions: ['reclining on', 'sitting at end', 'draping over'] },
      { id: uuidv4(), name: 'Marble fireplace', poseOptions: ['standing beside mantel', 'kneeling before', 'leaning on mantel'] },
      { id: uuidv4(), name: 'French window', poseOptions: ['standing at balcony door', 'looking out', 'one hand on frame'] },
      { id: uuidv4(), name: 'Writing desk', poseOptions: ['sitting at', 'leaning on', 'standing behind'] },
      { id: uuidv4(), name: 'Persian rug', poseOptions: ['sitting cross-legged', 'lying on', 'kneeling on'] },
    ],
    subAreas: ['Salon', 'Balcony', 'Bedroom alcove', 'Library corner', 'Dining area'],
    mood: 'Sophisticated, romantic, timelessly Parisian',
    timeOfDay: ['Morning', 'Afternoon', 'Evening'],
    season: ['All seasons', 'Especially autumn and spring'],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    tags: ['parisian', 'apartment', 'elegant', 'interior']
  },
  {
    id: uuidv4(), name: 'Tropical Forest Waterfall', type: 'exterior', category: 'forest',
    description: 'Lush tropical rainforest with cascading waterfall into clear pool, dense green canopy',
    ambiance: 'Wild natural beauty, humidity, vibrant life',
    lightingNotes: 'Dappled forest light, misty waterfall spray, green filtered sunlight',
    objects: [
      { id: uuidv4(), name: 'Waterfall', poseOptions: ['standing under mist', 'sitting on rocks beside', 'back to waterfall'] },
      { id: uuidv4(), name: 'Large flat rock', poseOptions: ['lying on', 'sitting on', 'crouching on'] },
      { id: uuidv4(), name: 'Tropical vines', poseOptions: ['holding vine', 'leaning on tree', 'framed by foliage'] },
      { id: uuidv4(), name: 'Pool', poseOptions: ['standing in shallow pool', 'wading', 'sitting at edge'] },
      { id: uuidv4(), name: 'Fallen log', poseOptions: ['sitting on', 'leaning against', 'stepping over'] },
    ],
    subAreas: ['Waterfall base', 'Natural pool', 'Forest path', 'Clifftop above falls', 'Dense canopy area'],
    mood: 'Wild, free, deeply natural and sensual',
    timeOfDay: ['Morning', 'Midday filtered light'],
    season: ['Year-round tropical'],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    tags: ['tropical', 'forest', 'waterfall', 'natural']
  },
];

// ─── Seed Lighting Setups ─────────────────────────────────────────────────
export const SEED_LIGHTING: LightingSetup[] = [
  {
    id: uuidv4(), name: 'Golden Hour Magic', type: 'natural',
    description: 'Warm golden light from low sun during first or last hour of daylight',
    direction: 'Side-lighting or backlit, low horizontal angle',
    quality: 'Soft, warm, long shadows, lens flares',
    colorTemperature: '2700-3200K, rich amber-gold',
    mood: 'Romantic, nostalgic, warm, dreamy',
    timeOfDay: 'Sunset or sunrise',
    modifiers: ['Natural reflector (white surface)', 'Lens flare enhancement'],
    tags: ['golden', 'warm', 'sunset', 'natural'],
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(), name: 'Soft Window Light', type: 'natural',
    description: 'Diffused daylight through large north or east-facing window',
    direction: 'Side, front-side, 45-degree angle to subject',
    quality: 'Soft, even, flattering, minimal shadows',
    colorTemperature: '5500-6500K, natural daylight',
    mood: 'Clean, fresh, natural, intimate',
    timeOfDay: 'Morning to midday',
    modifiers: ['Sheer curtain diffusion', 'White bounce card'],
    tags: ['window', 'natural', 'soft', 'daylight'],
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(), name: 'Dramatic Rembrandt', type: 'studio',
    description: 'Classic Rembrandt lighting creating triangle of light on shadow side of face',
    direction: '45 degrees above and 45 degrees to side of subject',
    quality: 'High contrast, deep shadows, dramatic triangle highlight',
    colorTemperature: '4500-5000K, neutral',
    mood: 'Dramatic, powerful, artistic, moody',
    modifiers: ['Large softbox as key', 'Subtle fill reflector'],
    tags: ['rembrandt', 'dramatic', 'studio', 'artistic'],
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(), name: 'Candlelight Warm', type: 'dramatic',
    description: 'Intimate warm light from candles or candle-like sources',
    direction: 'Below or front-below, flickering point sources',
    quality: 'Extremely warm, intimate, soft glow, dancing shadows',
    colorTemperature: '1800-2200K, very warm amber-orange',
    mood: 'Intimate, romantic, mysterious, sensual',
    timeOfDay: 'Evening or night',
    modifiers: ['Multiple small light sources', 'Warm orange gels'],
    tags: ['candlelight', 'warm', 'intimate', 'evening'],
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(), name: 'Blue Hour Exterior', type: 'natural',
    description: 'The magical 20-30 minutes after sunset with deep blue ambient sky light',
    direction: 'Even ambient from above, with warm practical lights',
    quality: 'Cool blue ambient, warm practicals, ethereal glow',
    colorTemperature: '7000-9000K ambient, 2700K practicals',
    mood: 'Ethereal, mysterious, deeply cinematic',
    timeOfDay: 'Twilight after sunset',
    tags: ['blue-hour', 'twilight', 'exterior', 'cinematic'],
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(), name: 'High-Key Fashion', type: 'studio',
    description: 'Bright, evenly lit high-key studio setup for fashion photography',
    direction: 'Wrap-around even lighting, minimal shadows',
    quality: 'Bright, airy, clean, slight overexposure',
    colorTemperature: '5500K, pure daylight',
    mood: 'Clean, commercial, bright, editorial fashion',
    modifiers: ['Large strip softboxes', 'White backdrop', 'Kicker lights'],
    tags: ['high-key', 'fashion', 'studio', 'bright'],
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(), name: 'Neon Noir', type: 'dramatic',
    description: 'Urban night scene with colorful neon signs providing colored light',
    direction: 'Multiple colored sources from various directions',
    quality: 'High contrast, deep shadows, vivid color pools',
    colorTemperature: 'Mixed: pink (15000K), teal (6000K), amber (2000K)',
    mood: 'Cyberpunk, mysterious, edgy, vibrant urban',
    timeOfDay: 'Night',
    modifiers: ['Colored gels', 'Neon tubes', 'LED strips'],
    tags: ['neon', 'night', 'urban', 'colorful'],
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(), name: 'Morning Haze', type: 'mixed',
    description: 'Soft hazy morning light with slight mist or fog in air',
    direction: 'Backlit or side-lit with atmospheric haze',
    quality: 'Soft, diffused, slightly low-contrast, ethereal',
    colorTemperature: '4500-5500K, slightly warm',
    mood: 'Dreamy, peaceful, fresh, new day energy',
    timeOfDay: 'Early morning',
    modifiers: ['Atmospheric haze', 'Backlight glow'],
    tags: ['morning', 'haze', 'soft', 'dreamy'],
    createdAt: new Date().toISOString()
  },
];

// ─── Seed Poses ───────────────────────────────────────────────────────────
export const SEED_POSES: PoseVocab[] = [
  // Standing
  { id: uuidv4(), pose: 'Standing straight, looking directly at camera with confidence', category: 'standing', tags: ['confident', 'direct'], phaseHint: 'arrival' },
  { id: uuidv4(), pose: 'Standing with one hand on hip, slight hip tilt, looking over shoulder', category: 'standing', tags: ['flirty', 'hip'], phaseHint: 'build' },
  { id: uuidv4(), pose: 'Standing near wall, back against it, arms loosely at sides, head tilted', category: 'standing', tags: ['relaxed', 'wall'], phaseHint: 'build' },
  { id: uuidv4(), pose: 'Standing with arms raised over head, stretching, eyes closed', category: 'standing', tags: ['stretch', 'relaxed'], phaseHint: 'playful' },
  { id: uuidv4(), pose: 'Standing in profile, one foot forward, looking toward light', category: 'standing', tags: ['profile', 'elegant'], phaseHint: 'arrival' },
  { id: uuidv4(), pose: 'Standing with back to camera, looking back over shoulder', category: 'standing', tags: ['back', 'look-back'], phaseHint: 'intimate' },
  { id: uuidv4(), pose: 'Standing with hands in hair, elbows raised, eyes half-closed', category: 'standing', tags: ['hair', 'sensual'], phaseHint: 'peak' },
  { id: uuidv4(), pose: 'Standing at window, silhouette against light, contemplative', category: 'standing', tags: ['window', 'silhouette'], phaseHint: 'arrival' },
  { id: uuidv4(), pose: 'Standing with crossed arms, playful smirk', category: 'standing', tags: ['crossed-arms', 'playful'], phaseHint: 'playful' },
  { id: uuidv4(), pose: 'Standing with one leg bent, foot on tiptoe, slight lean', category: 'standing', tags: ['tiptoe', 'playful'], phaseHint: 'playful' },
  // Sitting
  { id: uuidv4(), pose: 'Sitting on bed edge, legs together, hands in lap, looking down', category: 'sitting', tags: ['bed', 'intimate', 'contemplative'], phaseHint: 'intimate' },
  { id: uuidv4(), pose: 'Sitting cross-legged on floor, elbows on knees, relaxed', category: 'sitting', tags: ['floor', 'casual'], phaseHint: 'build' },
  { id: uuidv4(), pose: 'Sitting in chair with legs draped over armrest, nonchalant', category: 'sitting', tags: ['chair', 'casual', 'legs'], phaseHint: 'playful' },
  { id: uuidv4(), pose: 'Sitting on counter top, hands gripping edge, leaning back slightly', category: 'sitting', tags: ['counter', 'elevated'], phaseHint: 'playful' },
  { id: uuidv4(), pose: 'Sitting on window sill, one knee raised, gazing outside', category: 'sitting', tags: ['window', 'dreamy'], phaseHint: 'closing' },
  { id: uuidv4(), pose: 'Sitting with knees together, hands on knees, straight back', category: 'sitting', tags: ['formal', 'elegant'], phaseHint: 'arrival' },
  { id: uuidv4(), pose: 'Sitting with legs tucked under body on sofa, curled up', category: 'sitting', tags: ['sofa', 'cozy'], phaseHint: 'winddown' },
  { id: uuidv4(), pose: 'Sitting on floor leaning against bed, legs extended', category: 'sitting', tags: ['floor', 'bed', 'relaxed'], phaseHint: 'intimate' },
  // Lying
  { id: uuidv4(), pose: 'Lying on back, arms above head, completely relaxed', category: 'lying', tags: ['relaxed', 'back', 'arms-up'], phaseHint: 'intimate' },
  { id: uuidv4(), pose: 'Lying on side, head propped on hand, looking at camera', category: 'lying', tags: ['side', 'propped', 'direct'], phaseHint: 'peak' },
  { id: uuidv4(), pose: 'Lying on stomach, feet kicked up, chin in hands, smiling', category: 'lying', tags: ['stomach', 'playful', 'cute'], phaseHint: 'playful' },
  { id: uuidv4(), pose: 'Lying curled in fetal position, hugging pillow', category: 'lying', tags: ['curled', 'cozy', 'soft'], phaseHint: 'winddown' },
  { id: uuidv4(), pose: 'Lying stretched diagonally across bed, one arm extended', category: 'lying', tags: ['diagonal', 'extended', 'sensual'], phaseHint: 'peak' },
  { id: uuidv4(), pose: 'Lying on back, one knee raised, looking up at camera', category: 'lying', tags: ['knee-raised', 'looking-up'], phaseHint: 'intimate' },
  // Leaning
  { id: uuidv4(), pose: 'Leaning against door frame with arms crossed', category: 'leaning', tags: ['doorframe', 'casual'], phaseHint: 'arrival' },
  { id: uuidv4(), pose: 'Leaning forward on hands placed on table, slight arch', category: 'leaning', tags: ['table', 'forward-lean'], phaseHint: 'build' },
  { id: uuidv4(), pose: 'Leaning back against wall, one foot propped behind', category: 'leaning', tags: ['wall', 'casual'], phaseHint: 'build' },
  { id: uuidv4(), pose: 'Leaning over balcony railing, looking out', category: 'leaning', tags: ['balcony', 'dreamy'], phaseHint: 'closing' },
  { id: uuidv4(), pose: 'Leaning sideways in chair with head resting on hand', category: 'leaning', tags: ['chair', 'head-on-hand'], phaseHint: 'intimate' },
  // Walking
  { id: uuidv4(), pose: 'Walking toward camera, purposeful stride, direct eye contact', category: 'walking', tags: ['toward-camera', 'confident'], phaseHint: 'arrival' },
  { id: uuidv4(), pose: 'Walking away slowly, looking back with a subtle smile', category: 'walking', tags: ['walking-away', 'look-back'], phaseHint: 'closing' },
  { id: uuidv4(), pose: 'Walking along path, hair flowing, looking to side', category: 'walking', tags: ['natural', 'hair-flow'], phaseHint: 'playful' },
  // Reaching/Action
  { id: uuidv4(), pose: 'Reaching up toward ceiling or shelf, body elongated', category: 'reaching', tags: ['reach', 'elongated'], phaseHint: 'playful' },
  { id: uuidv4(), pose: 'Running fingers through hair, head back, eyes closed', category: 'action', tags: ['hair', 'head-back'], phaseHint: 'peak' },
  { id: uuidv4(), pose: 'Adjusting clothing strap, looking down at hands', category: 'action', tags: ['adjusting', 'clothing'], phaseHint: 'build' },
  { id: uuidv4(), pose: 'Holding cup of coffee, both hands wrapped around it', category: 'resting', tags: ['coffee', 'hands', 'casual'], phaseHint: 'arrival' },
  { id: uuidv4(), pose: 'Spinning slowly, dress or fabric flowing outward', category: 'action', tags: ['spinning', 'movement', 'flowing'], phaseHint: 'playful' },
  { id: uuidv4(), pose: 'Stretching back against floor or bed, arch pronounced', category: 'stretching', tags: ['arch', 'back', 'stretch'], phaseHint: 'intimate' },
  { id: uuidv4(), pose: 'Kneeling on bed, hands on headboard, looking over shoulder', category: 'intimate', tags: ['kneeling', 'headboard'], phaseHint: 'peak' },
  { id: uuidv4(), pose: 'Hands on wall in front, back arched, head down', category: 'intimate', tags: ['wall', 'arch', 'dramatic'], phaseHint: 'peak' },
];

// ─── Seed Camera Specs ─────────────────────────────────────────────────────
export const SEED_CAMERA_SPECS: CameraSpec[] = [
  // Angles
  { id: uuidv4(), type: 'angle', name: 'Eye Level', description: 'Camera at subject eye level — neutral, natural, relatable', tags: ['neutral', 'natural'] },
  { id: uuidv4(), type: 'angle', name: 'Low Angle', description: 'Camera below eye level looking up — empowering, dramatic', tags: ['dramatic', 'powerful'] },
  { id: uuidv4(), type: 'angle', name: 'High Angle', description: 'Camera above looking down — intimate, vulnerable, soft', tags: ['intimate', 'soft'] },
  { id: uuidv4(), type: 'angle', name: 'Dutch Angle', description: 'Camera tilted diagonally — dynamic, edgy, tension', tags: ['edgy', 'dynamic'] },
  { id: uuidv4(), type: 'angle', name: 'Bird\'s Eye', description: 'Directly overhead — abstract, pattern-focused, unique', tags: ['overhead', 'abstract'] },
  { id: uuidv4(), type: 'angle', name: 'Worm\'s Eye', description: 'Extremely low looking up — dramatic, powerful statement', tags: ['extreme', 'powerful'] },
  // Shot types
  { id: uuidv4(), type: 'shot', name: 'Extreme Close-Up', description: 'Detail shot — eyes, lips, fingers, jewelry', tags: ['detail', 'texture'] },
  { id: uuidv4(), type: 'shot', name: 'Close-Up', description: 'Face from chin to top of head, no neck or shoulders', tags: ['face', 'portrait'] },
  { id: uuidv4(), type: 'shot', name: 'Medium Close-Up', description: 'Head and shoulders — classic portrait shot', tags: ['portrait', 'classic'] },
  { id: uuidv4(), type: 'shot', name: 'Medium Shot', description: 'Waist up — shows body language and upper body', tags: ['waist-up', 'body-language'] },
  { id: uuidv4(), type: 'shot', name: 'Medium Wide Shot', description: 'Thighs to top of head — shows full outfit interaction', tags: ['full-outfit', 'mid-body'] },
  { id: uuidv4(), type: 'shot', name: 'Full Body Shot', description: 'Complete figure from head to feet', tags: ['full-body', 'complete'] },
  { id: uuidv4(), type: 'shot', name: 'Long Shot', description: 'Subject in full environment context', tags: ['environment', 'wide'] },
  // Framing
  { id: uuidv4(), type: 'framing', name: 'Rule of Thirds', description: 'Subject placed at thirds intersection points', tags: ['composition', 'classic'] },
  { id: uuidv4(), type: 'framing', name: 'Central Framing', description: 'Subject centered, symmetrical composition', tags: ['centered', 'symmetrical'] },
  { id: uuidv4(), type: 'framing', name: 'Negative Space', description: 'Large empty area around subject for impact', tags: ['minimalist', 'impact'] },
  { id: uuidv4(), type: 'framing', name: 'Leading Lines', description: 'Environmental lines direct eye to subject', tags: ['lines', 'dynamic'] },
  { id: uuidv4(), type: 'framing', name: 'Frame Within Frame', description: 'Door, window, or arch frames the subject', tags: ['frame', 'depth'] },
  { id: uuidv4(), type: 'framing', name: 'Foreground Interest', description: 'Objects in foreground create depth', tags: ['depth', 'layered'] },
  // Lens
  { id: uuidv4(), type: 'lens', name: '85mm f/1.4 Portrait', description: 'Classic portrait lens — beautiful bokeh, flattering compression', tags: ['portrait', 'bokeh'] },
  { id: uuidv4(), type: 'lens', name: '50mm f/1.8 Standard', description: 'Natural perspective similar to human eye', tags: ['natural', 'versatile'] },
  { id: uuidv4(), type: 'lens', name: '35mm Wide', description: 'Slightly wide, environmental context, natural distortion', tags: ['wide', 'environmental'] },
  { id: uuidv4(), type: 'lens', name: '135mm Telephoto', description: 'Compressed perspective, subject isolation, flattering', tags: ['telephoto', 'compression'] },
  { id: uuidv4(), type: 'lens', name: '24mm Ultra Wide', description: 'Dramatic wide angle, environment dominant', tags: ['ultra-wide', 'dramatic'] },
  // Technical
  { id: uuidv4(), type: 'technical', name: 'Shallow DOF f/1.4', description: 'Razor thin focus, creamy bokeh background', tags: ['bokeh', 'shallow'] },
  { id: uuidv4(), type: 'technical', name: 'Deep DOF f/8', description: 'Sharp foreground to background, environmental context', tags: ['sharp', 'deep'] },
  { id: uuidv4(), type: 'technical', name: 'Soft Focus', description: 'Dreamy slight defocus, romantic quality', tags: ['soft', 'dreamy'] },
  { id: uuidv4(), type: 'technical', name: 'Motion Blur', description: 'Slight movement blur for dynamic energy', tags: ['motion', 'dynamic'] },
];

// ─── AI Provider Defaults ──────────────────────────────────────────────────
export const DEFAULT_AI_PROVIDERS: AIProvider[] = [
  {
    id: uuidv4(), name: 'OpenAI', type: 'openai', apiKey: '',
    baseUrl: 'https://api.openai.com/v1',
    models: ['gpt-4o', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo', 'gpt-image-1'],
    isActive: false,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(), name: 'Anthropic Claude', type: 'anthropic', apiKey: '',
    baseUrl: 'https://api.anthropic.com/v1',
    models: ['claude-opus-4-5', 'claude-sonnet-4-5', 'claude-haiku-3-5'],
    isActive: false,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(), name: 'Replicate', type: 'replicate', apiKey: '',
    baseUrl: 'https://api.replicate.com/v1',
    models: ['flux-dev', 'flux-schnell', 'sdxl', 'flux-klein-9b'],
    isActive: false,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(), name: 'FAL.ai', type: 'fal', apiKey: '',
    baseUrl: 'https://fal.run',
    models: ['fal-ai/flux/dev', 'fal-ai/flux/schnell', 'fal-ai/flux-pro', 'fal-ai/sdxl'],
    isActive: false,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(), name: 'Stability AI', type: 'stability', apiKey: '',
    baseUrl: 'https://api.stability.ai',
    models: ['stable-diffusion-xl-1024-v1-0', 'stable-diffusion-3-medium'],
    isActive: false,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(), name: 'Ollama (Local)', type: 'ollama', apiKey: '',
    baseUrl: 'http://localhost:11434',
    models: [],
    isActive: false,
    ollamaPort: 11434,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(), name: 'HuggingFace', type: 'huggingface', apiKey: '',
    baseUrl: 'https://api-inference.huggingface.co/models',
    models: ['black-forest-labs/FLUX.1-dev', 'stabilityai/stable-diffusion-xl-base-1.0'],
    isActive: false,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
];

// Phase defaults
export const DEFAULT_PHASES = [
  { id: 'arrival' as const, name: 'Arrival / Opening', description: 'First impressions — model enters scene, establishing shots, composed and styled', color: '#6366f1', icon: '🌅', count: 0, keywords: ['establishing shot', 'confident entrance', 'styled', 'full look', 'arriving', 'first glance', 'eye contact', 'composed'] },
  { id: 'build' as const, name: 'Build', description: 'Warming up — more relaxed poses, slight clothing adjustments, natural movement', color: '#8b5cf6', icon: '📈', count: 0, keywords: ['relaxing into', 'natural movement', 'slight adjustment', 'warming up', 'casual moments', 'comfortable'] },
  { id: 'peak' as const, name: 'Peak', description: 'The height of the session — most dynamic, expressive and confident moments', color: '#ec4899', icon: '⚡', count: 0, keywords: ['dynamic', 'expressive', 'peak energy', 'intense', 'confident', 'powerful', 'dramatic'] },
  { id: 'intimate' as const, name: 'Intimate', description: 'Softer, more personal moments — closer camera work, emotional depth', color: '#f43f5e', icon: '💫', count: 0, keywords: ['soft', 'personal', 'close-up', 'emotional', 'vulnerable', 'gentle', 'quiet moment'] },
  { id: 'playful' as const, name: 'Playful', description: 'Fun, lighthearted energy — movement, laughing, spontaneous moments', color: '#f59e0b', icon: '✨', count: 0, keywords: ['playful', 'laughing', 'fun', 'spontaneous', 'movement', 'carefree', 'joyful'] },
  { id: 'winddown' as const, name: 'Wind Down / Exploratory', description: 'Slower pace — model explores space, contemplative, alternative areas of location', color: '#10b981', icon: '🌿', count: 0, keywords: ['contemplative', 'exploring', 'slow', 'quiet', 'reflective', 'soft light', 'natural'] },
  { id: 'closing' as const, name: 'Closing / Ending', description: 'Final moments — farewell energy, walking away, last glance, session end', color: '#3b82f6', icon: '🌙', count: 0, keywords: ['final', 'last look', 'closing', 'walking away', 'end of session', 'goodbye', 'complete'] },
];
