/** @type {import('next').NextConfig} */
export default {
  // Workspace packages ship TypeScript source, so Next compiles them itself.
  // iconsax-reactjs is listed too: it publishes a CJS main alongside ESM, and
  // without transpiling it the server build resolves named exports to
  // undefined at prerender time.
  transpilePackages: ['@afex/xds-react', 'iconsax-reactjs'],
};
