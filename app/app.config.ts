export default defineAppConfig({
  ui: {
    colors: {
      primary: 'red',
      secondary: 'stone',
      neutral: 'stone',
    },
    button: {
      defaultVariants: { color: 'neutral' },
      slots: { base: 'font-headline font-bold uppercase tracking-widest' },
    },
    textarea: {
      defaultVariants: { variant: 'none' },
      slots: { base: 'border border-inverted/40 bg-default focus-visible:border-inverted' },
    },
    input: {
      defaultVariants: { variant: 'none' },
      slots: { base: 'border border-inverted/40 bg-default focus-visible:border-inverted' },
    },
    fileUpload: {
      slots: { base: 'border-inverted/40 bg-default' },
    },
  },
})
