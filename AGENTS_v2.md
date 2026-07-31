# AGENTS.md

## Project Overview

Build a premium, responsive artist roster website for SALXCO.

The site should present the company’s artists in a polished, modern, and highly visual way that feels appropriate for a leading entertainment and artist-management company. It should work beautifully on both mobile phones and desktop/laptop screens.

This is not meant to feel like a standard corporate directory. It should feel like an elevated digital roster, combining the clarity of Apple Contacts with the visual impact of a luxury editorial portfolio.

## Primary Goal

Create an interactive roster experience that allows visitors to:

- Quickly browse the full artist roster
- Search for an artist by name
- Filter artists by category or discipline
- Open an artist profile without leaving the roster experience
- View artist imagery, name, category, and selected profile information
- Move naturally between artists on mobile and desktop
- Experience the roster as premium, intentional, and visually memorable

## Experience Direction

The overall experience should feel:

- Premium
- Minimal
- Editorial
- Modern
- Cinematic
- Easy to navigate
- Mobile-first
- Visually consistent even when artist photography varies

Avoid making the site feel like:

- A generic agency template
- A basic grid of headshots
- A streaming platform clone
- A social-media feed
- A crowded dashboard
- An overly futuristic concept
- A design with excessive glass effects, gradients, shadows, or animation

## Recommended Core Concept

Use an interactive contact-card roster.

Each artist should appear as a clean visual card containing:

- Artist image
- Artist name
- Artist category or discipline
- Optional short descriptor
- A clear interaction state

Selecting an artist should open an expanded profile using one of these patterns:

### Desktop

Use a split-screen layout:

- Artist roster or grid on the left
- Expanded artist profile on the right
- Keep the selected artist visible in context
- Allow keyboard arrow navigation between artists

### Mobile

Use a full-screen profile sheet or page transition:

- Large artist image
- Artist name and category
- Profile information
- Previous and next artist controls
- Swipe navigation where practical
- Clear close or back control

The transition between the roster and artist profile should feel smooth but fast.

## Visual System

### Art Direction

Use a restrained visual system that can accommodate a wide range of artist photography.

Preferred approach:

- Neutral background
- Predominantly black, white, charcoal, warm gray, or soft off-white
- Large, high-quality typography
- Strong spacing
- Consistent image crops
- Subtle borders
- Minimal use of accent color
- Optional translucent surfaces used sparingly

Do not depend on every artist having matching photography.

Create consistency through:

- Fixed image aspect ratios
- Controlled image positioning
- Neutral card frames
- Optional monochrome treatment
- Optional subtle image overlays
- Consistent typography and spacing
- Graceful fallbacks for low-resolution or missing imagery

### Typography

Use a clean sans-serif typeface.

Recommended characteristics:

- Modern
- Editorial
- Highly legible
- Strong at large display sizes
- Clean at small mobile sizes

Use no more than two font families.

Typography hierarchy:

1. Large artist name
2. Category or role
3. Supporting profile text
4. Small utility labels

### Motion

Motion should feel refined and intentional.

Use:

- Subtle card hover movement
- Smooth image scaling
- Soft opacity transitions
- Profile panel transitions
- Animated filtering and sorting
- Reduced-motion support

Avoid:

- Constant floating effects
- Heavy parallax
- Excessive blur
- Long intro animations
- Cursor gimmicks
- Motion that delays access to content

## Responsive Requirements

The website must be designed mobile-first.

### Mobile

- One or two cards per row depending on width
- Large touch targets
- Sticky search or filter control when useful
- Full-screen artist profile
- Swipe-friendly navigation
- No horizontal page overflow
- Fast image loading
- Comfortable spacing around phone safe areas

### Tablet

- Two or three cards per row
- Expanded profile may use a modal or split view
- Controls should remain touch-friendly

### Desktop

- Three to five cards per row depending on viewport
- Split-screen artist profile preferred
- Hover states may enhance the experience
- Keyboard navigation should be supported
- Use the larger screen for editorial composition, not information overload

## Core Features

### Required

- Responsive artist roster
- Search by artist name
- Filter by category
- Artist profile view
- Previous and next artist navigation
- Mobile and desktop layouts
- Accessible keyboard navigation
- Image fallbacks
- Loading states
- Empty search state
- Reduced-motion support
- Semantic HTML
- Strong performance

### Recommended

- Alphabetical browsing
- Featured artist section
- Recently updated artists
- Shareable artist profile URLs
- Copy profile link
- Optional dark and light themes
- Optional list and grid view
- Subtle page-transition animation

### Do Not Add Without Approval

- User accounts
- Public comments
- Likes or favorites
- Music playback
- Auto-playing video
- Social feeds
- Complex CMS features
- Merchandise
- Tour-date integrations
- News feeds
- AI-generated artist descriptions

## Artist Data Model

Store roster content in a structured local data file during the first build.

Suggested shape:

```ts
type Artist = {
  id: string;
  name: string;
  slug: string;
  category: string;
  image: string;
  imageAlt: string;
  shortDescription?: string;
  biography?: string;
  location?: string;
  website?: string;
  instagram?: string;
  spotify?: string;
  featured?: boolean;
  sortOrder?: number;
};
```

Keep the data layer separate from the presentation layer so the roster can later connect to a CMS.

## Initial Artist Roster

Use the following artists as initial placeholder roster entries:

- The Weeknd
- Playboi Carti
- Future
- Young Thug
- Metro Boomin
- Lil Baby
- Brandy
- Rema
- French Montana
- NAV
- Shenseea
- Mathame
- M.I.A.
- Hanumankind
- Belly
- Law Roach
- Eryn Allen Kane
- Unotopic
- Stargate
- DaHeala
- Prince 85
- Love, Brandon
- Breyan Isaac
- Kriss

Do not invent biographies, statistics, management details, social handles, or career claims.

Use clearly marked placeholder content when confirmed information has not been provided.

## Categories

The filtering system should support categories such as:

- Recording Artists
- Producers
- Songwriters
- DJs and Electronic Artists
- Fashion and Creative
- All Artists

Category assignments should remain editable in the roster data file.

## Suggested Technology

Default stack:

- Next.js
- TypeScript
- Tailwind CSS
- Framer Motion for limited interface transitions
- Local structured roster data for the first version
- Next.js Image for responsive image optimization

Use another stack only when the existing repository already establishes one.

Do not replace an existing project’s framework unless necessary.

## Component Structure

Suggested components:

- `RosterPage`
- `RosterHeader`
- `RosterSearch`
- `RosterFilters`
- `ArtistGrid`
- `ArtistCard`
- `ArtistProfile`
- `ArtistProfilePanel`
- `ArtistNavigation`
- `ImageFallback`
- `EmptyState`

Keep components focused and reusable.

Avoid building the entire experience in one large component.

## URL Behavior

Each artist should have a stable slug.

Preferred URL structure:

```text
/artists
/artists/the-weeknd
/artists/playboi-carti
```

Opening a direct artist URL should show the artist profile while retaining an easy route back to the full roster.

## Accessibility

The experience must:

- Use semantic headings and landmarks
- Provide alt text for artist images
- Support keyboard interaction
- Display visible focus states
- Maintain sufficient color contrast
- Support reduced-motion preferences
- Use accessible labels for search, filters, profile controls, and navigation
- Avoid using hover as the only way to reveal information
- Trap and restore focus correctly when modal interfaces are used

## Performance

Prioritize fast loading.

Requirements:

- Optimize and lazy-load artist images
- Avoid oversized image files
- Avoid loading every full-resolution profile image immediately
- Keep animation lightweight
- Minimize unnecessary client-side JavaScript
- Prevent layout shift by reserving image dimensions
- Use responsive image sizes
- Ensure the initial roster is useful before animations finish

## Development Workflow

Before coding:

1. Inspect the existing repository.
2. Identify the current framework, styling system, and routing structure.
3. Reuse established conventions where practical.
4. Do not remove existing functionality unless it directly conflicts with the roster.
5. Create a short implementation plan.

During development:

1. Build the data model first.
2. Build the mobile roster layout.
3. Add desktop enhancements.
4. Add profile interactions.
5. Add search and filtering.
6. Add accessibility behavior.
7. Test edge cases.
8. Polish motion and visual details last.

## Validation Checklist

Before considering the work complete, verify:

- The roster works at 320px width
- The roster works on common laptop sizes
- Search is case-insensitive
- Filters can be reset
- Empty results display a useful message
- Every artist card is keyboard accessible
- Direct artist URLs work
- Browser back behavior works
- Images have fallbacks
- Long artist names do not break cards
- Missing optional fields do not leave awkward gaps
- Profile transitions respect reduced-motion settings
- No horizontal overflow appears
- No artist facts were invented
- The site remains usable with JavaScript loading slowly

## Design Review Standard

The result should be judged against premium entertainment, fashion, editorial, and technology websites rather than ordinary agency-directory templates.

At each design decision, prefer:

- Clarity over decoration
- Strong photography over visual effects
- Editorial spacing over dense UI
- Meaningful interaction over novelty
- Consistency over forced uniformity
- Performance over animation complexity

## Codex Response Expectations

When working on this project:

- Explain major architectural choices briefly
- State assumptions clearly
- Do not invent missing artist information
- Preserve existing project conventions
- Keep the implementation production-oriented
- Provide exact file paths for created or modified files
- Run available linting, type-checking, and tests
- Report any checks that could not be completed
- Do not claim the site is complete when important placeholders remain


# --- DESIGN ADDITIONS (Updated Creative Direction) ---

## Design Inspiration

The interface should feel inspired by Apple's software and hardware design language while remaining original.

Primary references:

- Apple Contacts
- Apple Music
- Apple TV
- visionOS
- iOS Human Interface Guidelines
- macOS Sequoia
- Luxury editorial websites
- High-end fashion portfolios

Apple should be treated as a benchmark for quality, craftsmanship, motion, and clarity—not something to copy directly.

## Creative Direction

Apple's design language should serve as inspiration, not a template.

If a more original interaction, navigation pattern, or layout better showcases the artist roster while maintaining the same level of elegance and usability, prefer the original solution.

The goal is to create something worthy of a modern entertainment company rather than simply recreating Apple's interface.

## Glassmorphism Guidelines

Glass effects should be subtle and used strategically.

Preferred locations:

- Floating navigation
- Search
- Filter controls
- Artist detail panel
- Context menus
- Hover states

Characteristics:

- Soft blur (10–24px)
- Thin white borders
- High transparency
- Rounded corners (18–28px)
- Very subtle shadows

Avoid covering the entire interface in glass panels or relying on blur as decoration.

## Photography Direction

Photography is the most important visual element.

Although artist photos will come from many different sources, the final roster should feel like a single art-directed campaign.

Every portrait should feel cohesive through:

- Consistent color grading
- Similar contrast
- Similar white balance
- Similar crop
- Consistent framing
- Editorial finishing

Target look:

- Neutral color balance
- Rich but natural contrast
- Slightly desaturated
- Deep blacks
- Soft highlight rolloff
- Clean skin tones
- Cinematic editorial finish

When images differ significantly:

- Normalize exposure
- Normalize white balance
- Match color grading
- Match saturation
- Match contrast
- Blur or simplify distracting backgrounds where appropriate

Consistency across the roster is more important than preserving the exact original treatment of every image.

## Typography

Technovier should be the primary display typeface throughout the experience.

Use Technovier for:

- Artist names
- Hero titles
- Large navigation
- Section headings
- Feature typography

Pair it with a clean modern sans-serif (such as Inter or Geist) for:

- Body copy
- UI controls
- Labels
- Search
- Filters
- Supporting text

Maintain generous spacing and avoid decorative typography beyond these two families.

## Interaction Principles

Interactions should feel like native Apple software.

Use:

- Spring animations
- Smooth easing
- Shared element transitions where appropriate
- Gentle scaling
- Soft fades
- Layer elevation

Every animation should reinforce hierarchy or navigation.

Avoid motion that exists purely for decoration.
