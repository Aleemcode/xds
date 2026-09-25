/** @type {import('next').NextConfig} */
export default {
  // Workspace packages ship TypeScript source, so Next compiles them itself.
  transpilePackages: ['@afex/xds-react'],
};
