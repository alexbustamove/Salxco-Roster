export const categories = [
  "All Artists",
  "Recording Artists",
  "Producers & Songwriters",
  "DJs & Electronic",
  "Fashion & Creative",
] as const;

export type ArtistCategory = (typeof categories)[number];

export type Artist = {
  id: string;
  name: string;
  slug: string;
  category: Exclude<ArtistCategory, "All Artists">;
  image: string;
  imageAlt: string;
  instagram: string;
  cropY: number;
  cropScale?: number;
  cropOffsetY?: number;
  isDuo?: boolean;
  sortOrder: number;
};

export const artists: Artist[] = [
  { id: "01", name: "The Weeknd", slug: "the-weeknd", category: "Recording Artists", image: "/artists/1_The_Weeknd.jpg", imageAlt: "The Weeknd", instagram: "https://www.instagram.com/theweeknd/", cropY: 64, sortOrder: 1 },
  { id: "02", name: "Playboi Carti", slug: "playboi-carti", category: "Recording Artists", image: "/artists/2_Playboi Carti.jpg", imageAlt: "Playboi Carti", instagram: "https://www.instagram.com/playboicarti/", cropY: 69, sortOrder: 2 },
  { id: "03", name: "Future", slug: "future", category: "Recording Artists", image: "/artists/3_Future.jpg", imageAlt: "Future", instagram: "https://www.instagram.com/future/", cropY: 50, sortOrder: 3 },
  { id: "04", name: "Young Thug", slug: "young-thug", category: "Recording Artists", image: "/artists/4_Young_Thug.jpg", imageAlt: "Young Thug", instagram: "https://www.instagram.com/thuggerthugger1/", cropY: 57, sortOrder: 4 },
  { id: "05", name: "Metro Boomin", slug: "metro-boomin", category: "Producers & Songwriters", image: "/artists/5_Metro_Boomin.jpg", imageAlt: "Metro Boomin", instagram: "https://www.instagram.com/metroboomin/", cropY: 32, sortOrder: 5 },
  { id: "06", name: "Lil Baby", slug: "lil-baby", category: "Recording Artists", image: "/artists/6_Lil_Baby.jpg", imageAlt: "Lil Baby", instagram: "https://www.instagram.com/lilbaby/", cropY: 21, sortOrder: 6 },
  { id: "07", name: "Brandy", slug: "brandy", category: "Recording Artists", image: "/artists/7_Brandy.jpg", imageAlt: "Brandy", instagram: "https://www.instagram.com/brandy/", cropY: 66, sortOrder: 7 },
  { id: "08", name: "Rema", slug: "rema", category: "Recording Artists", image: "/artists/8_Rema.jpg", imageAlt: "Rema", instagram: "https://www.instagram.com/heisrema/", cropY: 26, cropScale: 1.05, sortOrder: 8 },
  { id: "09", name: "French Montana", slug: "french-montana", category: "Recording Artists", image: "/artists/9_French_Montana.jpg", imageAlt: "French Montana", instagram: "https://www.instagram.com/frenchmontana/", cropY: 32, sortOrder: 9 },
  { id: "10", name: "Nav", slug: "nav", category: "Recording Artists", image: "/artists/10_Nav.jpg", imageAlt: "Nav", instagram: "https://www.instagram.com/nav/", cropY: 45, cropScale: 1, sortOrder: 10 },
  { id: "11", name: "Shenseea", slug: "shenseea", category: "Recording Artists", image: "/artists/11_Shenseea.jpg", imageAlt: "Shenseea", instagram: "https://www.instagram.com/shenseea/", cropY: 48, sortOrder: 11 },
  { id: "12", name: "Mathame", slug: "mathame", category: "DJs & Electronic", image: "/artists/12_Mathame.jpg", imageAlt: "Mathame", instagram: "https://www.instagram.com/mathame_/", cropY: 35, isDuo: true, sortOrder: 12 },
  { id: "13", name: "M.I.A.", slug: "mia", category: "Recording Artists", image: "/artists/13_MIA.jpg", imageAlt: "M.I.A.", instagram: "https://www.instagram.com/miamatangi/", cropY: 50, sortOrder: 13 },
  { id: "14", name: "Hanumankind", slug: "hanumankind", category: "Recording Artists", image: "/artists/14_Hanumankind.jpg", imageAlt: "Hanumankind", instagram: "https://www.instagram.com/hanumankind/", cropY: 48, cropScale: 1.12, sortOrder: 14 },
  { id: "15", name: "Belly", slug: "belly", category: "Recording Artists", image: "/artists/15_Belly.jpg", imageAlt: "Belly", instagram: "https://www.instagram.com/belly/", cropY: 55, cropScale: 1, sortOrder: 15 },
  { id: "16", name: "Law Roach", slug: "law-roach", category: "Fashion & Creative", image: "/artists/16_Law_Roach.jpg", imageAlt: "Law Roach", instagram: "https://www.instagram.com/luxurylaw/", cropY: 18, cropScale: 1.25, sortOrder: 16 },
  { id: "17", name: "Eryn Allen Kane", slug: "eryn-allen-kane", category: "Recording Artists", image: "/artists/17_Eryn_Allen_Kane.jpg", imageAlt: "Eryn Allen Kane", instagram: "https://www.instagram.com/erynallenkane/", cropY: 93, sortOrder: 17 },
  { id: "18", name: "Unotopic", slug: "unotopic", category: "Recording Artists", image: "/artists/18_Unotopic.jpg", imageAlt: "Unotopic", instagram: "https://www.instagram.com/unotopicmusica?igsh=NTc4MTIwNjQ2YQ==", cropY: 67, sortOrder: 18 },
  { id: "19", name: "Stargate", slug: "stargate", category: "Producers & Songwriters", image: "/artists/19_Stargate.jpg", imageAlt: "Stargate", instagram: "https://www.instagram.com/stargate/", cropY: 82, isDuo: true, sortOrder: 19 },
  { id: "20", name: "DaHeala", slug: "daheala", category: "Producers & Songwriters", image: "/artists/20_DaHeala.jpg", imageAlt: "DaHeala", instagram: "https://www.instagram.com/daheala/", cropY: 88, sortOrder: 20 },
  { id: "21", name: "Prince 85", slug: "prince-85", category: "Producers & Songwriters", image: "/artists/21_Prince_85.jpg", imageAlt: "Prince 85", instagram: "https://www.instagram.com/prince85/", cropY: 25, cropScale: 1.54, cropOffsetY: 7, sortOrder: 21 },
  { id: "22", name: "Rex Kudo", slug: "rex-kudo", category: "Producers & Songwriters", image: "/artists/22_Rex_Kudo.jpg", imageAlt: "Rex Kudo", instagram: "https://www.instagram.com/rexkudo/", cropY: 81, sortOrder: 22 },
  { id: "23", name: "Breyan Isaac", slug: "breyan-isaac", category: "Producers & Songwriters", image: "/artists/23_Breyan_Isaac.jpg", imageAlt: "Breyan Isaac", instagram: "https://www.instagram.com/b2thar?igsh=NTc4MTIwNjQ2YQ==", cropY: 61, sortOrder: 23 },
  { id: "24", name: "Love, Brandon", slug: "love-brandon", category: "Producers & Songwriters", image: "/artists/24_Love_Brandon.jpg", imageAlt: "Love, Brandon", instagram: "https://www.instagram.com/brandon_arreaga?igsh=NTc4MTIwNjQ2YQ==", cropY: 58, sortOrder: 24 },
  { id: "25", name: "Kriss", slug: "kriss", category: "Recording Artists", image: "/artists/25_Kriss.jpg", imageAlt: "Kriss", instagram: "https://www.instagram.com/krissm.e?igsh=NTc4MTIwNjQ2YQ==", cropY: 20, cropScale: 1.025, sortOrder: 25 },
];
