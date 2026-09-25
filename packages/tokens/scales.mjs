// AFEX raw colour scales, transcribed from the design system screenshots (21 Sep 2026).
// Steps are 1..12 as published. Step 9 is held constant across themes on every
// correctly-built scale — that is the Radix contract and it holds on all six below.
//
// PROVENANCE: the six scales in CORE are genuine Radix-shaped 12-step scales.
// The scales in ADDITIONAL_RAW are NOT — see notes at the bottom of this file.

export const CORE = {
  // Brand. Step 9 is the AFEX red.
  main: {
    light: ['#FFFCFB','#FFF8F6','#FFEBE7','#FFDBD4','#FFCBC2','#FFBBAF',
            '#FBA698','#F38A7B','#E1261C','#D20000','#B7100A','#641D16'],
    dark:  ['#170F0D','#201412','#3C130E','#530D08','#64130D','#752119',
            '#8E3228','#B74235','#E1261C','#D10504','#FF8E7C','#FFD1C9'],
  },
  // Warm-tinted neutral. Carries every surface, border and text token.
  parasol: {
    light: ['#FEFDFD','#FAF9F9','#F2EFEF','#EBE7E7','#E4E0E0','#DDD8D8',
            '#D3CDCD','#C1B9B9','#948A8A','#897F7F','#686161','#241E1E'],
    dark:  ['#111111','#1A1919','#232222','#2A2929','#323131','#3B3A3A',
            '#4A4848','#625F5F','#706D6D','#7E7B7B','#B6B3B3','#EEEEEE'],
  },
  success: {
    light: ['#FBFEFC','#F4FBF7','#E4F7EC','#D4F1E0','#C2E9D2','#ABDEC1',
            '#8BCFA9','#5ABA89','#0C8F5C','#00834D','#00814F','#1B3B2B'],
    dark:  ['#0A130E','#101C15','#092E1D','#003E23','#004C2C','#005B37',
            '#006C43','#00814F','#0C8F5C','#00814F','#64D199','#9CF7C5'],
  },
  information: {
    light: ['#FBFDFF','#F4FAFF','#E6F4FE','#D5EFFF','#C2E5FF','#ACD8FC',
            '#8EC8F6','#5EB1EF','#0090FF','#0588F0','#0D74CE','#113264'],
    dark:  ['#0D1520','#111927','#0D2847','#003362','#004074','#104D87',
            '#205D9E','#2870BD','#0090FF','#3B9EFF','#70B8FF','#C2E6FF'],
  },
  warning: {
    light: ['#FEFDFB','#FEFBE9','#FFF7C2','#FFEE9C','#FBE577','#F3D673',
            '#E9C162','#E2A336','#FFC53D','#FFBA18','#AB6400','#4F3422'],
    dark:  ['#16120C','#1D180F','#302008','#3F2700','#4D3000','#5C3D05',
            '#714F19','#8F6424','#FFC53D','#FFD60A','#FFCA16','#FFE7B3'],
  },
  error: {
    light: ['#FFFCFC','#FFF7F7','#FEEBEC','#FFDBDC','#FFCDCE','#FDBDBE',
            '#F4A9AA','#EB8E90','#E5484D','#DC3E42','#CE2C31','#641723'],
    dark:  ['#191111','#201314','#3B1219','#500F1C','#611623','#72232D',
            '#8C333A','#B54548','#E5484D','#EC5D5E','#FF9592','#FFD1D9'],
  },
};

// The X-Additional set, exactly as published.
//
// THESE ARE BROKEN, and in a precisely diagnosable way: each one's `light`
// column is its own DARK scale printed in reverse. Verified on every scale
// where a canonical anchor exists — e.g. Tomato light[3] === Tomato dark[8]
// === #E54D2E, the real Radix Tomato step 9.
//
// Consequences: light step 1 is a mid-tint rather than an app background, so
// none of the Radix step meanings survive in light mode; Ruby's dark column is
// byte-identical to Error's; and Amber is Warning under another name
// (Amber light[3] === Warning dark[8] === #FFC53D).
//
// They are kept here for reference and for the audit, and are NOT consumed by
// the generator. The chart palette is built from verified step-9 solids instead.
export const ADDITIONAL_RAW = {
  bronze: { light:['#EDE0D9','#D4B3A5','#AE8C7E','#A18072','#6F5F58','#5A4C47','#493E3A','#3B3330','#302A27','#262220','#1C1917','#141110'],
            dark: ['#43302B','#7D5E54','#957468','#A18072','#C2A499','#D3BCB3','#DFCDC5','#E7D9D3','#EFE4DF','#F6EDEA','#FDF7F5','#FDFCFC'] },
  cyan:   { light:['#B6ECF7','#4CCCE6','#23AFD0','#00A2C7','#11809C','#12677E','#045468','#004558','#003848','#082C36','#101B20','#0B161A'],
            dark: null }, // never supplied
  purple: { light:['#ECD9FA','#D19DFF','#9A5CD0','#8E4EC6','#8457AA','#664282','#54346B','#48295C','#3D224E','#301C3B','#1E1523','#18111B'],
            dark: ['#18111B','#1E1523','#301C3B','#3D224E','#48295C','#54346B','#664282','#8457AA','#8E4EC6','#9A5CD0','#D19DFF','#ECD9FA'] },
  jade:   { light:['#ADF0D4','#1FD8A4','#27B08B','#29A383','#2A7E68','#246854','#1B5745','#114837','#0B3B2C','#0F2E22','#121C18','#0D1512'],
            dark: ['#1D3B31','#208368','#26997B','#29A383','#56BA9F','#8BCEB6','#ACDEC8','#C3E9D7','#D6F1E3','#E6F7ED','#F4FBF7','#FBFEFD'] },
  tomato: { light:['#FBD3CB','#FF977D','#EC6142','#E54D2E','#AC4D39','#853A2D','#6E2920','#5E1C16','#4E1511','#391714','#1F1513','#181111'],
            dark: ['#181111','#1F1513','#391714','#4E1511','#5E1C16','#6E2920','#853A2D','#AC4D39','#E54D2E','#EC6142','#FF977D','#FBD3CB'] },
  ruby:   { light:['#FED2E1','#FF949D','#EC5A72','#E54666','#B3445A','#883447','#6F2539','#5E1A2E','#4E1325','#3A141E','#1E1517','#191113'],
            dark: ['#191111','#201314','#3B1219','#500F1C','#611623','#72232D','#8C333A','#B54548','#E5484D','#EC5D5E','#FF9592','#FFD1D9'] },
  pink:   { light:['#FDD1EA','#FF8DCC','#DE51A8','#D6409F','#A84885','#833869','#692955','#591C47','#4B143D','#37172F','#21121D','#191117'],
            dark: ['#651249','#C2298A','#CF3897','#D6409F','#DD93C2','#E7ACD0','#EFBFDD','#F6CEE7','#FBDCEF','#FEE9F5','#FEF7FB','#FFFCFE'] },
  amber:  { light:['#FFE7B3','#FFCA16','#FFD60A','#FFC53D','#8F6424','#714F19','#5C3D05','#4D3000','#3F2700','#302008','#1D180F','#16120C'],
            dark: ['#4F3422','#AB6400','#FFBA18','#FFC53D','#E2A336','#E9C162','#F3D673','#FBE577','#FFEE9C','#FFF7C2','#FEFBE9','#FEFDFB'] },
  // mint: never supplied
  // sky:  never supplied
};

// Verified step-9 solids. On a correct Radix scale step 9 is theme-constant,
// which is why these are single values rather than a light/dark pair. Every
// entry is present verbatim in the published data.
export const SOLID_9 = {
  main:        '#E1261C',
  error:       '#E5484D',
  warning:     '#FFC53D',
  success:     '#0C8F5C',
  information: '#0090FF',
  tomato:      '#E54D2E',
  ruby:        '#E54666',
  purple:      '#8E4EC6',
  jade:        '#29A383',
  pink:        '#D6409F',
  cyan:        '#00A2C7',
  bronze:      '#A18072',
};

export const RADIUS = {
  none: 0, xs: 2, sm: 4, md: 6, lg: 8, xl: 12,
  '2xl': 16, '3xl': 24, '4xl': 32, full: 9999,
};

export const SPACING_PUBLISHED = {
  none: 0, xxs: 2, xs: 4, sm: 6, md: 8, lg: 10, xl: 12, xxl: 14,
  '3xl': 16, '4xl': 18, '5xl': 20, '6xl': 24, '7xl': 28, '8xl': 32,
  '9xl': 36, '10xl': 40, '11xl': 48, '12xl': 56, '13xl': 64,
  '14xl': 72, '15xl': 80, '16xl': 88,
};
